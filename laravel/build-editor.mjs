import esbuild from 'esbuild';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const outfile = resolve('public/build/editor/tiptap-studio.js');
mkdirSync(dirname(outfile), { recursive: true });

await esbuild.build({
    entryPoints: [resolve('resources/js/tiptap-editor.js')],
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es2020'],
    outfile,
});

console.log('Built TipTap Studio bundle:', outfile);
