// Render one video to out/<slug>.mp4 (H.264).
// Usage: npm run render -- [slug] [--audio]
// Without a slug, renders the newest video folder.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const videosDir = join(root, 'src/videos');
const args = process.argv.slice(2);
const audio = args.includes('--audio');
const slug =
  args.find((a) => !a.startsWith('--')) ??
  readdirSync(videosDir)
    .filter((d) => statSync(join(videosDir, d)).isDirectory())
    .sort()
    .at(-1);

const data = JSON.parse(readFileSync(join(videosDir, slug, 'script.json'), 'utf8'));
if (audio && !existsSync(join(root, 'public', slug, 'voiceover.mp3'))) {
  console.error(`--audio needs public/${slug}/voiceover.mp3`);
  process.exit(1);
}

const run = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, {stdio: 'inherit', cwd: root});
run('node', ['scripts/check.mjs', slug]);
run('npx', [
  'remotion',
  'render',
  data.id,
  `out/${slug}.mp4`,
  '--codec=h264',
  `--props=${JSON.stringify({withAudio: audio, showSafeZone: false})}`,
]);
console.log(`\nRendered out/${slug}.mp4`);
