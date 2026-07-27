# Knell - yet another emom timer

> *knell* (n.) — the sound of a bell rung slowly, marking an end.
> Here, it marks the end of every round. A solemn, inevitable toll — then you go again.

**Knell** is a minimal, distraction-free EMOM timer built for kettlebell training.
No app store. No account. No ads. One HTML file that works anywhere.

---

## What is EMOM?

**Every Minute on the Minute** is a training format where you perform a set number of reps at the start of each minute, then rest for whatever time remains before the next minute begins. The shorter your work time, the more rest you earn — and as fatigue sets in, that margin shrinks.

It's a staple of kettlebell programming: swings, snatches, clean & press, goblet squats. Knell keeps the clock so you can keep your head in the workout.

---

## Features

| | Feature | Detail |
|---|---|---|
| ⏱ | **Configurable rounds** | 1 – 99 rounds |
| ⏳ | **Configurable duration** | 10 – 300 seconds per round |
| 💀 | **Death by** | No round limit — keep going until failure |
| 🔔 | **End-of-round signal** | Beep + voice announces the next round number |
| 🔔 | **Halfway signal** | Tone + voice says "Halfway" at the midpoint of each round |
| 🔢 | **End countdown** | Beep each second through the last 5s of every round (toggle) |
| 🔢 | **Halfway countdown** | Beep each second through the last 5s of the first half (toggle) |
| ▶ | **Start timer** | Optional pre-workout countdown (5 – 60 s, steps of 5) before the EMOM begins |
| 🗣 | **Voice announcements** | Speaks "Round 1", "Round 2"…, "Halfway", "Go!", and "Workout complete!" |
| ⭕ | **Round progress ring** | Inner SVG ring segmented by round count — shows completed, current, and remaining rounds at a glance |
| 🌓 | **Auto dark / light theme** | Follows your device's system preference automatically |
| 💡 | **Screen always on** | Keeps the screen awake while the timer is running (Wake Lock API) |
| ⚙️ | **Collapsible settings** | Advanced options panel collapses to keep the interface clean; preference is remembered |
| 📋 | **Round log** | Compact in-session history of each completed round |
| 📵 | **Offline** | Works with no internet connection after the first load (PWA + service worker) |

---

## How to install on your smartphone

Knell is a **Progressive Web App (PWA)**. No app store required — install it directly from the browser in two taps.

### Android (Chrome)

1. Open Chrome and navigate to your Knell URL
   *(e.g. `https://yourusername.github.io/knell/`)*
2. Tap the **⋮ menu** (three dots, top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Confirm — the Knell icon appears on your launcher
5. Open it: runs full-screen, no browser bar, like a native app

> Chrome may show an **"Add Knell to Home screen"** banner automatically after a few seconds — tap it if it appears.

### iPhone / iPad (Safari)

1. Open **Safari** — Chrome on iOS cannot install PWAs, so Safari is required
2. Navigate to your Knell URL
3. Tap the **Share button** (box with arrow, bottom toolbar)
4. Scroll down and tap **"Add to Home Screen"**
5. Confirm the name and tap **Add**

> Audio and speech activate on the first tap of the Start button, as required by browser policy on iOS.

### Desktop (Chrome / Edge)

1. Navigate to your Knell URL
2. Click the **install icon** (⊕) in the address bar
3. Confirm — Knell opens as a standalone window

---

## Self-hosting on GitHub Pages (free)

1. Create a free account at [github.com](https://github.com)
2. Click **New repository** → name it `knell` → set it to **Public**
3. Check **"Add a README"** → **Create repository**
4. Click **Add file → Upload files** and upload all six:

   ```
   index.html
   manifest.json
   sw.js
   icon-192.png
   icon-512.png
   README.md
   ```

5. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
6. Save. After about 60 seconds your app is live at:
   `https://yourusername.github.io/knell/`

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The full PWA — all logic, audio, styles, and wake lock in one file |
| `manifest.json` | PWA metadata: name, icons, display mode, theme color |
| `sw.js` | Service worker — network-first for HTML, cache-first for assets |
| `icon-192.png` | App icon for Android launcher and home screen |
| `icon-512.png` | App icon for splash screens |
| `README.md` | This file — displayed automatically on the GitHub repo home page |
| `knell.html` | Standalone version — open directly in any browser, no server needed |

---

## Standalone use (no server)

If you just want to use Knell on a single device without hosting it:

1. Download `knell.html`
2. Open it in any modern browser (Chrome, Firefox, Safari, Edge)
3. Done — everything runs locally, no internet required

The standalone file does not include PWA install or offline caching, but is otherwise fully identical to the hosted version.

---

## Deploying a new version

Two values must be updated in sync on every release:

| File | Variable | Example |
|---|---|---|
| `index.html` / `knell.html` | `const APP_VERSION = '1.1'` | → `'1.2'` |
| `sw.js` | `const CACHE_VERSION = 'knell-v1.1'` | → `'knell-v1.2'` |

`APP_VERSION` automatically populates the version string in the app footer. `CACHE_VERSION` tells the service worker to discard the old cache and fetch fresh files — without this change, users may continue seeing the previous version until they manually clear their browser cache.

The service worker uses a **network-first** strategy for `index.html` (always fetches the latest if online) and **cache-first** for everything else (fonts, icons), so bumping the version is the only required step for a clean deploy.

---

## Browser compatibility

| Feature | Chrome Android | Safari iOS | Firefox | Edge |
|---|---|---|---|---|
| Core timer | ✅ | ✅ | ✅ | ✅ |
| Web Audio (beeps) | ✅ | ✅ | ✅ | ✅ |
| Voice (Speech API) | ✅ | ✅ 16+ | ✅ | ✅ |
| Wake Lock (screen on) | ✅ | ✅ 16.4+ | ❌ | ✅ |
| PWA install | ✅ | ✅ 16.4+ | ❌ | ✅ |
| Offline (service worker) | ✅ | ✅ | ✅ | ✅ |
| Settings persistence (localStorage) | ✅ | ✅ | ✅ | ✅ |

Features not supported in a given browser degrade silently — the timer always works.

---

## Tech

Built with plain HTML, CSS, and JavaScript — zero dependencies, zero frameworks, zero build steps.

- **Web Audio API** — programmatic beeps and tones
- **Web Speech API** — voice announcements
- **Wake Lock API** — prevents screen sleep during workouts
- **Network-first Service Worker** — offline support, always serves fresh HTML when online
- **Inline SVG filters** — glow effect on the progress ring without bounding-box rendering artifacts
- **`prefers-color-scheme`** — automatic dark / light theme
- **`localStorage`** — remembers the collapsed/expanded state of the settings panel

---

*The bell always rings. You decide what it means.*
