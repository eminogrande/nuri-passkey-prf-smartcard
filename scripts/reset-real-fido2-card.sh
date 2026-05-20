#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="${FIDO2_TEST_VENV:-/tmp/nuri-fido2-real-card-venv}"
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3)}"
REQ_ID="real-card-fido2-2.1.1"

if [[ "${FIDO2_RESET_CONFIRM:-}" != "YES" ]]; then
  echo "Refusing to reset without explicit confirmation." >&2
  echo "This erases FIDO2 credentials and PIN/authenticator state on the inserted card." >&2
  echo "Run: FIDO2_RESET_CONFIRM=YES npm run card:reset" >&2
  exit 64
fi

if [[ ! -x "$VENV/bin/python" ]] || [[ ! -f "$VENV/.nuri-requirements" ]] || [[ "$(cat "$VENV/.nuri-requirements")" != "$REQ_ID" ]]; then
  rm -rf "$VENV"
  "$PYTHON_BIN" -m venv "$VENV"
  "$VENV/bin/pip" install 'fido2[pcsc]==2.1.1'
  echo "$REQ_ID" >"$VENV/.nuri-requirements"
fi

"$VENV/bin/python" "$ROOT/scripts/reset-real-fido2-card.py"
