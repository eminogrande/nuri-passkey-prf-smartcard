#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== node tests =="
npm test

echo
echo "== server cosigner smoke: software backend =="
npm run server:cosigner:software

echo
echo "== server cosigner smoke: card simulator backend =="
npm run server:cosigner:card-sim

echo
echo "== server cosigner smoke: APDU simulator backend =="
npm run server:cosigner:apdu-sim

if [[ "${REAL_CARD:-0}" == "1" ]]; then
  echo
  echo "== real FIDO2 PRF card info =="
  npm run card:prf:info

  echo
  echo "== real FIDO2 PRF card selftest =="
  npm run card:prf:selftest -- --profile cli-e2e --force
else
  echo
  echo "== real card tests skipped =="
  echo "Set REAL_CARD=1 to include PC/SC FIDO2 PRF info + selftest."
fi

echo
echo "CLI_E2E_OK"
