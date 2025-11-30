import globals from "globals";

export default [
  {
    ignores: ["addon/**/*.js"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
  },
];
