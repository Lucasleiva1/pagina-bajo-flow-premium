# Punto de restauracion actual

Fecha de guardado importante: 2026-05-23 00:14:09 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Reproductor de campañas premium interactivo (Cartuchos y Drag & Drop)

Tag de esta version: important-premium-campaigns-2026-05-23-0014
Mensaje del commit: feat: save premium campaigns player checkpoint
Archivo detalle: RESTORE_POINT_PREMIUM_CAMPAIGNS_2026-05-23_00-14.md

Esta version implementa la nueva seccion de Campanhas/Campaigns (reemplazando a la estatica de Servicios) en formato de un reproductor de cartuchos interactivo 2D premium, con simulacion fisica de arrastre (drag and drop) de tarjetas y soporte para reproduccion de videos responsivos optimizados (MP4 y WebM en multiples resoluciones).

## Que contiene esta version actual

- Nuevo componente interactivo `components/PremiumCampaignPlayerSection.tsx` con soporte para Coverflow, arrastre (drag/drop), interacciones fluidas de puntero, soporte de navegacion por teclado (flechas, Enter/Espacio) y gestos.
- Soporte para multiples resoluciones y formatos de video (WebM y MP4 en 480, 768, 1280 y 1920px) cargados dinamicamente desde `/public/videos/`.
- Textos actualizados y unificados en `data/site.ts` en three idiomas (ES/EN/PT) adaptados a la estetica de "Campañas" y "Cartuchos".
- Nueva textura limpia de piso `public/assets/bio-room/bio-floor-grid-clean-source.png` e imagenes optimizadas.
- Integracion del reproductor en `components/ExperiencePage.tsx`.
- Estilos extendidos en `app/globals.css` para el reproductor interactivo premium.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-premium-campaigns-2026-05-23-0014 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git fetch --tags origin
git checkout important-premium-campaigns-2026-05-23-0014
```

---

Fecha de guardado importante: 2026-05-22 21:31:51 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version anterior: Bio Room piso y botones

Tag de esta version: important-bio-floor-buttons-2026-05-22-2131
Mensaje del commit: feat: save bio floor buttons checkpoint
Archivo detalle: RESTORE_POINT_BIO_FLOOR_BUTTONS_2026-05-22_21-31.md

Esta version queda como punto fuerte despues de ajustar el piso nuevo de la Bio Room, conservar la textura anterior, agregar botones de piso con perspectiva y controles completos, remover el circulo molesto debajo de Lucas, dejar la barra interna con solo `Inicio` y mejorar ese boton con color dorado, brillo y titileo suave.

## Que contiene esta version actual

- Piso actual grid/tech en formatos fuente, WebP y AVIF.
- Textura anterior mandala conservada en fuente, WebP y AVIF.
- Botones de piso `BIO`, `HABILIDADES` y `CONTACTO` con controles Leva completos por boton.
- Controles Leva completos para posicionar, escalar, rotar y ajustar opacidad del piso.
- Barra de seccion reducida a un unico boton `Inicio`.
- Boton `Inicio` con brillo dorado y titileo suave.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-bio-floor-buttons-2026-05-22-2131 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git fetch --tags origin
git checkout important-bio-floor-buttons-2026-05-22-2131
```

---

# Punto de restauracion actual

Fecha de guardado importante: 2026-05-22 16:18:05 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Extensión de límites 3D, solución a parpadeos del parallax y quote combo unificado

Hash de esta version: 75c6ff2
Mensaje del commit: feat(bio-room): unificar quote combo, remover carpeta Textos y extender limites de habitacion en Z para corregir parpadeo de fondo

Esta versión soluciona el parpadeo y la filtración del fondo azul-grisáceo (niebla exterior) en la vista frontal al mover el cursor con el efecto parallax, extendiendo las geometrías de las paredes laterales, piso y techo en Z de 8.1 a 12.1. También se unifican las comillas y la frase en el componente `WallTextQuoteCombo` mediante Canvas 2D para eliminar el Z-fighting entre ellas y se limpia la carpeta de controles obsoletos 'Textos' de Leva en el Bio Wall.

## Que contiene esta version actual

- Extensión de la profundidad física de la habitación de `8.1` a `12.1` (`D + 4.0`) y desplazamiento de su posición en `+2.0` en Z para envolver completamente la cámara en `Z = 6.2`.
- Proyección de texturas de piso, techo y muros mediante `depth={D + 4.0}` y `z={centerZ + 2.0}` en `FloorDecorSurface`, `CeilingDecorSurface` y `WallDecorSurface`.
- Componente `WallTextQuoteCombo` para renderizar comillas y frase en una sola textura HTML5 Canvas 2D y evitar Z-fighting visual.
- Remoción de la carpeta de controles Leva inactiva `"Textos"` en `MURO IZQUIERDO (Bio)`.
- Compilación de TypeScript verificada exitosamente con `npx tsc --noEmit`.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff 75c6ff2 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout 75c6ff2
```

---

Fecha de guardado importante: 2026-05-22 15:15:44 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version anterior: Separación de controles y kicker "Bio" en amarillo

Hash de esta version: 31b896d
Mensaje del commit: feat(bio-room): agregar controles independientes para comillas/frase y cambiar kicker Bio a amarillo

Esta versión separa los controles Leva de las comillas y la frase del panel de biografía en el muro frontal para un posicionamiento de diseño más granular y para evitar Z-fighting escalonando la profundidad z. También cambia la palabra "Bio" (kicker) a amarillo (#ffd56a) para alinearse con los acentos del sitio.

## Que contiene esta version actual

- Controles independientes para comillas (`leftQuoteX`, `leftQuoteY`, `leftQuoteSize`) y frase (`leftPhraseX`, `leftPhraseY`, `leftPhraseSize`) sincronizados con Leva y con el serializador de presets.
- Alturas de capa `z={0.11}` para comillas y `z={0.112}` para la frase, mitigando Z-fighting/flickering.
- Kicker text `"Bio"` con color amarillo `#ffd56a` en lugar del azul `#1f8cff`.
- Compilacion de TypeScript vericada exitosamente con `npx tsc --noEmit`.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff 31b896d -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout 31b896d
```

---

Fecha de guardado importante: 2026-05-22 15:00:26 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version anterior: Solución de oclusión y desaparición de iconos sociales

Hash de esta version: 1212058
Mensaje del commit: fix: resolver desaparicion de iconos sociales al navegar usando un plano de oclusion angosto e invisible y corregir tipos de typescript

Esta version soluciona la desaparicion de los iconos de redes sociales al volver de las vistas de habilidades o biografia. Se crea un mesh de oclusion invisible de ancho 0.8 en LucasBillboard para que el raycast no colisione con el plano visual de 1.94 (que contiene transparencias a los lados) en la vista home. Se actualiza el tipado de THREE.Mesh a Mesh de three y se hace un cast a any de lucasMeshRef para compatibilidad con React 19.

## Que contiene esta version actual

- Plano de oclusion angosto de 0.8 de ancho en `<LucasBillboard>` para raycasting preciso.
- Tipado `Mesh` de `three` reemplazando `THREE.Mesh` en `BioRoomCanvas.tsx` y `BioRoomWorldPanels.tsx`.
- Cast a `any` en `occlude={[lucasMeshRef as any]}` para compatibilidad de tipos en React 19.
- Compilacion de TypeScript vericada exitosamente con `npx tsc --noEmit`.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff 1212058 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout 1212058
```

---

Fecha de guardado importante: 2026-05-21 15:28:27 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Muro principal editorial con redes y firma

Tag de esta version: important-front-wall-signature-2026-05-21-1528
Mensaje del commit: feat: save front wall signature checkpoint

Esta version queda como punto fuerte despues de redisenar el muro principal. Conserva el espacio 3D actual y cambia solamente la capa editorial del muro frontal: texto, redes sociales, iconos creados desde cero y firma de Bajo Flow en el sector inferior izquierdo.

## Que contiene esta version actual

- Muro principal con composicion editorial inspirada en la referencia: `Bio`, `BAJO FLOW`, bajada, textos, cita y redes.
- Iconos de redes creados desde cero con canvas/textura 3D, sin usar las imagenes sociales anteriores.
- Tarjetas de redes con hover: cambian color, brillo y escala suavemente.
- Separacion de controles Leva en `FRONT WALL LEFT` y `FRONT WALL SOCIALS`.
- Eliminacion del bloque inferior `ENFOQUE` del muro principal.
- Firma Bajo Flow transparente colocada en el sector inferior izquierdo del muro.
- Controles Leva para la firma: posicion X/Y, ancho, alto y opacidad.
- Serializador del preset 3D actualizado para guardar los nuevos controles de firma con `GUARDAR 3D`.

## Verificacion de esta version actual

- `npx.cmd tsc --noEmit` paso correctamente antes de guardar.
- `npx.cmd eslint components/bio-room/BioRoomWorldPanels.tsx data/bioRoomPreset.ts app/api/bio-room/preset/route.ts` paso correctamente.
- `Invoke-WebRequest http://127.0.0.1:3000/#bio` devolvio `200`.
- Captura Playwright verifico que el muro Bio abre y la firma reemplaza al bloque `ENFOQUE`.
- El guardado evita incluir archivos sueltos no rastreados que no forman parte del checkpoint.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-front-wall-signature-2026-05-21-1528 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout important-front-wall-signature-2026-05-21-1528
```

---

Fecha de guardado importante: 2026-05-21 13:45:46 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Bio Room con muro Bio limpio y controles de profundidad

Tag de esta version: important-bio-room-bio-wall-cleanup-2026-05-21-1345
Mensaje del commit: feat: save bio room bio wall cleanup checkpoint

Esta version queda como punto fuerte antes de redisenar el muro principal. Conserva el proyecto actual funcionando y deja el muro Bio mas limpio, con controles manuales de profundidad para textos desde Leva.

## Que contiene esta version actual

- Muro Bio con controles Leva de profundidad para los textos principales.
- Eliminacion del panel de fondo del muro Bio y sus lineas decorativas asociadas.
- Eliminacion del bloque `Lo que aporto` y las tarjetas inferiores del muro Bio.
- Texto `Intro` del muro Bio en amarillo para destacarlo.
- Serializador del preset 3D actualizado para conservar los nuevos controles al usar `GUARDAR 3D`.
- Se mantienen intactos el resto del cuarto 3D, el muro Habilidades y la estructura general de la pagina.

## Verificacion de esta version actual

- `npx.cmd tsc --noEmit` paso correctamente antes de guardar.
- `Invoke-WebRequest http://127.0.0.1:3000/#bio` devolvio `200`.
- El guardado evita incluir archivos sueltos no rastreados que no forman parte del checkpoint.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-bio-room-bio-wall-cleanup-2026-05-21-1345 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout important-bio-room-bio-wall-cleanup-2026-05-21-1345
```

---

Fecha de guardado importante: 2026-05-19 17:41:16 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Servicios audiovisuales premium 2D

Tag de esta version: important-services-premium-2026-05-19-1741
Mensaje del commit: feat: save premium services section checkpoint

Esta version queda como punto fuerte para volver si algo se rompe despues. Conserva la pagina actual con Bio/Habilidades como venia, suma la nueva seccion premium 2D de Servicios Audiovisuales despues de Bio y antes de Contacto, y mantiene el proyecto abriendose desde el Next app correcto en `http://127.0.0.1:3000/`.

## Que contiene esta version actual

- Nueva seccion `#services` con estetica premium oscura, cinematografica y tecnologica.
- Componente `ServicesScene` 2D en React, sin Three.js, sin WebGL, sin canvas ni shaders.
- Pantalla superior grande que cambia segun la tarjeta activa.
- Cinco tarjetas verticales inferiores como botones accesibles:
  - `YouTube & Video Largo`
  - `Reels & Shorts`
  - `Postproduccion`
  - `Ads & Contenido Comercial`
  - `Motion & Visual Design`
- Assets guardados localmente en:
  - `public/images/services/cards/service-01.png` a `service-05.png`
  - `public/images/services/screens/service-01.png` a `service-05.png`
- Navegacion superior con `Servicios` / `Services` / `Servicos` hacia `#services`.
- Copy de servicios agregado al sistema multilenguaje ES/EN/PT en `data/site.ts`.
- Ajuste del header mobile para que el menu y el selector de idioma queden clickeables con la nueva entrada.
- Viewport mobile declarado en `app/layout.tsx` para que el ancho real del dispositivo se respete.

## Verificacion de esta version actual

- `npm.cmd run build` paso correctamente antes de guardar.
- `Invoke-WebRequest http://127.0.0.1:3000/` devolvio `200`.
- Prueba en navegador verifico que las cinco tarjetas de Servicios cambian el servicio activo.
- Prueba mobile verifico que `Servicios` navega a la nueva seccion, el carrusel horizontal puede desplazarse y no hay 404 en imagenes de servicios.
- Prueba de idiomas verifico que la seccion cambia texto en ES, EN y PT.
- Busqueda en `components/ServicesScene.tsx` confirmo que no importa `three`, `@react-three/fiber`, `drei`, `Canvas` ni WebGL.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version:

```powershell
git diff important-services-premium-2026-05-19-1741 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git checkout important-services-premium-2026-05-19-1741
```

---

Fecha de guardado importante: 2026-05-18 20:07:09 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Bio Room con imagenes y controles de muros

Tag de esta version: important-bio-room-images-controls-2026-05-18-2007
Mensaje del commit: feat: save bio room images and wall controls checkpoint

Esta version queda como punto fuerte para arrancar desde aca. Conserva la Bio Room 3D con los muros Bio y Habilidades ajustables desde Leva, imagenes PNG del usuario montadas en los muros y escala uniforme ampliada para poder agrandarlas mejor.

## Que contiene esta version actual

- Muro Bio con imagen PNG sentado en camisa roja, ubicada abajo a la izquierda y servida desde `public/assets/bio-room/lucas-sentado.png`.
- Muro Habilidades con imagen PNG sentado en camisa blanca, ubicada abajo a la derecha y servida desde `public/assets/bio-room/lucas-sentado-blanco.png`.
- Control `Escala uniforme` en `MURO IZQUIERDO (Bio) > Imagen sentado`.
- Control `Escala uniforme` en `MURO DERECHO (Habilidades) > Imagen sentado`.
- Rango de escala ampliado hasta `3.6` para poder agrandar mucho mas ambas imagenes.
- Controles de posicion, opacidad y layout de los muros guardables con `GUARDAR 3D`.
- Muro Habilidades mantiene videos/posters y navegacion lateral.
- Muro Bio conserva ajustes recientes de textos, aportes, fondo y remocion del borde general.

## Verificacion de esta version actual

- `npm.cmd run lint` paso correctamente antes de guardar.
- `npm.cmd run build` paso correctamente antes de guardar.
- Verificacion en navegador sobre `http://127.0.0.1:3000/` confirmo que la imagen nueva de Habilidades carga como PNG (`200`) y se ve en el muro.

---

Fecha de guardado importante: 2026-05-18 17:16:27 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: Ajustes de layout Muro de Habilidades

Tag de esta version: important-skills-wall-layout-2026-05-18-1716
Mensaje del commit: fix: bio room skills wall layout spacing and artifacts

Esta version corrige el layout horizontal del muro de Habilidades, eliminando artefactos visuales (shimmering/z-fighting) y solucionando el espaciado vertical que causaba cortes y solapamiento en el borde inferior.

## Que contiene esta version actual

- Eliminacion de lineas separadoras verticales e inferiores cruzadas (\`WallGlowLine\`) que cortaban visualmente la interfaz y causaban aberraciones.
- Incremento en el espaciado Z (\`polygonOffset\` y posiciones \`z\`) de cada capa de texto de las tarjetas para prevenir parpadeos y z-fighting.
- Eliminacion de la capa superpuesta oscura en los thumbnails que afectaba la lectura.
- Reduccion del \`maxWidth\` del titulo general (HABILIDADES) a un valor razonable (2.8).
- Correccion del posicionamiento vertical de las tarjetas (\`cardsY\` subido) para asegurar que el boton de CTA (\`Ver >\`) no sobresalga del marco visible.

---

Fecha de guardado importante: 2026-05-18 14:36:54 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Version importante actual: muro Habilidades con videos

Tag de esta version: important-skills-wall-videos-2026-05-18-1436
Mensaje del commit: feat: save skills video wall checkpoint

Esta version deja guardada la seccion Habilidades dentro de la Bio Room 3D como un mural/pantalla fisica premium, con los tres videos del usuario conectados visualmente como nodos.

## Que contiene esta version actual

- El boton `Galeria` fue reemplazado por `Habilidades`.
- El muro lateral de Habilidades ahora muestra tres nodos de video conectados:
  - `Correccion y Tratamiento de Color` con `https://www.youtube.com/watch?v=POrDJhEuTSM`
  - `Edicion y Diseno de Sonido` con `https://www.youtube.com/watch?v=JlxFvORQOa0`
  - `Motion Graphics en Fusion` con `https://www.youtube.com/watch?v=fhYi33V2uf8`
- Los posters de los videos quedaron guardados localmente en `public/images/skills/`.
- Al tocar un nodo se abre el overlay de Habilidades, primero con poster local y boton `Reproducir video`.
- El iframe de YouTube se carga solo despues de tocar `Reproducir video`.
- La version mobile de Habilidades tambien muestra los posters de video.
- Los controles Leva quedan ocultos por defecto para no tapar el mural; se pueden activar con `?debug3d=1`.
- El servidor correcto para abrir esta version sigue siendo `http://127.0.0.1:3000/#bio`.

## Verificacion de esta version actual

- `npm.cmd run lint` paso correctamente antes de guardar.
- `npm.cmd run build` paso correctamente antes de guardar.
- La prueba con navegador verifico:
  - boton `Habilidades`;
  - tres nodos de video en el muro;
  - posters locales `/images/skills/color.jpg`, `/images/skills/sound.jpg`, `/images/skills/fusion.jpg`;
  - overlay al tocar un video;
  - iframe de YouTube cargando el video correspondiente despues de tocar `Reproducir video`.

---

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
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Si Codex necesita dejar el servidor vivo y el proceso normal se corta al terminar la ejecucion, usar un proceso detached desde Node:

```javascript
const { spawn } = await import("node:child_process");
const fs = await import("node:fs");
const cwd = "C:\\Users\\jaell\\Desktop\\pagina-bajo-flow-premium";
const out = fs.openSync(`${cwd}\\.next-dev.out.log`, "a");
const err = fs.openSync(`${cwd}\\.next-dev.err.log`, "a");
const p = spawn(
  "cmd.exe",
  ["/c", "C:\\Program Files\\nodejs\\npm.cmd", "run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3000"],
  { cwd, detached: true, stdio: ["ignore", out, err] }
);
p.unref();
```

4. Verificar que devuelva `200`:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:3000/#bio -UseBasicParsing
```

5. Abrir o copiar este numero de puerto:

```text
http://127.0.0.1:3000/#bio
puerto: 3000
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
