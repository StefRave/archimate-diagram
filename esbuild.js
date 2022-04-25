const esbuild = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    outdir: 'out',
    plugins: [sassPlugin()],
    loader: { '.svg': 'text', '.archimate': 'text' },
  })
  .catch((e) => console.error(e.message));
