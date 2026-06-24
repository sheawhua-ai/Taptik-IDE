module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  env: { browser: true, es2021: true },
  rules: { "react/react-in-jsx-scope": "off", "no-undef": "off" }
};
