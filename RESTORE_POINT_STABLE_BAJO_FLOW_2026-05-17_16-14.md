# Restore Point: Bajo Flow Stable Visual Build

Date: 2026-05-17 16:14:38 -03:00
Project: pagina-bajo-flow-premium
Branch: main
Remote: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git
Tag planned for this checkpoint: important-bajo-flow-stable-2026-05-17-1614

## Why this point matters

This is an important stable checkpoint after the Bio Room visual work, responsive
image optimization, responsive hero video optimization, and manual 3D controls.

The project is in a good working state and should be used as the return point if
future changes break the Bio Room or the optimized media flow.

## Main things included

- Optimized responsive image assets in `public/images/`.
- Optimized responsive hero video assets in `public/videos/`.
- New responsive media helpers:
  - `components/ui/ResponsivePicture.tsx`
  - `components/ui/ResponsiveVideo.tsx`
- Hero video now loads responsive WebM/MP4 versions.
- Bio Room uses optimized textures for:
  - left wall
  - right wall
  - ceiling
  - floor
  - front wall background
  - gallery images
  - social icons
- Lucas cutout PNG remains unchanged.
- Original PNG source images remain in `public/assets/bio-room/`.
- Manual Leva control group added as `pared-fondo` for the back/front wall image:
  - Mover X
  - Mover Y
  - Escala ancho
  - Escala alto
- The 3D preset save API understands the new `pared-fondo` values through
  `data/bioRoomPreset.ts`.

## Validation before saving

Run:

```bash
npm.cmd run build
```

Expected result: Next.js build completes successfully.

## How to return to this version

After the commit and tag are pushed, restore with:

```bash
git fetch --tags origin
git checkout important-bajo-flow-stable-2026-05-17-1614
```

To return main to this exact version later:

```bash
git checkout main
git reset --hard important-bajo-flow-stable-2026-05-17-1614
```

Only use `git reset --hard` if you intentionally want to discard later local
changes.
