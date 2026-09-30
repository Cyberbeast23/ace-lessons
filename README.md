# Learning Lab

Daily practice lessons (math, reading, writing, and sometimes Cantonese). Each file is self-contained HTML with no external dependencies.

## Adding a new day
1. Create `lessons/YYYY-MM-DD/` containing `math.html`, `reading.html`, `writing.html` (and `cantonese.html` when included).
   Back links inside each lesson point to `../../index.html`.
2. In `index.html`, remove the `latest` class and the `NEWEST` badge from the previous top `<section>`,
   then insert a new `<section class="day latest" id="dYYYY-MM-DD">` block directly below the
   `<!-- LESSONS-START -->` comment (newest first).
3. Commit and push to `main`; GitHub Pages redeploys automatically.


## Cantonese pronunciation audio
Shared clips live in `audio/cantonese/` (Hong Kong TTS: `zh-HK-HiuMaanNeural`).

### Adding audio for a new day
1. Drop each new word’s mp3 into `audio/cantonese/` using a stable name, e.g. `17-ngo5-I.mp3`.
   Reuse the same filename forever so old lesson pages keep working.
2. Optionally rebuild `ALL-words.mp3` (English then Cantonese for every clip) and replace the file in that folder.
3. In that day’s `cantonese.html`:
   - Add `audio:"17-ngo5-I.mp3"` on each `WORDS` entry.
   - Keep the shared script tag: `<script src="../../audio/cantonese/player.js"></script>`
   - After `buildCards()`, call `AceCantoneseAudio.wireLesson({playAllBtn:"#playAll",stopBtn:"#stopAudio"});`
   - Give each vocab card `data-audio` + a `.practice` div (see existing Sept 29 / Sept 30 pages).
4. Each word gets **Hear model**, **Record** (~3s, mic stays on-device), then **Play my try** / **Play model** to compare.
   Recordings are in-memory only for that page visit — nothing is uploaded.
5. Kid-friendly tap targets are already in `player.js` + the page CSS. On phones, Ace (or Dad) must allow the microphone when the browser asks.

### Example live URLs
- Lesson: https://cyberbeast23.github.io/ace-lessons/lessons/2026-09-29/cantonese.html
- Clip: https://cyberbeast23.github.io/ace-lessons/audio/cantonese/01-nei5-hou2-hello.mp3
