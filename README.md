# FunLinux (Ubuntu + entorno Xubuntu)

Este repositorio prepara una distro **FunLinux** basada en Ubuntu (live ISO) con:

- Entorno **XFCE/Xubuntu**.
- Branding con el logo de FunComputer.
- Logo aplicado al **boot splash (Plymouth)**.
- Logo aplicado como **fondo de pantalla por defecto**.

## Requisitos (host de build)

```bash
sudo apt-get update
sudo apt-get install -y live-build rsync xorriso squashfs-tools debootstrap
```

## Generar el ISO

```bash
./scripts/build-funlinux-iso.sh
```

El ISO resultante se crea en `build/`.

## Archivos principales

- `live-build-config/auto/config`: parámetros de construcción Ubuntu ISO.
- `live-build-config/config/package-lists/funlinux.list.chroot`: paquetes para experiencia tipo Xubuntu.
- `live-build-config/config/hooks/live/010-funlinux-branding.hook.chroot`: convierte el logo SVG a PNG, aplica wallpaper y tema Plymouth.
- `live-build-config/config/includes.chroot/usr/share/plymouth/themes/funlinux/`: tema de arranque.
- `live-build-config/config/includes.chroot/etc/skel/.config/.../xfce4-desktop.xml`: wallpaper por defecto.

## Nota

No adjunto un binario ISO dentro del repositorio porque suele pesar varios GB.
Con el script anterior puedes generarlo localmente con el nombre y branding solicitados.
