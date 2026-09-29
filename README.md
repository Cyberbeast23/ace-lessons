# Learning Lab

Daily practice lessons (math, reading, writing, and sometimes Cantonese). Each file is self-contained HTML with no external dependencies.

## Adding a new day
1. Create `lessons/YYYY-MM-DD/` containing `math.html`, `reading.html`, `writing.html` (and `cantonese.html` when included).
   Back links inside each lesson point to `../../index.html`.
2. In `index.html`, remove the `latest` class and the `NEWEST` badge from the previous top `<section>`,
   then insert a new `<section class="day latest" id="dYYYY-MM-DD">` block directly below the
   `<!-- LESSONS-START -->` comment (newest first).
3. Commit and push to `main`; GitHub Pages redeploys automatically.
