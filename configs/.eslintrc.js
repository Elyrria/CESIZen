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
      // Backend-specific configuration
      files: ["backend/**/*.ts"],
      env: {
        node: true
      },
      rules: {
        // Backend-specific rules
      }
    },
    {
      // Frontend-specific configuration
      files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
      env: {
        browser: true
      },
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      rules: {
        "react/react-in-jsx-scope": "off"
        // Other frontend-specific rules
      },
      settings: {
        react: {
          version: "detect"
        }
      }
    }
  ]
}
