import { globalIgnores } from "eslint/config";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginStylistic from "@stylistic/eslint-plugin";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/recommended"],
  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.recommendedTypeChecked,
  pluginUnicorn.configs.recommended,
  pluginStylistic.configs["disable-legacy"],
  pluginStylistic.configs.recommended,
  {
    rules: {
      // Stylistic Rules
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/comma-dangle": [
        "error",
        "always-multiline",
      ],
      "@stylistic/brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
      "@stylistic/func-call-spacing": ["error", "never"],
      "@stylistic/indent": ["error", 2],
      // Unicorn rules
      "unicorn/no-null": "off",
      "unicorn/numeric-separators-style": "off",
      // typescript-eslint rules
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["variable", "function", "classProperty", "objectLiteralProperty", "parameterProperty", "classMethod", "objectLiteralMethod", "typeMethod", "accessor"],
          format: [
            "strictCamelCase",
            "StrictPascalCase",
          ],
          leadingUnderscore: "allowSingleOrDouble",
          trailingUnderscore: "allow",
          filter: {
            regex: "[- ]",
            match: false,
          },
        },
        {
          selector: "typeLike",
          format: [
            "StrictPascalCase",
          ],
        },
        {
          selector: "variable",
          types: [
            "boolean",
          ],
          format: [
            "StrictPascalCase",
          ],
          prefix: [
            "is",
            "has",
            "can",
            "should",
            "will",
            "did",
          ],
        },
        {
          // Interface name should not be prefixed with `I`.
          selector: "interface",
          filter: /^(?!I)[A-Z]/.source,
          format: [
            "StrictPascalCase",
          ],
        },
        {
          // Type parameter name should either be `T` or a descriptive name.
          selector: "typeParameter",
          filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
          format: [
            "StrictPascalCase",
          ],
        },
        // Allow these in non-camel-case when quoted.
        {
          selector: [
            "classProperty",
            "objectLiteralProperty",
          ],
          format: null,
          modifiers: [
            "requiresQuotes",
          ],
        },
      ],
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple",
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "minimumDescriptionLength": 4,
        },
      ],
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            "object": {
              message: "The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848",
              fixWith: "Record<string, unknown>",
            },
            "Buffer": {
              message: "Use Uint8Array instead. See: https://sindresorhus.com/blog/goodbye-nodejs-buffer",
              suggest: [
                "Uint8Array",
              ],
            },
            "[]": "Don't use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.",
            "[[]]": "Don't use `[[]]`. It only allows an array with a single element which is an empty array. Use `SomeType[][]` instead.",
            "[[[]]]": "Don't use `[[[]]]`. Use `SomeType[][][]` instead.",
            "[[[[]]]]": "ur drunk 🤡",
            "[[[[[]]]]]": "🦄💥",
          },
        },
      ],
      "@typescript-eslint/class-literal-property-style": [
        "error",
        "getters",
      ],
      "@typescript-eslint/consistent-generic-constructors": [
        "error",
        "constructor",
      ],
      "@typescript-eslint/consistent-indexed-object-style": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": [
        "error",
        "type",
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: [
            "signature",

            "public-static-field",
            "public-static-method",

            "protected-static-field",
            "protected-static-method",

            "private-static-field",
            "private-static-method",

            "static-field",
            "static-method",

            "public-decorated-field",
            "public-instance-field",
            "public-abstract-field",
            "public-field",

            "protected-decorated-field",
            "protected-instance-field",
            "protected-abstract-field",
            "protected-field",

            "private-decorated-field",
            "private-instance-field",
            "private-field",

            "instance-field",
            "abstract-field",
            "decorated-field",
            "field",

            "public-constructor",
            "protected-constructor",
            "private-constructor",
            "constructor",

            "public-decorated-method",
            "public-instance-method",
            "public-abstract-method",
            "public-method",

            "protected-decorated-method",
            "protected-instance-method",
            "protected-abstract-method",
            "protected-method",

            "private-decorated-method",
            "private-instance-method",
            "private-method",

            "instance-method",
            "abstract-method",
            "decorated-method",
            "method",
          ],
        },
      ],
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-unsafe-enum-comparison": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // Disabling base eslint rules
      "brace-style": "off",
      "dot-notation": "off",
      "default-param-last": "off",
      "comma-spacing": "off",
      "comma-dangle": "off",
      "func-call-spacing": "off",
      "indent": "off",
      "prefer-template": "error",
    },
  },
);
