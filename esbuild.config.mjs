import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/*', '@lezer/*'],
  format: 'cjs',
  platform: 'browser',
  target: 'es2018',
  outfile: 'build/main.js',
  logLevel: 'info',
  treeShaking: true,
  minify: false,
});
