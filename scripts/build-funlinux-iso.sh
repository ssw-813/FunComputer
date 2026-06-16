#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="${ROOT_DIR}/build"
LB_DIR="${ROOT_DIR}/live-build-config"

required=(lb)
for cmd in "${required[@]}"; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Falta dependencia: ${cmd}" >&2
    echo "Instala: sudo apt-get update && sudo apt-get install -y live-build" >&2
    exit 1
  fi
done

mkdir -p "${WORK_DIR}"
rsync -a --delete "${LB_DIR}/" "${WORK_DIR}/"

pushd "${WORK_DIR}" >/dev/null
sudo lb clean --purge || true
./auto/config
sudo lb build
popd >/dev/null

ISO_PATH="$(find "${WORK_DIR}" -maxdepth 1 -type f -name '*.iso' | head -n1 || true)"
if [[ -z "${ISO_PATH}" ]]; then
  echo "No se generó ningún ISO." >&2
  exit 1
fi

echo "ISO generado en: ${ISO_PATH}"
