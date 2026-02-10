#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/funsystem-live"

if ! command -v lb >/dev/null 2>&1; then
  echo "ERROR: 'lb' (live-build) no está instalado."
  echo "Instala en Debian/Ubuntu con: sudo apt-get install live-build"
  exit 1
fi

cd "$BUILD_DIR"

if [[ "${1:-}" == "clean" ]]; then
  sudo lb clean --purge
  echo "Limpieza completada."
  exit 0
fi

./auto/config
sudo lb build

ISO_PATH=$(find . -maxdepth 1 -name '*.iso' -print -quit)
if [[ -n "$ISO_PATH" ]]; then
  echo "ISO generada: $BUILD_DIR/${ISO_PATH#./}"
else
  echo "Build finalizado, pero no se encontró la ISO en $BUILD_DIR"
fi
