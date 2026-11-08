#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Instale Node.js 22 ou mais recente."
  exit 1
fi
exec node tools/server.mjs
