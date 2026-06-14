#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="${FIDO2_BACKUP_VENV:-/tmp/nuri-fido2-real-card-venv}"
if [[ -z "${PYTHON_BIN:-}" ]]; then
  if [[ -x /opt/homebrew/bin/python3.13 ]]; then
    PYTHON_BIN="/opt/homebrew/bin/python3.13"
  else
    PYTHON_BIN="$(command -v python3)"
  fi
fi
PY_TAG="$("$PYTHON_BIN" -c 'import sys; print(f"py{sys.version_info.major}{sys.version_info.minor}")')"
REQ_ID="real-card-fido2-2.1.1-$PY_TAG"

if [[ ! -x "$VENV/bin/python" ]] || [[ ! -f "$VENV/.nuri-requirements" ]] || [[ "$(cat "$VENV/.nuri-requirements")" != "$REQ_ID" ]]; then
  rm -rf "$VENV"
  "$PYTHON_BIN" -m venv "$VENV"
  "$VENV/bin/pip" install 'fido2[pcsc]==2.1.1'
  echo "$REQ_ID" >"$VENV/.nuri-requirements"
fi

"$VENV/bin/python" "$ROOT/scripts/card-prf-backup.py" "$@"
