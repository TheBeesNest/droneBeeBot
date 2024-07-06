/* eslint-disable @typescript-eslint/no-var-requires */

//as we are nt use EMS modules we have to import using require,
//so this file has had that error disabled

const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const importPlugin = require('eslint-plugin-import');
const eslintConfigPrettier = require('eslint-config-prettier');

const ignoreList = { ignores: [
	'eslint.config.js',
	'dist/*',
	'**/.pnp.cjs',
	'**/.pnp.loader.mjs',
]};


module.exports = [
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	ignoreList,
	{
		//includes: ['src/*'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: 'tsconfig.json',
				tsconfigRootDir: __dirname,
				sourceType: 'module',
			},
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external'],
						'internal',
						['parent', 'sibling', 'index'],
					],
					'newlines-between': 'always',
				},
			],
		},
	},
	eslintPluginPrettierRecommended,
];
