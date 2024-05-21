/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  printWidth: 110,
  trailingComma: 'all',
  endOfLine: 'auto',
  singleQuote: true,
  importOrder: [
    // Mocks must be at the top as they contain vi.mock calls
    '(.*)/__mocks__/(.*)',
    // bookingScenario contains prismock that must be imported asap
    '(.*)bookingScenario(.*)',
    '<THIRD_PARTY_MODULES>',
    '^@(what-if-store|ee)/(.*)$',
    '^@lib/(.*)$',
    '^@components/(.*)$',
    '^@(server|trpc)/(.*)$',
    '^~/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};

module.exports = config;
