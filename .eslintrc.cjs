const { defineConfig } = require("eslint-define-config");

const longParentPath =
	"{.," +
	Array.from({ length: 10 }, (_, i) => "../".repeat(i + 1).slice(0, -1)).join(",") +
	"}";

module.exports = defineConfig({
	ignorePatterns: [
		"**/node_modules",
		"**/vendor",
		"src/assets/libraries",
		"**/temp/**",
		"**/dist/**",
		"**/build/**",
	],
	settings: {
		ecmascript: 6,
		react: {
			version: "999.999.999",
		},
	},
	parserOptions: {
		project: [
			"./server/tsconfig.json",
			"./client/tsconfig.json",
			"./shared/tsconfig.json",
		],
		ecmaFeatures: {
			jsx: true,
			blockBindings: true,
		},
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "react", "prettier", "import"],
	extends: [
		"plugin:redos/recommended",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"prettier",
	],
	env: {
		browser: true,
		es6: true,
		commonjs: false,
		node: false,
		jquery: false,
		mocha: false,
	},
	rules: {
		"redos/no-vulnerable": "error",
		"sort-imports": [
			"off",
			{
				ignoreCase: true,
				ignoreDeclarationSort: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
				allowSeparatedGroups: false,
			},
		],
		"import/default": "error",
		"import/dynamic-import-chunkname": ["off"],
		"import/export": "error",
		"import/exports-last": "off",
		"import/extensions": [
			"off",
			"ignorePackages",
			{
				js: "never",
				mjs: "never",
				jsx: "never",
			},
		],
		"import/first": "error",
		"import/group-exports": "off",
		"import/max-dependencies": ["off", { max: 10 }],
		"import/named": "error",
		"import/namespace": "error",
		"import/newline-after-import": "error",
		"import/no-absolute-path": "error",
		"import/no-amd": "error",
		"import/no-anonymous-default-export": "off",
		"import/no-commonjs": "off",
		"import/no-cycle": "error",
		"import/no-default-export": "off",
		"import/no-deprecated": "warn",
		"import/no-duplicates": "error",
		"import/no-dynamic-require": "error",
		"import/no-extraneous-dependencies": "error",
		"import/no-internal-modules": "off",
		"import/no-mutable-exports": "off",
		"import/no-named-as-default": "off",
		"import/no-named-as-default-member": "error",
		"import/no-named-default": "error",
		"import/no-named-export": "off",
		"import/no-namespace": "off",
		"import/no-nodejs-modules": "off",
		"import/no-relative-parent-imports": "off",
		"import/no-restricted-paths": "off",
		"import/no-self-import": "error",
		"import/no-unassigned-import": "off",
		"import/no-unresolved": ["off", { commonjs: true, caseSensitive: true }],
		"import/no-unused-modules": "off",
		"import/no-useless-path-segments": "error",
		"import/no-webpack-loader-syntax": "error",
		"import/order": [
			"warn",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"index",
					"sibling",
					"unknown",
				],
				pathGroups: [
					{
						pattern: "lestin",
						group: "external",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Basics/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Auth/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Account/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Tables/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Models/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Components/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Utilities/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/Entities/**`,
						group: "parent",
						position: "before",
					},
					{
						pattern: `${longParentPath}/shared/**`,
						group: "unknown",
						position: "before",
					},
					{
						pattern: `${longParentPath}/images/**`,
						patternOptions: { partial: true },
						group: "unknown",
						position: "before",
					},
					{
						pattern: `${longParentPath}/styles/**/*.{css,scss}`,
						patternOptions: { partial: true },
						group: "unknown",
						position: "before",
					},
				],
				alphabetize: {
					order: "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
					caseInsensitive: true /* ignore case. Options: [true, false] */,
				},
				warnOnUnassignedImports: true,
				"newlines-between": "always",
				distinctGroup: false,
			},
		],
		"import/prefer-default-export": "off",
		"import/unambiguous": "off",

		camelcase: ["off", { ignoreImports: true }],
		"no-mixed-operators": "error",
		"no-mixed-spaces-and-tabs": "off",
		"no-inner-declarations": "off",
		"prefer-arrow-callback": ["warn"],
		semi: ["error", "always"],
		strict: 0,
		"no-unused-vars": ["off"],
		"no-undef": ["off"],
		"prettier/prettier": ["warn", { useTabs: true, tabWidth: 4 }],
		"no-tabs": ["off", { allowIndentationTabs: true }],
		quotes: ["error", "double", { avoidEscape: true }],
		"prefer-const": [
			"warn",
			{
				destructuring: "all",
				ignoreReadBeforeAssign: true,
			},
		],
		"no-var": ["off"],
		"no-unreachable": ["warn"],
		"no-multi-spaces": [
			"error",
			{
				exceptions: {
					VariableDeclarator: true,
					FunctionExpression: true,
				},
			},
		],
		"key-spacing": [0, { align: "value" }],
		"no-underscore-dangle": 0,
		"newline-per-chained-call": ["off", { ignoreChainWithDepth: 3 }],
		"max-lines": ["error", 600],
		"max-depth": ["warn", 3],
		"max-params": ["warn", 3],
		"max-len": [
			"off",
			{
				code: 90,
				tabWidth: 4,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
		indent: ["off", "tab"],
		"@typescript-eslint/indent": ["off", "tab"],
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-inferrable-types": ["off"],
		"@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				disallowTypeAnnotations: true,
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/naming-convention": [
			"warn",
			{
				selector: "default",
				format: ["camelCase"],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
			},
			{
				selector: "import",
				format: [],
				leadingUnderscore: "forbid",
				trailingUnderscore: "forbid",
				custom: {
					regex: "(^[xzv]?(?:_?[A-Z][a-z]*\\d*)*$)|(^_$)",
					match: true,
				},
			},
			{
				selector: "property",
				format: ["camelCase", "snake_case"],
				leadingUnderscore: "allow",
			},
			{
				selector: "property",
				modifiers: ["private"],
				format: ["camelCase", "snake_case"],
				leadingUnderscore: "require",
				trailingUnderscore: "allow",
			},
			{
				selector: "property",
				modifiers: ["requiresQuotes"],
				format: [],
			},
			{
				selector: "variable",
				format: [],
				custom: {
					regex: "^[A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*\\d*$",
					match: true,
				},
			},
			/* {
				"selector": "variable",
				"types": ["function"],
				"format": [],
				"custom": {
					"regex": "^[A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*\\d*$",
					"match": true
				}
			}, */
			{
				selector: "variable",
				types: ["array", "boolean", "number", "string"],
				// "modifiers": ["const"],
				format: [],
				custom: {
					regex: "(^[a-z]+(?:_?[A-Z][a-z]*\\d*)*$)|(^_$)",
					match: true,
				},
			},
			{
				selector: "enumMember",
				format: [],
				custom: {
					regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]*\\d*)*$",
					match: true,
				},
			},
			{
				selector: "function",
				format: ["PascalCase"],
			},
			{
				selector: "method",
				format: ["camelCase", "PascalCase"],
				leadingUnderscore: "allow",
			},
			/* {
				"selector": "variable-Q",
				"modifiers": ["const"],
				"format": [],
				"custom": {
					"regex": "^_|([A-Z]?[a-z]+(?:_?[A-Z][a-z]*\\d*)*)$",
					"match": true
				}
			}, */
			{
				selector: "variable",
				types: ["boolean"],
				format: ["PascalCase"],
				prefix: [
					"is",
					"should",
					"has",
					"can",
					"did",
					"will",
					"go",
					"obeys",
					"needs",
				],
			},
			{
				selector: "typeParameter",
				format: ["PascalCase"],
				prefix: ["T"],
			},
			{
				selector: ["variable", "function"],
				format: ["camelCase"],
				leadingUnderscore: "allow",
			},
			{
				selector: "class",
				format: [],
				custom: {
					regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
					match: true,
				},
			},
			{
				selector: ["interface", "typeAlias"],
				format: [],
				prefix: ["I"],
				custom: {
					regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
					match: true,
				},
			},
			{
				selector: "typeLike",
				format: [],
				custom: {
					regex: "^[A-Z][a-z]+(?:_?[A-Z][a-z]+\\d*)*$",
					match: true,
				},
			},
		],
		"react/jsx-key": ["off"],
		"react/jsx-max-props-per-line": ["error", { maximum: 4, when: "multiline" }],
		"react/prop-types": ["off"],
		"react/react-in-jsx-scope": ["off"],
		"react/no-unknown-property": [
			"error",
			{
				ignore: [
					"class",
					"innerHTML",
					"stroke-width",
					"stroke-linecap",
					"stroke-linejoin",
					"stroke-miterlimit",
					"stroke-opacity",
					"stroke-dasharray",
					"funcShow",
					"funcDismiss",
				],
			},
		],
	},
});
