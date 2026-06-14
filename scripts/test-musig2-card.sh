#!/usr/bin/env bash
set -euo pipefail

MUSIG2_TEST_TOOL="${MUSIG2_TEST_TOOL:-../nuri-smartcard-musig2/python-tool/nuri_musig2_test.py}"
MUSIG2_PYTHON="${MUSIG2_PYTHON:-/private/tmp/nuri-fido2-real-card-venv/bin/python}"

if [[ ! -f "$MUSIG2_TEST_TOOL" ]]; then
  echo "MuSig2 test tool not found: $MUSIG2_TEST_TOOL" >&2
  echo "Set MUSIG2_TEST_TOOL=/path/to/nuri_musig2_test.py or place ../nuri-smartcard-musig2 next to this repo." >&2
  exit 1
fi

if [[ ! -x "$MUSIG2_PYTHON" ]]; then
  MUSIG2_PYTHON="python3"
fi

exec "$MUSIG2_PYTHON" "$MUSIG2_TEST_TOOL"
