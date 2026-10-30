# Educational video series — project rules

Daily (Mon–Fri) 30-second vertical educational videos on business, real estate,
finance, economics and financial news, built with Remotion. Owner: Darnell Clarke.

## Schedule (America/Los_Angeles, Mon–Fri)
- 5:40 AM — scheduled task "Weekday video script" researches and logs the day's script
  (Status "Awaiting Approval") and emails/pushes it to the owner.
- Owner approves by setting **Script approval = Approved** in the tracker (or "Changes
  Requested" with notes in Notes / errors).
- 2:22 PM — scheduled task "Weekday video build" builds every Approved row whose
  "Remotion project location" is empty, pushes it here, sets Status "Preview Ready".
- Owner previews (`git pull`, `npm install`, `npm run studio`) and says "final approved";
  only then render. Category rotation: Mon Business · Tue Real Estate · Wed Finance ·
  Thu Economics · Fri Current Events.
- In an interactive session, check the tracker first: build only Approved rows, render
  only "Final Approved" rows, and update Status / Render status / locations as you go.

## Workflow
1. A scheduled task researches and writes each weekday's script and logs it to the
   Google Sheet "Educational Video Content Tracker"
   (https://docs.google.com/spreadsheets/d/1sIVlIPCHp-CuA27D6Vw9Dd6qtO5Dvu4d3gMr4cbIsfw/edit).
2. **Never build a video before the owner approves its script.**
3. After approval: create `src/videos/YYYY-MM-DD-slug/` (copy the newest video folder as a
   starting point), put scene durations, voiceover, captions and every on-screen figure
   with its source in `script.json`, register it in `src/videos/index.ts`.
4. `npm run check`, then `npm run studio` for preview. **Wait for the owner's final
   approval before rendering.** Then `npm run render -- <slug>`.
5. Never publish or schedule posts without the owner's separate approval.

Read and apply the Remotion Best Practices Skill (`npx skills add remotion-dev/skills`)
before building.

## Video spec
- 1080×1920, 9:16, 30 fps, exactly 900 frames (30.0 s), H.264 MP4
- 5 scenes: Hook → Explanation → How it works → Real-world application → Takeaway
- Scene frames must sum to 948 (900 + 4 transitions × 12 frames)
- Voiceover 60–70 words; on-screen captions synced to narration for sound-off viewing
- Safe zone: top ≥150 px, bottom ≥170 px, sides ≥60 px (`SceneFrame` enforces this;
  the `*-SafeZoneCheck` composition draws the outline)
- Fonts: headlines ≥56 px, body ≥36 px, labels ≥28 px, never below 28 px

## Visual style (src/shared/theme.ts)
- Background #0a0a0a, text #ffffff, accent #6366f1, emphasis #22c55e
- Inter 400/600/800
- Every entering element: `spring({damping: 200})` (use `Enter` / `useSpring`)
- Stagger related elements 8–12 frames (`STAGGER = 10`)
- `TransitionSeries` with 12-frame `fade()` between scenes
- Diagrams draw with SVG stroke-dashoffset (`useDraw` + `drawProps`)
- Numbers count up with `interpolate()` and tabular-nums (`CountUp`)
- Final scene: 10–15 particles drifting upward (`Particles`)
- Build icons, charts and diagrams as SVG/React; dense but readable, no walls of text

## Accuracy
- Never invent statistics, returns, quotes or news. Every figure needs a source with
  its data period and publication date (keep them in `script.json` → `figures`).
- Prefer original sources (Fed, BLS, BEA, Census, SEC, IRS, FDIC, HUD/FHFA, Freddie Mac).
- Label illustrative examples "Illustrative". Compute all example math in code.
- Educational only — no personalized financial, legal or tax advice; no return promises.
- Don't claim a voiceover exists unless the audio file does
  (`public/<slug>/voiceover.mp3`, render with `npm run render -- <slug> --audio`).
