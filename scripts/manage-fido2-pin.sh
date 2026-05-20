#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="${FIDO2_TEST_VENV:-/tmp/nuri-fido2-real-card-venv}"
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3)}"
REQ_ID="real-card-fido2-2.1.1"

if [[ ! -x "$VENV/bin/python" ]] || [[ ! -f "$VENV/.nuri-requirements" ]] || [[ "$(cat "$VENV/.nuri-requirements")" != "$REQ_ID" ]]; then
  rm -rf "$VENV"
  "$PYTHON_BIN" -m venv "$VENV"
  "$VENV/bin/pip" install 'fido2[pcsc]==2.1.1'
  echo "$REQ_ID" >"$VENV/.nuri-requirements"
fi

"$VENV/bin/python" "$ROOT/scripts/manage-fido2-pin.py" "$@"
