# Educational Videos

Mon–Fri 30-second vertical explainers on business, real estate, finance, economics
and financial news, built with [Remotion](https://www.remotion.dev).

## Setup

```bash
npm install
npx skills add remotion-dev/skills   # Remotion Best Practices Skill
npm run check
npm run studio                       # preview in your browser
```

## Render

```bash
npm run render                              # newest video → out/<slug>.mp4
npm run render -- 2026-10-28-bank-spread    # a specific video
npm run render -- 2026-10-28-bank-spread --audio   # with public/<slug>/voiceover.mp3
```

## Layout

```
src/
  shared/            theme, motion helpers, SceneFrame (safe zone + captions), particles
  videos/
    index.ts         register every video here
    YYYY-MM-DD-slug/ script.json (timing, voiceover, captions, sourced figures),
                     scenes/, Video.tsx, SOCIAL.md
public/<slug>/       voiceover.mp3 and other assets per video
scripts/             check.mjs (pre-render checks), render.mjs
```

Project rules for Claude Code are in `CLAUDE.md`. Content tracker:
https://docs.google.com/spreadsheets/d/1sIVlIPCHp-CuA27D6Vw9Dd6qtO5Dvu4d3gMr4cbIsfw/edit

## Videos

| Date | Slug | Title | Status |
|---|---|---|---|
| 2026-10-28 | `2026-10-28-bank-spread` | How Banks Really Make Money (The Spread) | Built, awaiting preview |
| 2026-10-30 | `2026-10-30-real-vs-nominal-gdp` | GDP Grew 5.6%… or 3.4%? Real vs. Nominal | Built (no voiceover), awaiting preview |

Educational content only; not financial advice.
