#!/usr/bin/env bash
# Boot the NOLO OR set-up exercise + a public tunnel.
# Prefers cloudflared (no account, no interstitial); falls back to ngrok.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-3000}"

echo "▶ starting server on :$PORT"
PORT="$PORT" node server.js &
SERVER_PID=$!
trap 'echo; echo "▶ stopping"; kill $SERVER_PID 2>/dev/null || true' EXIT INT TERM
sleep 1

echo
if command -v cloudflared >/dev/null 2>&1; then
  echo "▶ tunnel: cloudflared — copy the https URL below, open  <url>/board  on the projector"
  echo
  cloudflared tunnel --url "http://localhost:$PORT"
elif command -v ngrok >/dev/null 2>&1; then
  echo "▶ tunnel: ngrok — open the Forwarding https URL it prints, then  <url>/board  on the projector"
  echo "  (ngrok free shows a one-time 'Visit Site' page to each phone — that's expected.)"
  echo "  Tip for a cleaner link:  brew install cloudflared  and re-run."
  echo
  ngrok http "$PORT"
else
  IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "<your-ip>")
  echo "▶ no tunnel found. LAN fallback (needs everyone on the same wifi, no client isolation):"
  echo "    participants : http://$IP:$PORT/join"
  echo "    big screen   : http://$IP:$PORT/board"
  echo
  echo "  For a public link instead:  brew install cloudflared  (no account) and re-run."
  wait $SERVER_PID
fi
