#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CAP="${CAP:-$ROOT/dist/FIDO2.cap}"
GP_BIN="${GP_BIN:-gp}"

if [[ ! -f "$CAP" ]]; then
  echo "CAP not found: $CAP" >&2
  echo "Run npm run card:build first." >&2
  exit 1
fi

if ! command -v "$GP_BIN" >/dev/null 2>&1; then
  echo "GlobalPlatformPro 'gp' was not found. Install it or set GP_BIN." >&2
  exit 1
fi

GP_ARGS=()
if [[ -n "${GP_READER:-}" ]]; then
  GP_ARGS+=("-r" "$GP_READER")
fi
if [[ -n "${GP_KEY:-}" ]]; then
  GP_ARGS+=("-k" "$GP_KEY")
fi

echo "Readers visible to GlobalPlatformPro:"
"$GP_BIN" -list || true

echo "Installing $CAP"
"$GP_BIN" "${GP_ARGS[@]}" -install "$CAP"
