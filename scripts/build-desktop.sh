#!/usr/bin/env bash
# Build the Vedic Astro desktop installer.
#
# Prerequisites:
#   - Node.js 18+
#   - Python 3.11+ with pip
#   - Backend Python deps: cd backend && pip install -r requirements.txt
#
# Usage:
#   bash scripts/build-desktop.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> [1/5] Installing web dependencies..."
cd "$REPO_ROOT/web"
npm install

echo "==> [2/5] Building React app..."
npm run build
# Output: web/dist/

echo "==> [3/5] Copying React build to backend/static/..."
rm -rf "$REPO_ROOT/backend/static"
cp -r "$REPO_ROOT/web/dist" "$REPO_ROOT/backend/static"

echo "==> [4/5] Building Python backend with PyInstaller..."
cd "$REPO_ROOT/backend"
pip install -r requirements-build.txt --quiet
pyinstaller backend.spec --noconfirm
# Output: backend/dist/vedic-astro-backend/

echo "==> [5/5] Building Electron installer..."
cd "$REPO_ROOT/desktop"
npm install
npm run build
# Output: desktop/dist/

echo ""
echo "✅  Build complete! Installer is in desktop/dist/"
