// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config({
	files: ['** /*.ts'],
	extends: [
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		eslintConfigPrettier,
	],
	rules: {
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
	},
});
