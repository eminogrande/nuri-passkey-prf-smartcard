#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8765}"

cd "$ROOT"
PORT="$PORT" node scripts/serve-prf-test.mjs
