# Punto de restauracion importante: Reproductor de campañas premium interactivo (Cartuchos y Drag & Drop)

Fecha de guardado importante: 2026-05-23 00:14:09 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Remoto: origin/main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

Tag previsto para esta version: important-premium-campaigns-2026-05-23-0014
Mensaje previsto del commit: feat: save premium campaigns player checkpoint

## Por que esta version importa

Esta version reemplaza la seccion estatica de Servicios por una de Campañas Audiovisuales interactiva de alta fidelidad 2D. Utiliza una metafora de reproductor de cartuchos retro-futurista donde el usuario puede arrastrar y soltar (o tocar) cartuchos en un reproductor de video para visualizarlos. Se han incorporado videos responsivos optimizados (MP4 y WebM) para multiples resoluciones (480, 768, 1280 y 1920px), mejorando sustancialmente la experiencia visual y la interaccion de la pagina Bajo Flow Premium.

## Que contiene esta version

- **Componente Premium**:
  - `components/PremiumCampaignPlayerSection.tsx`: implementa la logica del coverflow interactivo 2D, soporte de drag-and-drop con pointer capture, soporte para control de teclado, control remoto de play/skip y barra de progreso.
- **Videos y Assets**:
  - Archivos de video MP4 y WebM responsivos optimizados en `/public/videos/` para cada una de las 5 campañas:
    - YouTube & Video Largo (`campaign-youtube-video-largo`)
    - Reels & Shorts (`campaign-reels-shorts`)
    - Postproduccion (`campaign-postproduccion`)
    - Ads & Contenido Comercial (`campaign-ads-contenido-comercial`)
    - Motion & Visual Design (`campaign-motion-visual-design`)
  - Posters de video en formato JPG.
  - Textura limpia del piso en `/public/assets/bio-room/bio-floor-grid-clean-source.png` e imagenes redimensionadas en `/public/images/bio-room/`.
- **Textos y Multilenguaje**:
  - `data/site.ts`: adaptacion de la nomenclatura en Español, Ingles y Portugues para el modulo de Campañas/Campaigns/Campanhas y las propiedades del reproductor.
- **Estilos**:
  - `app/globals.css`: definicion de clases personalizadas para la escena de campañas, coverflow, cartuchos con efectos de brillo/shine, zona de drop interactiva y transporte.
- **Rutas e Integracion**:
  - `components/ExperiencePage.tsx`: reemplaza `ServicesScene` por `PremiumCampaignPlayerSection`.

## Verificacion antes de guardar

- `npx.cmd tsc --noEmit` paso correctamente (sin errores).
- `npx eslint app components lib data` paso correctamente (exceptuando advertencias previas de tipo explicit any ya existentes).
- Verificacion de construccion de produccion exitosa.

## Como comparar o volver

Antes de restaurar, verificar siempre:

```powershell
git status -sb
git log --oneline --decorate -5
```

Para comparar contra esta version, despues de pushear el tag:

```powershell
git diff important-premium-campaigns-2026-05-23-0014 -- .
```

Para volver exactamente a esta version, solo si el usuario lo pide:

```powershell
git fetch --tags origin
git checkout important-premium-campaigns-2026-05-23-0014
```

## Regla importante

Este archivo es una referencia de restauracion. No autoriza a restaurar, borrar, resetear ni cambiar el proyecto sin pedir permiso.
