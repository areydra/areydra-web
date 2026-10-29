#!/usr/bin/env bash
# ci:secret-grep — fail when a credential is committed, when a secret-shaped name
# is exposed through NEXT_PUBLIC_ (public by definition), or when a .env is tracked.
# Scans tracked files only. Allowlist false positives in .secretsignore (one path per line).
set -uo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "FAIL not a git work tree — this gate scans tracked files only"
  exit 2
fi

fail=0
ignore="${SECRETS_IGNORE:-.secretsignore}"

patterns=(
  'aws-access-key-id|AKIA[0-9A-Z]{16}'
  'private-key-block|-----BEGIN [A-Z ]*PRIVATE KEY-----'
  'stripe-live-key|sk_live_[0-9A-Za-z]{16,}'
  'github-token|gh[pousr]_[A-Za-z0-9]{30,}'
  'slack-token|xox[baprs]-[0-9A-Za-z-]{10,}'
  'jwt|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
  'db-url-with-password|(postgres(ql)?|mysql|mongodb(\+srv)?|redis)://[^:/@[:space:]]+:[^@[:space:]]+@'
)

for entry in "${patterns[@]}"; do
  label="${entry%%|*}"
  regex="${entry#*|}"
  hits="$(git grep -nIE "$regex" -- . ':!*.lock' ':!pnpm-lock.yaml' ':!package-lock.json' 2>/dev/null || true)"
  [ -z "$hits" ] && continue
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    file="${hit%%:*}"
    if [ -f "$ignore" ] && grep -qxF -- "$file" "$ignore"; then
      continue
    fi
    echo "FAIL ${label}: ${file}:$(printf '%s' "$hit" | cut -d: -f2)"
    fail=1
  done <<<"$hits"
done

# NEXT_PUBLIC_* ships to the browser: a secret-shaped name under that prefix is a
# leak by construction, not a smell. Publishable/anon keys are explicitly not matched.
env_hits="$(git grep -nIE 'NEXT_PUBLIC_[A-Z0-9_]*(SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|TOKEN|API_KEY)[A-Z0-9_]*[[:space:]]*=' -- . ':!*.lock' ':!pnpm-lock.yaml' ':!*.md' 2>/dev/null || true)"
if [ -n "$env_hits" ]; then
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    echo "FAIL secret exposed through NEXT_PUBLIC_: ${hit%%:*}"
    fail=1
  done <<<"$env_hits"
fi

tracked_env="$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -vE '\.env\.(example|sample|template)$' || true)"
if [ -n "$tracked_env" ]; then
  while IFS= read -r f; do
    echo "FAIL tracked env file (belongs in .gitignore): $f"
    fail=1
  done <<<"$tracked_env"
fi

if [ "$fail" -eq 0 ]; then
  echo "OK no committed credentials, no secret-shaped NEXT_PUBLIC_ names, no tracked .env"
fi
exit "$fail"
