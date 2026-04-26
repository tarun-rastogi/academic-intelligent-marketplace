#!/usr/bin/env bash
# Stop all dev processes for this monorepo, free ports 3001/4000, then you can run `npm run dev`.
# macOS / Linux. Matches path fragment "digital-academic-marketplace" (works with spaces in parent path).

set -u

BIN="digital-academic-marketplace/node_modules/.bin"

echo "Stopping prior dev processes for this repo…"
# Order: concurrently (parents) → bundlers → watchers
pkill -TERM -f "${BIN}/concurrently" 2>/dev/null || true
sleep 1
pkill -KILL -f "${BIN}/concurrently" 2>/dev/null || true
pkill -KILL -f "${BIN}/tsx watch" 2>/dev/null || true
pkill -KILL -f "${BIN}/next dev" 2>/dev/null || true
# Production `next start` shows in ps as "next-server (v…)" with no path — free by port below.
pkill -KILL -f "digital-academic-marketplace.*next dev" 2>/dev/null || true
pkill -KILL -f "digital-academic-marketplace.*next start" 2>/dev/null || true
sleep 1

kill_port() {
  local port="$1"
  if pids=$(lsof -ti:"$port" 2>/dev/null); then
    echo "$pids" | sort -u | xargs kill -9 2>/dev/null || true
  fi
}

for _ in 1 2 3; do
  kill_port 3001
  kill_port 4000
  sleep 0.5
done

for i in $(seq 1 30); do
  n4000=$(lsof -tiTCP:4000 -sTCP:LISTEN 2>/dev/null | wc -l | tr -d " \n" || echo 0)
  n3001=$(lsof -tiTCP:3001 -sTCP:LISTEN 2>/dev/null | wc -l | tr -d " \n" || echo 0)
  if [[ "$n4000" == "0" && "$n3001" == "0" ]]; then
    echo "Ports 3001 and 4000 are free. Run: npm run dev"
    echo "If http://localhost:3001/ still returns HTTP 500, run: npm run fix:web"
    exit 0
  fi
  kill_port 4000
  kill_port 3001
  sleep 0.5
done

echo "Warning: a process may still hold 3001/4000 — check Activity Monitor or other terminals." >&2
