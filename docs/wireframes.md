# 7Film – ASCII Wireframes and IA

This document sketches the core flows and information architecture before we implement GL-based filters and camera roll saving.

## Information Architecture

- Tabs: Camera, Library, Presets
- Stack screens: Develop (editor), Photo Details, Settings, Onboarding/Permissions, Share

## Camera (existing)
Route: `/(tabs)/camera`

```
+--------------------------------------------------+
| [⚡ Off]                          [↺ Flip]       |
|                                                  |
|        LIVE PREVIEW (CameraView + GL overlay)    |
|                                                  |
|                                                  |
| [None] [Portra] [Tri‑X] [Kodachrome]    (chips)  |
|                                                  |
|                   (●) Shutter                    |
+--------------------------------------------------+
```

## Library (grid of saved/processed shots)
Route: `/(tabs)/library`

```
+--------------------------------------------------+
| Library                         [Select] [⋯]     |
+--------------------------------------------------+
| [■■] [■■] [■■] [■■]                               |
| [■■] [■■] [■■] [■■]   (3–4 cols responsive)      |
| …                                                |
+--------------------------------------------------+
| Tabs:  [Camera] [Library] [Presets]              |
+--------------------------------------------------+
```

- Item badges: film look name, edited indicator, sync icon
- Tap item → Photo Details; Long‑press → multi‑select

## Photo Details (single shot + metadata)
Route: `/photo/[id]`

```
+--------------------------------------------------+
| < Back                           [Edit] [Share]  |
+--------------------------------------------------+
|                [Image Preview]                   |
|                                                  |
+--------------------------------------------------+
| Shot Info                                        |
| - Film Look: Portra 400                          |
| - Date: 2025‑09‑15 14:32                         |
| - Lens/Camera: Back Wide                         |
| - ISO 200 | 1/120s | f/1.8 | WB 5200K           |
| - Size: 3024×4032                                |
+--------------------------------------------------+
| Actions:  [Favorite ★] [Duplicate] [Delete]      |
+--------------------------------------------------+
```

## Develop (editor with GL-based filters)
Route: `/develop/[id]`

```
+--------------------------------------------------+
| < Cancel                     [Compare]   [Save]  |
+--------------------------------------------------+
|              [GL Preview (fit)]                  |
|        (Before/After on Compare toggle)          |
+--------------------------------------------------+
| Looks: [None] [Portra] [Tri‑X] [Koda] [HP5] …    |
+--------------------------------------------------+
| Intensity:  ─────●────                           |
| Grain:      ───●─────                            |
| Vignette:   ─●──────                             |
| Halation:   ──●─────                             |
| WB:         [Auto] [K]  5200K  (slider)          |
| Curves:     [Open Panel ▸]                       |
+--------------------------------------------------+
| Tools: [Crop] [Rotate] [Aspect] [Reset]          |
+--------------------------------------------------+
```

## Presets (built‑in + user looks)
Route: `/(tabs)/presets`

```
+--------------------------------------------------+
| Presets                          [⋯]             |
+--------------------------------------------------+
| Featured                                          |
|  • Portra 400      [Apply] [★] [i]               |
|  • Tri‑X 400       [Apply] [★] [i]               |
|  • Kodachrome 64   [Apply] [↓] [i]               |
+--------------------------------------------------+
| My Presets                                        |
|  • Warm Grain      [Apply] [⋯]                    |
|  • High Contrast   [Apply] [⋯]                    |
+--------------------------------------------------+
| Tabs:  [Camera] [Library] [Presets]              |
+--------------------------------------------------+
```

## Settings
Route: `/settings`

```
+--------------------------------------------------+
| Settings                         [Done]          |
+--------------------------------------------------+
| Capture                                             
|  - Format: [JPEG ▾] (HEIC/JPEG/RAW*)               |
|  - Max Resolution: [High ▾]                         |
|  - Grid: [Off ▾] (Rule of Thirds/Square/Golden)     |
| Develop                                             
|  - Default Look: [None ▾]                           |
|  - Grain Strength:  ──●────                         |
|  - Halation Strength:  ──●────                      |
|  - Save Originals: [On]                             |
| Library                                             
|  - Auto-save to Camera Roll: [On]                   |
|  - Export Size: [Full ▾]                            |
| About                                               
|  - Version, Licenses, Feedback                      |
+--------------------------------------------------+
```

## Onboarding / Permissions
Route: `/onboarding`

```
+--------------------------------------------------+
|               7Film                               |
|  Film emulation camera with authentic looks.      |
|                                                  |
|  [Grant Camera Access]                            |
|  [Skip for now]                                   |
+--------------------------------------------------+
```

## Share Sheet (in‑app pane)
Route: `/share/[id]` (modal)

```
+--------------------------------------------------+
| Share                                 [Close]    |
+--------------------------------------------------+
| Export Options                                    |
|  - Size: [Full ▾]                                 |
|  - Format: [JPEG ▾]                               |
|  - Watermark: [Off]                               |
+--------------------------------------------------+
| Destinations: [Photos] [Files] [Instagram] [⋯]   |
+--------------------------------------------------+
```

## Navigation Summary

- Tabs: `/(tabs)/camera`, `/(tabs)/library`, `/(tabs)/presets`
- Stacks: `/develop/[id]`, `/photo/[id]`, `/settings`, `/onboarding`, `/share/[id]`
- Default route: redirect `/` → `/(tabs)/camera`
