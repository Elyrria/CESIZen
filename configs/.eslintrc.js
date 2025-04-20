export default {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: {
    node: true,
    es6: true
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "prettier/prettier": ["error", { singleQuote: false, semi: false }]
  },
  overrides: [
    {
      // Configuration spécifique au backend
      files: ["backend/**/*.ts"],
      env: {
        node: true
      },
      rules: {
        // Règles spécifiques au backend
      }
    },
    {
      // Configuration spécifique au frontend
      files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
      env: {
        browser: true
      },
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      rules: {
        "react/react-in-jsx-scope": "off"
        // Autres règles spécifiques au frontend
      },
      settings: {
        react: {
          version: "detect"
        }
      }
    }
  ]
}
