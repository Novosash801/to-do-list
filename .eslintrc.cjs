module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'prettier'],
    rules: {
        'react/jsx-no-target-blank': 'off',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        indent: [
            'warn',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true,
            },
        ],
        semi: ['warn', 'always'],
        'react/prop-types': ['off'],
        'no-unused-vars': ['warn'],
    },
};

