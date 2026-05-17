# Punto de restauracion actual

Fecha de guardado importante: 2026-05-17 02:45:55 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante para arrancar manana

Tag previsto para esta version: important-bio-room-3d-2026-05-17
Mensaje del commit: feat: save bio room 3d checkpoint

Esta es la version importante de la Bio Room 3D para retomar el trabajo manana.
Si algo se ve viejo o incompleto al abrir el proyecto, primero verificar servidor, carpeta, navegador y HMR antes de tocar codigo o restaurar versiones.

## Que contiene esta version

- Bio Room 3D como seccion actual de `#bio`, con profundidad real dentro de la caja 3D.
- Sistema de guardado de preset 3D en desarrollo:
  - `data/bioRoomPreset.ts`
  - `lib/useBioRoomPresetStore.ts`
  - `app/api/bio-room/preset/route.ts`
  - boton `GUARDAR 3D`
- Controles Leva para Lucas, caja, luces, materiales, fondo, panel izquierdo y panel derecho/social.
- Imagen actual de Lucas como billboard principal:
  - `public/assets/bio-room/lucas-fullbody-cutout.png`
- Fondo del muro frontal agregado detras del texto:
  - `public/assets/bio-room/front-wall-background.png`
- Iconos sociales descargados localmente:
  - `public/assets/social-icons/social-youtube.png`
  - `public/assets/social-icons/social-instagram.png`
  - `public/assets/social-icons/social-facebook.png`
  - `public/assets/social-icons/social-tiktok.png`
- Pared frontal organizada con dos grupos:
  - izquierda: identidad Bajo Flow y texto principal;
  - derecha: redes sociales.
- Interaccion de iconos sociales:
  - hover con escala, elevacion en Z, inclinacion suave y cursor;
  - sin circulos, aros ni cuadrados decorativos alrededor.
- Se mantiene el registro del error HMR/servidor bloqueado en:
  - `ERROR_HMR_SERVIDOR_BLOQUEADO.md`

## Verificacion antes de guardar

- `npm.cmd run lint` paso correctamente.
- `npm.cmd run build` paso correctamente.
- `Invoke-WebRequest http://127.0.0.1:3000/#bio` devolvio `200`.
- `Invoke-WebRequest http://127.0.0.1:3000/assets/bio-room/front-wall-background.png` devolvio `200`.
- No aparecio bloqueo actual de `/_next/webpack-hmr` en `next-current-project.err.log`.

## Regla para abrir este proyecto manana

1. Confirmar carpeta:

```powershell
Get-Location
```

Debe ser:

```text
C:\Users\jaell\Desktop\pagina-bajo-flow-premium
```

2. Revisar estado:

```powershell
git status -sb
```

3. Abrir el proyecto actual desde disco con Next, no una version estatica:

```powershell
npm.cmd run dev -- -p 3000
```

4. Verificar:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:3000/#bio -UseBasicParsing
```

5. Abrir:

```text
http://127.0.0.1:3000/#bio
```

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-bio-room-3d-2026-05-17 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout important-bio-room-3d-2026-05-17
```

## Regla importante para Codex

Primero abrir y respetar el proyecto actual como esta en disco.
No buscar versiones viejas, no reconstruir desde memoria y no restaurar commits sin permiso.
Este archivo es una referencia de restauracion, no una autorizacion para cambiar el proyecto.
