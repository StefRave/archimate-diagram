const { TsJestTransformer } = require('ts-jest');

// Jest runs CommonJS. Leave the source expression; rewrite it only for this compile.
const transformer = new TsJestTransformer({
  tsconfig: {
    module: 'commonjs',
  },
});

function rewriteImportMeta(src) {
  return src.replace(/import\.meta\.env\.MODE/g, 'process.env.MODE');
}

module.exports = {
  process(src, filename, options) {
    return transformer.process(rewriteImportMeta(src), filename, options);
  },
  getCacheKey(src, filename, options) {
    return transformer.getCacheKey(rewriteImportMeta(src), filename, options);
  },
};
