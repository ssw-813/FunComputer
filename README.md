# FunSystem (x64) - generador de ISO

Este repositorio prepara una **distribución Linux x64 personalizada** llamada **FunSystem** usando `live-build` (Debian Bookworm).

Incluye:
- Boot animation (Plymouth) con logo FunComputer.
- Fondo de pantalla por defecto con el logo FunComputer.
- Paquetes solicitados: **Firefox**, **Thunderbird** y **LibreOffice**.
- Firmware/controladores comunes (Realtek, Intel WiFi, non-free firmware).

## Estructura

- `assets/`: logos y wallpaper SVG.
- `funsystem-live/`: configuración de `live-build`.
- `scripts/build_funsystem_iso.sh`: script de construcción.

## Cómo generar `funsystem.iso`

> Requiere entorno Debian/Ubuntu con red y privilegios para instalar dependencias y construir imagen.

```bash
sudo apt-get update
sudo apt-get install -y live-build debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools dosfstools
./scripts/build_funsystem_iso.sh
```

El archivo ISO quedará dentro de `funsystem-live/` (normalmente con nombre `live-image-amd64.hybrid.iso`).
Puedes renombrarlo a:

```bash
mv funsystem-live/live-image-amd64.hybrid.iso funsystem.iso
```

## Notas

- El fondo y el boot animation usan SVG para evitar dependencias extra durante la preparación.
- Si deseas usar exactamente una imagen PNG concreta, reemplaza los SVG en:
  - `/usr/share/backgrounds/funsystem-wallpaper.svg`
  - `/usr/share/plymouth/themes/funsystem/logo.svg`
