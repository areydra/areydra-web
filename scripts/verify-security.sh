#!/usr/bin/env bash
# ci:secret-grep + ci:npm-audit (+ ci:csp-header-test when a server is up).
#
#   SECURITY_BASE_URL   when set (e.g. http://127.0.0.1:3000 after `next start`),
#                       also asserts the security headers and the nonce coverage.
#   REQUIRE_HSTS=1      assert HSTS too (production only; dev servers omit it).
#   AUDIT_LEVEL         severity that fails the build (default: high).
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fail=0

step() { printf '\n== %s\n' "$1"; }

step "secrets"
bash "$here/check-secrets.sh" || fail=1

step "dependencies"
level="${AUDIT_LEVEL:-high}"
if [ -f yarn.lock ]; then
  # Yarn 1 audits the tree from yarn.lock; `--groups dependencies` is the
  # equivalent of npm's `--omit=dev`, so a dev-only advisory cannot fail the gate.
  yarn audit --groups dependencies --level="$level" || fail=1
else
  echo "SKIP no yarn.lock — a gate needs a lockfile to audit"
  fail=1
fi

step "security headers"
if [ -n "${SECURITY_BASE_URL:-}" ]; then
  bash "$here/check-security-headers.sh" "$SECURITY_BASE_URL" || fail=1
else
  echo "SKIP SECURITY_BASE_URL not set — headers are only checked against a running server"
fi

printf '\n'
if [ "$fail" -ne 0 ]; then
  echo "FAIL verify:security"
  exit 1
fi
echo "OK verify:security"
