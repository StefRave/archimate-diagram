const crypto = require('crypto');
const esbuild = require('esbuild');

// Jest runs CommonJS. TypeScript 7 ships a native tsc and no compiler API, so tests transpile here.
function rewriteImportMeta(src) {
  return src.replace(/import\.meta\.env\.MODE/g, 'process.env.MODE');
}

module.exports = {
  process(src, filename) {
    const result = esbuild.transformSync(rewriteImportMeta(src), {
      loader: filename.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'cjs',
      target: 'es2017',
      jsx: 'automatic',
      sourcefile: filename,
    });
    return { code: result.code };
  },
  getCacheKey(src, filename) {
    return crypto.createHash('md5').update(rewriteImportMeta(src)).update(filename).digest('hex');
  },
};
