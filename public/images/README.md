# Image Asset Map

Replace images by keeping the same file names and paths.

Recommended formats:
- Wedding photos: WebP, `quality 75-85`.
- QR codes: PNG, high contrast, no blur.
- Favicon: SVG or PNG.

Keep the total `public/images` folder around `5-8MB` if possible.

## Hero
- `hero/slide-01.webp`
- `hero/slide-02.webp`
- `hero/slide-03.webp`
- `hero/slide-04.webp`
- `hero/slide-05.webp`

Size: `1920x1080`, ratio `16:9`, landscape.
Target weight: `200-450KB` per image.
Use: first screen background, keep faces/important details near center.

## Couple
- `couple/groom-portrait.webp`
- `couple/bride-portrait.webp`

Size: `1200x1500`, ratio `4:5`, vertical portrait.
Target weight: `100-250KB` per image.
Use: clear face, centered crop, similar lighting for both photos.

## Story
- `story/moment-01.webp`
- `story/moment-02.webp`
- `story/moment-03.webp`

Size: `1200x900`, ratio `4:3`, landscape.
Target weight: `150-300KB` per image.
Use: timeline memories, avoid crops that cut faces near the edge.

## Album
- `album/photo-01.webp`
- `album/photo-02.webp`
- `album/photo-03.webp`
- `album/photo-04.webp`
- `album/photo-05.webp`
- `album/photo-06.webp`
- `album/photo-07.webp`
- `album/photo-08.webp`

Size: `1200x1500` ratio `4:5`, or `1200x1200` ratio `1:1`.
Minimum: `1000px` on the long edge.
Target weight: `120-300KB` per image.
Use: mixed portraits/details are fine; keep the main subject centered.

## Fallback
- `fallback/photo-fallback.webp`
- `fallback/couple-fallback.webp`

Size: `1200x900` or `1200x1200`.
Target weight: `100-250KB` per image.
Use: neutral backup image shown when an asset fails to load.

## QR
- `qr/groom-bank.png`
- `qr/bride-bank.png`

Size: `800x800`, ratio `1:1`, PNG.
Target weight: `<200KB` per image.
Use: high contrast, white/light background, no compression artifacts.

## System
- `system/favicon.svg`

Size: SVG preferred, or PNG `64x64`.
