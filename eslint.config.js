/* ==========================================================
 * eslint.config.js — The course "rulebook" for ESLint
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Tells ESLint which CSE 341 coding standards
 *   to check in our code.
 * LOGIC: We export a list (array) of settings objects. ESLint
 *   reads them in order: first what to skip, then which files
 *   to check and which rules to apply.
 * WHY WE NEED IT: Without this file, ESLint has no rules to
 *   enforce. "npm run lint" reads this file automatically.
 * LEARNING GAP: This is a .js file, so comments are allowed
 *   here (unlike package.json). It is also checked by ESLint
 *   itself, because it matches "**\/*.js".
 * ========================================================== */
export default [
    /* --------------------------------------------------------
     * What to skip
     * PLAIN ENGLISH: Don't check the node_modules folder.
     * LOGIC: "**" means "every file inside, at any depth."
     * WHY WE NEED IT: node_modules is other people's code
     *   (thousands of files). Checking it is slow and not ours
     *   to fix.
     * LEARNING GAP: .gitignore keeps files off GitHub; this
     *   "ignores" list keeps files out of ESLint. Two different
     *   tools, two different ignore lists.
     * -------------------------------------------------------- */
    {
        ignores: ['node_modules/**']
    },

    /* --------------------------------------------------------
     * What to check and how to read it
     * PLAIN ENGLISH: Check every .js file, and read it as
     *   modern JavaScript using import/export.
     * LOGIC: ecmaVersion 'latest' = newest JavaScript features.
     *   sourceType 'module' = files use import/export (matches
     *   "type": "module" in package.json).
     * WHY WE NEED IT: Without this, ESLint might think "import"
     *   is a mistake.
     * LEARNING GAP: "globals" lists built-in names that exist
     *   without being imported. console and process are provided
     *   by Node. 'readonly' means "you can use it, but don't
     *   overwrite it." Without these, ESLint might flag
     *   process.env.PORT as unknown.
     * -------------------------------------------------------- */
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly'
            }
        },

        /* ------------------------------------------------------
         * The rules (each one is a course standard)
         * PLAIN ENGLISH: 'error' = breaking this rule is a
         *   failure that must be fixed.
         * LOGIC:
         *   prefer-arrow-callback → use () => {} for callbacks,
         *     not function () {}.
         *   no-var → never use var.
         *   prefer-const → use const if the value never changes.
         *   arrow-body-style 'always' → arrow functions always use
         *     { } with an explicit return.
         *   consistent-return → a function should either always
         *     return a value or never return one, not a mix.
         * WHY WE NEED IT: These match the CSE 341 standards table.
         * LEARNING GAP: Some of these are auto-fixable with
         *   "npm run lint:fix" (like var → const). Others need you
         *   to fix them by hand.
         * ------------------------------------------------------ */
        rules: {
            'prefer-arrow-callback': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'arrow-body-style': ['error', 'always'],
            'consistent-return': 'error',

            /* ----------------------------------------------------
             * Custom "don't do this" rules (no-restricted-syntax)
             * PLAIN ENGLISH: Flag specific code patterns the course
             *   doesn't allow, with a helpful message for each.
             * LOGIC: Each "selector" describes a code pattern to
             *   look for. If ESLint finds it, it shows "message".
             *   1–2: no require() or module.exports (CommonJS).
             *   3–4: no .then() or .catch() (use async/await).
             *   5–6: Express responses (res.json / res.send) must
             *        have "return" in front of them.
             * WHY WE NEED IT: These course standards don't have a
             *   built-in ESLint rule, so we describe them ourselves.
             * LEARNING GAP: You don't need to understand selector
             *   syntax in detail. Just know each one = one standard,
             *   and the "message" tells you how to fix it.
             * ---------------------------------------------------- */
            'no-restricted-syntax': [
                'error',
                {
                    selector: "CallExpression[callee.name='require']",
                    message: 'Use ESM import syntax instead of require().'
                },
                {
                    selector: "AssignmentExpression[left.object.name='module'][left.property.name='exports']",
                    message: 'Use ESM export syntax instead of module.exports.'
                },
                {
                    selector: "CallExpression[callee.property.name='then']",
                    message: 'Use async/await instead of .then().'
                },
                {
                    selector: "CallExpression[callee.property.name='catch']",
                    message: 'Use try/catch with async/await instead of .catch().'
                },
                {
                    selector: "ExpressionStatement > CallExpression[callee.object.name='res'][callee.property.name=/^(json|send)$/]",
                    message: 'Return Express responses, such as return res.status(200).json(data).'
                },
                {
                    selector: "ExpressionStatement > CallExpression[callee.property.name=/^(json|send)$/][callee.object.callee.object.name='res']",
                    message: 'Return Express responses, such as return res.status(200).json(data).'
                }
            ]
        }
    }
];