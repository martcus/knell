# Knell — EMOM timer PWA

Single-file, zero-dependency PWA for kettlebell training (EMOM, death-by, work/rest). No build step, no tests, no package.json. Not a git repo (as of writing).

## Files
- `index.html` — the whole app: CSS, markup, JS (one main `<script>` at the end, plus a tiny `<script>` in `<head>` that sets `data-theme` before first paint).
- `sw.js` — service worker (network-first for HTML, cache-first for the rest).
- `manifest.json`, `icon-*.png` — PWA metadata.
- `README.md` — user-facing docs. Parts are stale: it still mentions `knell.html` (standalone copy, since removed) and "six files".

## Release rule
Bump **both** on every change that ships, keeping them in sync:
- `APP_VERSION` in `index.html` (bottom of the script)
- `CACHE_VERSION` in `sw.js` (`knell-vX.Y.Z`)

Otherwise installed PWAs keep serving the old cached version.

## Architecture notes (non-obvious)
- **Clock** (`clockStart/Pause/Resume/Poll`): wall-clock driven via `performance.now()`, polled every 100 ms; `clockFn` (`tickStartCd` or `tickEmom`) is called once per elapsed real second. Never use a plain `setInterval(…,1000)` for timing — it drifts and is throttled in background.
  - Seconds missed while throttled are replayed with `catchingUp=true`; all sound/speech/flash helpers return early in that state, so only the last replayed second is audible. New sound/UI-effect helpers must honour `catchingUp`.
  - Start countdown → first round hands off on the same clock (`launchEmom(true)` shifts `clockOrigin`) so no drift is added.
- **Round model**: `elapsed`/`phaseDur` are per *phase*. Classic mode: one phase per round (`roundDuration`), with halfway signal. Work/Rest mode (`wrMode`): `phase` is `'work'|'rest'`, no halfway, no trailing rest after the last round, DONE button hidden.
- **DONE tap** (classic mode only): `markDone()` stores `workSec`; rest = `phaseDur - workSec`. Log entries are `{round, work, rest}`; `rest===null` means "no data" (or the last work/rest round). `logStats()` feeds both the on-screen summary and the copy-to-clipboard text (`buildSummary`).
- **Theme**: CSS dark vars in `:root`, light vars in `:root[data-theme="light"]`. Ring stroke colour is an *inline* value resolved with `cssVar()` at draw time, so it must be redrawn after a theme change (`toggleTheme` does this). Preference stored in `localStorage` key `knell_theme`; absent = follow OS.
- **Audio/speech** start only after a user gesture (iOS); `toggleTimer` resumes the `AudioContext` and prewarms speech.
- Other `localStorage` key: `knell_settings_open`. Run config (rounds/duration/toggles) is *not* persisted yet.

## Working in this repo
- Edit `index.html` directly; it's large, so read the relevant section rather than the whole file. Files use LF line endings.
- Verify JS syntax quickly by extracting the `<script>` blocks and running `node --check` on them.
- UI language is English (labels, voice announcements, copied summary); conversation with the maintainer is in Italian.

## Backlog ideas (not implemented)
Persist last config + presets, min duration < 10 s in classic mode, "again" quick-restart for single-round rest timing, session history in `localStorage`, vibration patterns, voice/volume settings.
