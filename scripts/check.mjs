// Pre-render checks for every video (or one: `node scripts/check.mjs <slug>`):
// frame timing, spec, caption ranges, voiceover length, minimum font sizes.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const videosDir = join(root, 'src/videos');
const only = process.argv[2];
const slugs = readdirSync(videosDir).filter(
  (d) => statSync(join(videosDir, d)).isDirectory() && (!only || d === only),
);
if (only && slugs.length === 0) {
  console.error(`No video folder named ${only}`);
  process.exit(1);
}

const tsFiles = (d, out = []) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) tsFiles(p, out);
    else if (/\.(tsx|ts)$/.test(f)) out.push(p);
  }
  return out;
};

const fontErrors = (files) => {
  const errs = [];
  let n = 0;
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(/fontSize(?:=\{|:\s*)(\d+)/g)) {
      n++;
      if (Number(m[1]) < 28) errs.push(`Font ${m[1]}px < 28px in ${f.replace(root + '/', '')}`);
    }
  }
  return {errs, n};
};

let failed = false;
const shared = fontErrors(tsFiles(join(root, 'src/shared')));

for (const slug of slugs) {
  const file = join(videosDir, slug, 'script.json');
  if (!existsSync(file)) continue;
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const errors = [...shared.errs];
  const notes = [];

  const sum = data.scenes.reduce((s, x) => s + x.frames, 0);
  const total = sum - data.transitionFrames * (data.scenes.length - 1);
  if (data.scenes.length !== 5) errors.push(`Expected 5 scenes, found ${data.scenes.length}`);
  if (total !== data.totalFrames || total !== 900) errors.push(`Frames: ${sum} − transitions = ${total}, expected 900`);
  else notes.push(`timing ${data.scenes.map((s) => s.frames).join('+')}=${sum} − ${data.scenes.length - 1}×${data.transitionFrames} = ${total} frames (${total / data.fps}s)`);
  if (data.width !== 1080 || data.height !== 1920 || data.fps !== 30) errors.push('Spec must be 1080x1920 @ 30fps');

  for (const s of data.scenes) {
    let last = 0;
    for (const c of s.captions) {
      if (c.from < last || c.to > s.frames || c.from >= c.to) errors.push(`Caption out of range in ${s.key}: "${c.text}"`);
      last = c.to;
    }
  }

  const words = data.scenes.reduce((n, s) => n + s.vo.split(/\s+/).filter(Boolean).length, 0);
  if (words < 55 || words > 75) errors.push(`Voiceover ${words} words, outside 55–75`);
  else notes.push(`voiceover ${words} words`);

  const own = fontErrors(tsFiles(join(videosDir, slug)));
  errors.push(...own.errs);
  notes.push(`${shared.n + own.n} font sizes ≥ 28px`);

  if (errors.length) {
    failed = true;
    console.error(`✗ ${slug}\n  - ${errors.join('\n  - ')}`);
  } else {
    console.log(`✓ ${slug}: ${notes.join(' · ')}`);
  }
}
process.exit(failed ? 1 : 0);
