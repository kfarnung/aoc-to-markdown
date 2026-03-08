import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["addon/**/*.js", "esbuild.config.mjs"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
  },
];
