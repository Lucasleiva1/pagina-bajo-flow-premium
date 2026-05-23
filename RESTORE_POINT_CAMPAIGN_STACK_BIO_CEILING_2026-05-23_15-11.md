# Punto de restauracion importante

Fecha de guardado importante: 2026-05-23 15:11:12 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Campanas con biblioteca suave y Bio Room lista para produccion

Tag de esta version: important-campaign-stack-bio-ceiling-2026-05-23-1511
Mensaje del commit: feat: save campaign stack and bio ceiling checkpoint

Esta version queda como punto fuerte despues de terminar la parte Bio y redisenar Campanas como una consola audiovisual premium. La Bio Room conserva los controles de techo tomando como referencia los controles del piso, pero los controles Leva y botones de guardado/desarrollo quedan ocultos para uso publico. La seccion Campanas queda como pantalla completa responsive, con video/poster activo de fondo y una biblioteca de tarjetas altas al frente que se cambia con drag suave sin mover la pagina.

## Que contiene esta version actual

- Bio Room con controles serializables de techo (`ceilingTexture`) equivalentes al esquema de piso para poder acomodar el techo cuando se reactive Leva.
- Leva, boton `GUARDAR 3D` y controles de desarrollo de Bio ocultos visualmente, manteniendo la posibilidad de volver a habilitarlos en codigo.
- Seccion `#services` convertida en consola cinematografica premium de Campanas.
- Video/poster activo ocupando el fondo de la consola, usando los assets existentes de `/public/videos/campaign-*`.
- Tarjetas verticales altas usando `public/images/services/cards/service-0*.png`.
- Biblioteca/stack profundo de tarjetas con drag horizontal/diagonal suave.
- El gesto sobre la biblioteca no desplaza la pagina; solo cambia la tarjeta activa cuando supera el umbral de arrastre.
- Click/tap simple selecciona tarjeta sin reproducir video.
- Boton Play reproduce el video activo con `muted`, `loop` y `playsInline`.
- Navegacion por teclado conservada: flechas para cambiar tarjeta, Enter/Espacio para reproducir.
- Layout responsive verificado en desktop, laptop baja y mobile.

## Verificacion de esta version actual

- `npx.cmd tsc --noEmit` paso correctamente.
- `npx.cmd eslint components\PremiumCampaignPlayerSection.tsx` paso correctamente.
- `Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/ -TimeoutSec 10` devolvio `200`.
- Prueba Playwright en `1365x900`, `1365x720` y `390x844` verifico que el drag cambia de tarjeta y mantiene estable `scrollY`.
- Capturas de verificacion generadas en:
  - `C:\tmp\campaign-stack-desktop.png`
  - `C:\tmp\campaign-stack-laptop.png`
  - `C:\tmp\campaign-stack-mobile.png`
- El guardado evita incluir scripts sueltos `c_*.js` no rastreados que no forman parte del checkpoint.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-campaign-stack-bio-ceiling-2026-05-23-1511 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git fetch --tags origin
git checkout important-campaign-stack-bio-ceiling-2026-05-23-1511
```

