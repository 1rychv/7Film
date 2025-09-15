# 7Film – ASCII Wireframes and IA

This document sketches the core flows and information architecture before we implement GL-based filters and camera roll saving.

## Information Architecture

- Tabs: Camera, Library, Presets
- Stack screens: Develop (editor), Photo Details, Settings, Onboarding/Permissions, Share

## Camera (Updated Design with Sliders)
Route: `/(tabs)/camera`

### Main Camera Screen with Slider Controls

```
╔══════════════════════════════════════╗
║      📶 9:41 AM          🔋 100%     ║ ← Status Bar
╠══════════════════════════════════════╣
║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  ║ ← Black buffer
║■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  ║   (safe area)
╠──────────────────────────────────────╣
║  ╔══════════════════════════════╗   ║ ← Viewfinder
║  ║                              ║   ║   starts here
║  ║     📷 Camera Feed           ║   ║
║  ║         (4:3)                ║   ║
║  ║                              ║   ║
║  ║      ┌──────────┐           ║   ║
║  ║      │ Framing  │           ║   ║
║  ║      │  Guide   │           ║   ║
║  ║      └──────────┘           ║   ║
║  ║                              ║   ║
║  ╚══════════════════════════════╝   ║
║                                      ║
║  ← Swipe →  Zoom Slider:             ║
║ ╭────────────────────────────────╮  ║
║ │  ₀.₅ₓ    [[ 1x ]]    ₂ₓ    ₃ₓ │  ║
║ ╰────────────────────────────────╯  ║
║      ↑        ↑         ↑      ↑    ║
║    faded   ACTIVE    faded  faded   ║
║    (0.3)   (1.0)     (0.3)  (0.2)   ║
║                                      ║
║  ← Swipe →  Filter Slider:           ║
║ ╭────────────────────────────────╮  ║
║ │ ₙₒₙₑ  [[ Portra ]]  ₜᵣᵢ₋ₓ  ₖₒ │  ║
║ ╰────────────────────────────────╯  ║
║     ↑        ↑          ↑      ↑    ║
║   faded   ACTIVE     faded  hidden  ║
║   (0.4)    (1.0)     (0.3)   (0.1)  ║
║                                      ║
║                        ╭──────╮     ║
║                        │ ⚡ A  │     ║
║                        ╰──────╯     ║
║                                      ║
║    ╭───╮        ╭────╮       ╭───╮  ║
║    │ ▦ │        │ ◉  │       │ ✦ │  ║
║    ╰───╯        ╰────╯       ╰───╯  ║
║                                      ║
╚══════════════════════════════════════╝
```

### Alternative Simplified Layout

```
╔══════════════════════════════════════╗
║         Status Bar Area              ║
║            (System)                  ║
╠══════════════════════════════════════╣
║████████████████████████████████████  ║ ← Black space
║████████████████████████████████████  ║   between status
║████████████████████████████████████  ║   and viewfinder
╠──────────────────────────────────────╣
║  ┌──────────────────────────────┐   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  │░░░░░░ CAMERA VIEWFINDER ░░░░░│   ║
║  │░░░░░░░░░ (4:3 ratio) ░░░░░░░░│   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  │░░░░░┌──────────────┐░░░░░░░░░│   ║
║  │░░░░░│              │░░░░░░░░░│   ║
║  │░░░░░│   FRAMING    │░░░░░░░░░│   ║
║  │░░░░░│    GUIDE     │░░░░░░░░░│   ║
║  │░░░░░│   (orange)   │░░░░░░░░░│   ║
║  │░░░░░│              │░░░░░░░░░│   ║
║  │░░░░░└──────────────┘░░░░░░░░░│   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   ║
║  └──────────────────────────────┘   ║
║                                      ║
║     Zoom Slider (swipe to change):   ║
║   ·····••• ╔════╗ •••·····          ║
║            ║ 1x ║                    ║ ← Only active
║   ·····••• ╚════╝ •••·····          ║   value shown
║   0.5x              2x    3x         ║   (others fade)
║                                      ║
║    Filter Slider (swipe to change):  ║
║  ····• ╔═════════╗ •····             ║
║        ║ Portra  ║                   ║ ← Centered active
║  ····• ╚═════════╝ •····             ║   filter
║  None              Tri-X  Kodachrome ║   (faded labels)
║                                      ║
║                         ╭──────╮    ║
║                         │ ⚡ A  │    ║ ← Flash
║                         ╰──────╯    ║
║                                      ║
║    ╭───╮         ╭────╮      ╭───╮  ║
║    │ ▦ │         │ ◉  │      │ ✦ │  ║
║    ╰───╯         ╰────╯      ╰───╯  ║
║   Library       Shutter     Presets ║
║                                      ║
╚══════════════════════════════════════╝
```

## Interaction Design

### Zoom Slider (horizontal swipe)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    0.5x ← → 1x ← → 2x ← → 3x
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ↑ Selected appears in box
         Others fade with distance
```

### Filter Slider (horizontal swipe)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 None ← → Portra ← → Tri-X ← → Kodachrome
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ↑ Selected appears in box
       Others fade based on distance
```

### Opacity/Blur Formula
- **Selected**: 1.0 opacity, no blur
- **Adjacent**: 0.4 opacity, slight blur
- **2 away**: 0.2 opacity, more blur
- **3+ away**: 0.1 opacity, max blur

## Key Design Features

1. **Black buffer space** between status bar and viewfinder for cleaner separation
2. **Zoom slider**: Shows only active value clearly, others fade/blur based on distance
3. **Filter slider**: Same sliding behavior with fade effect
4. **Swipe gestures** to change values smoothly
5. **Visual hierarchy** with active selections prominent
6. **4:3 aspect ratio** camera viewfinder
7. **Orange framing guide** in center for composition
8. **Bottom action row** with library, shutter, and presets

## Legend
- `░` = Camera feed area
- `◉` = Shutter button (80x80px, white ring)
- `▦` = Stack icon (library)
- `✦` = Wand icon (presets)
- `[[]]` = Active selection highlight
- `ₛᵤᵦₛcᵣᵢₚₜ` = Faded/inactive text
- `■` = Black buffer/safe area

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
