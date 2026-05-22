#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8765}"

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed or not in PATH." >&2
  echo "Install ngrok, or run npm run web:prf and expose port $PORT another way." >&2
  exit 2
fi

server_pid=""
if ! curl -fsS "http://127.0.0.1:$PORT/prf-test.html" >/dev/null 2>&1; then
  (
    cd "$ROOT/web"
    python3 -m http.server "$PORT" --bind 127.0.0.1
  ) &
  server_pid="$!"
fi

cleanup() {
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "Starting ngrok tunnel for http://127.0.0.1:$PORT/prf-test.html"
ngrok http "$PORT" --log=stdout &
ngrok_pid="$!"

for _ in {1..20}; do
  if url="$(curl -fsS http://127.0.0.1:4040/api/tunnels 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{try{const j=JSON.parse(s); const t=(j.tunnels||[]).find(x=>x.proto==='https') || (j.tunnels||[])[0]; if(t) console.log(t.public_url + '/prf-test.html');}catch{}})")" && [[ -n "$url" ]]; then
    echo
    echo "Open this on Android Chrome:"
    echo "$url"
    echo
    break
  fi
  sleep 0.5
done

wait "$ngrok_pid"
