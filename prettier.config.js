module.exports = {
  arrowParens: 'always',
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  // pnpm doesn't support plugin autoloading
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss#installation
  plugins: [require('prettier-plugin-tailwindcss')],
};
