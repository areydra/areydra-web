#!/usr/bin/env bash
# ci:csp-header-test — the headers a browser needs, and the nonce coverage a
# header-only check misses. Usage: check-security-headers.sh <url>
#
# Required by default: CSP, X-Content-Type-Options, Referrer-Policy,
# Permissions-Policy, and frame-ancestors in the CSP. HSTS is production-only,
# so it is opt-in via REQUIRE_HSTS=1 (a dev server legitimately omits it).
set -uo pipefail

url="${1:?usage: check-security-headers.sh <url>}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

curl -sS -D "$tmp/h" -o "$tmp/body" "$url" || {
  echo "FAIL could not fetch $url"
  exit 1
}
fail=0

for h in content-security-policy x-content-type-options referrer-policy permissions-policy; do
  grep -qi "^${h}:" "$tmp/h" || {
    echo "FAIL missing ${h}"
    fail=1
  }
done
grep -qi '^x-content-type-options: *nosniff' "$tmp/h" || {
  echo "FAIL x-content-type-options is not nosniff"
  fail=1
}
if [ "${REQUIRE_HSTS:-0}" = "1" ]; then
  grep -qi '^strict-transport-security:' "$tmp/h" || {
    echo "FAIL missing strict-transport-security"
    fail=1
  }
fi

csp="$(grep -i '^content-security-policy:' "$tmp/h" | head -1)"
if ! printf '%s' "$csp" | grep -qi "frame-ancestors 'none'"; then
  echo "FAIL CSP has no frame-ancestors 'none'"
  fail=1
fi

nonce="$(printf '%s' "$csp" | grep -o "nonce-[A-Za-z0-9+/=_-]*" | head -1 | cut -d- -f2-)"

if [ -n "$nonce" ]; then
  bad="$(grep -o '<script[^>]*>' "$tmp/body" | grep -v ' src=' | grep -v "nonce=\"${nonce}\"" | wc -l)"
  if [ "$bad" -ne 0 ]; then
    echo "FAIL ${bad} inline script(s) without the nonce — the page will paint and never hydrate"
    fail=1
  fi
  script_src="$(printf '%s' "$csp" | grep -o "script-src[^;]*")"
  case "$script_src" in
    *unsafe-inline*)
      echo "FAIL script-src allows 'unsafe-inline' next to a nonce (ignored by browsers, hides the real policy)"
      fail=1
      ;;
  esac
else
  echo "FAIL CSP carries no nonce — Next's inline bootstrap scripts will be blocked"
  fail=1
fi

[ "$fail" -eq 0 ] && echo "OK security headers + nonce coverage: $url"
exit "$fail"
