module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": [
        "prettier",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:import/typescript"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint",
        "import"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": ["error"],
        "import/no-unresolved": [2, { commonjs: true, amd: true }],
        "no-tabs": ["error", { "allowIndentationTabs": true }],
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/dot-notation": "off",
        '@typescript-eslint/camelcase': "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
                "accessibility": "explicit"
            }
        ],
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/naming-convention": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-inferrable-types": [
            "error",
            {
                "ignoreParameters": true
            }
        ],
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-body-style": "error",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "constructor-super": "error",
        "curly": "off",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": "off",
        "id-match": "off",
        "import/no-deprecated": "warn",
        "import/order": "error",
      
        "no-bitwise": "error",
        "no-caller": "error",
        "no-debugger": "error",
        "no-duplicate-case": "error",
        "no-empty": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-restricted-imports": [
            "error",
            "primeng",
            "rxjs/Rx"
        ],
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unused-labels": "error",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-object-spread": "error",
        "prefer-template": "error",
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "use-isnan": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rulesDirectory": ['codelyzer'],
                "rules": {
                    "import-spacing": true,
                    "no-unnecessary-callback-wrapper": true,
                    "prefer-conditional-expression": true,
                    "use-life-cycle-interface": true,
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type"
                    ]
                }
            }
        ]
    },
    "settings": {
        "import/resolver": {
            "node": {
                "paths": [
                    "src",
                ],
            },
        },
    }
};
