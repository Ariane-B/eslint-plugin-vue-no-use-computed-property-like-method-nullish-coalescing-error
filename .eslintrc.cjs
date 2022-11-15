// http://eslint.org/docs/user-guide/configuring

const ERROR_LEVELS = Object.freeze({
   off: 0,
   warn: 1,
   error: 2,
})

const indentWidth = 3
const minItemsForLineBreak = 4

const warnInDevErrorInProd = process.env.NODE_ENV === 'production' ? ERROR_LEVELS.error : ERROR_LEVELS.warn

const globalComponentPatterns = Object.freeze([
   // Custom components
   '^[Tt]ippy$',
   '^[Rr]adio-?[Bb]uttons$',
   '^[Cc]heckbox$',
   '^[Mm]ulti-?[Ss]elect-?[Cc]-?[Ff]-?[Mm]$',

   // Package-provided components
   '^[Mm]ultiselect$',
   '^[Pp]ortal$',
   '^[Pp]ortal-?[Tt]arget$',
   '^[Rr]outer-?[Ll]ink$',
   '^[Rr]outer-?[Vv]iew$',
   '^[Ss]crollactive$',
   '^[Vv]alidation-?[Pp]rovider$',
   '^[Vv]alidation-?[Oo]bserver$',

   // Vue Bootstrap
   '^[Bb]-?[Bb]tn$',
   '^[Bb]-?[Ll]ink$',
   '^[Bb]-?[Cc]ollapse$',
   '^[Bb]-?[Dd]ropdown$',
   '^[Bb]-?[Dd]ropdown-?[Tt]ext$',
   '^[Bb]-?[Ff]orm-?[Gg]roup$',
   '^[Bb]-?[Ff]orm-?[Ss]elect$',
   '^[Bb]-?[Mm]odal$',
   '^[Bb]-?[Pp]agination$',
   '^[Bb]-?[Tt]ab$',
   '^[Bb]-?[Tt]abs$',
   '^[Bb]-?[Tt]able$',
])

const eslintSettings = {
   root: true,
   parserOptions: {
      sourceType: 'module',
      ecmaVersion: '2022',
   },
   env: {
      browser: true,
      node: true,
      'jest/globals': true,
   },
   globals: { aptrinsic: 'readonly' },
   // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
   extends: [ 'eslint:recommended', 'plugin:vue/recommended' /* 'plugin:jest/recommended' */ ],
   // Required to lint *.vue files
   plugins: [
      'vue',
      'jest',
      'newline-destructuring',
      'import-newlines',
      'import',
   ],
   reportUnusedDisableDirectives: true,
   overrides: [
      {
         files: [ '*.spec.js', 'tests/**/*.js' ],
         rules: {
            'no-magic-numbers': ERROR_LEVELS.off,
            'no-empty-function': ERROR_LEVELS.off,
            'require-await': ERROR_LEVELS.off,
            // Probably safe, since tests run in separate scopes & use arrow functions
            'no-loop-func': ERROR_LEVELS.off,
         },
      },
      {
         files: [
            '**/store/**/*.js',
            '**/stores/**/*.js',
            '*[Ss]tore.js',
            'src/modules/event/components/sectionComponents/analysis/**/*.js',
         ],
         rules: {
            // Vuex store getters force us to reach the 4th argument to access rootGetters.
            'max-params': ERROR_LEVELS.off,
         },
      },
      {
         files: [ '**/tests/**/*.js' ],
         rules: {
            // mock file like --> store.default = x, router.default = x
            'no-import-assign': ERROR_LEVELS.off,
         },
      },
      {
         // Big constants that should stay in alphabetical order
         files: [ '**/tests/_testData/_entityTypes.js', '**/src/components/IconSprite/spriteIcons.js' ],
         rules: {
            'sort-keys': [
               ERROR_LEVELS.warn,
               'asc',
               {
                  caseSensitive: false,
                  natural: true,
               },
            ],
         },
      },
   ],
   rules: {
      // ******************************************************************************************************
      // Possible errors
      // ******************************************************************************************************

      //#region Possible errors
      'no-console': warnInDevErrorInProd,
      'no-debugger': warnInDevErrorInProd,
      'no-alert': warnInDevErrorInProd,
      'no-unused-vars': warnInDevErrorInProd,
      //#endregion Possible errors


      // ******************************************************************************************************
      // Best practices & declarations
      // ******************************************************************************************************

      //#region Best practices & declarations

      //#region Optimization
      'no-magic-numbers': [
         ERROR_LEVELS.warn,
         {
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            ignore: [
               -2,
               -1,
               0,
               1,
               2,
            ],
         },
      ],
      'prefer-regex-literals': ERROR_LEVELS.warn,
      'prefer-arrow-callback': [ ERROR_LEVELS.warn, { allowNamedFunctions: true } ],
      //#endregion Optimization

      //#region Mistakes
      'no-invalid-this': ERROR_LEVELS.error,
      'no-lone-blocks': ERROR_LEVELS.warn,
      'no-loop-func': ERROR_LEVELS.warn,
      'no-new': ERROR_LEVELS.warn,
      'no-self-compare': warnInDevErrorInProd,
      'no-unmodified-loop-condition': ERROR_LEVELS.warn,
      'no-unused-expressions': ERROR_LEVELS.warn,
      'no-duplicate-imports': [ warnInDevErrorInProd, { includeExports: true } ],
      'no-useless-rename': warnInDevErrorInProd,
      //#endregion Mistakes

      //#region Confusing code
      curly: [ warnInDevErrorInProd, 'all' ],
      'no-eq-null': ERROR_LEVELS.warn,
      'no-floating-decimal': ERROR_LEVELS.warn,
      'no-implicit-coercion': ERROR_LEVELS.warn,
      'no-sequences': ERROR_LEVELS.error,
      'no-confusing-arrow': ERROR_LEVELS.warn,
      'prefer-numeric-literals': warnInDevErrorInProd,
      //#endregion Confusing code

      //#region Deprecated & risky instructions
      'no-extend-native': ERROR_LEVELS.error,
      'no-new-func': ERROR_LEVELS.error,
      'no-implied-eval': ERROR_LEVELS.error,
      'no-eval': warnInDevErrorInProd,
      'no-iterator': ERROR_LEVELS.error,
      'no-labels': ERROR_LEVELS.error,
      'no-new-wrappers': ERROR_LEVELS.warn,
      'no-script-url': ERROR_LEVELS.error,
      'no-void': ERROR_LEVELS.error,
      'prefer-rest-params': ERROR_LEVELS.warn,
      //#endregion Deprecated & risky instructions

      //#region Redundant & useless instructions
      'no-extra-bind': ERROR_LEVELS.warn,
      'no-useless-call': ERROR_LEVELS.warn,
      'no-useless-catch': ERROR_LEVELS.warn,
      'no-useless-concat': ERROR_LEVELS.warn,
      'no-useless-return': ERROR_LEVELS.warn,
      strict: ERROR_LEVELS.warn,
      //#endregion Redundant & useless instructions

      //#region Classes
      'grouped-accessor-pairs': [ ERROR_LEVELS.warn, 'getBeforeSet' ],
      'class-methods-use-this': ERROR_LEVELS.warn,
      'no-constructor-return': ERROR_LEVELS.error,
      //#endregion Classes

      //#region Functions
      'no-caller': ERROR_LEVELS.error,
      'no-empty-function': [ ERROR_LEVELS.warn, { allow: [ 'arrowFunctions' ] } ],
      'consistent-return': warnInDevErrorInProd,
      'require-await': ERROR_LEVELS.warn,
      'no-return-assign': ERROR_LEVELS.warn,
      //#endregion Functions

      //#region Variable declaration & assignment
      'vars-on-top': ERROR_LEVELS.warn,
      'no-undef-init': warnInDevErrorInProd,
      'one-var': [ warnInDevErrorInProd, 'never' ],
      'operator-assignment': [ warnInDevErrorInProd, 'always' ],
      'no-var': ERROR_LEVELS.error,
      'no-implicit-globals': warnInDevErrorInProd,
      'no-multi-assign': warnInDevErrorInProd,
      'prefer-const': ERROR_LEVELS.warn,
      //#endregion Variable declaration & assignment

      //#region Variable & function naming
      camelcase: [
         ERROR_LEVELS.warn,
         {
            ignoreImports: true,
            allow: [
               // Pascal_SnakeCase (stuff from back-end)
               '^([A-Za-z\\d]*_?)+$',
            ],
         },
      ],
      //#endregion Variable & function naming

      //#endregion Best practices & declarations


      // ******************************************************************************************************
      // Stylistic issues
      // ******************************************************************************************************

      //#region Stylistic issues

      //#region Commas & semicolons
      'comma-dangle': [ warnInDevErrorInProd, 'always-multiline' ],
      'comma-spacing': [
         warnInDevErrorInProd,
         {
            before: false,
            after: true,
         },
      ],
      semi: [ warnInDevErrorInProd, 'never' ],
      'semi-spacing': warnInDevErrorInProd,
      //#endregion Commas & semicolons

      //#region Indentation & line format
      indent: [ warnInDevErrorInProd, indentWidth, { SwitchCase: 1 } ],
      'no-tabs': warnInDevErrorInProd,
      'max-len': ERROR_LEVELS.off,
      'no-trailing-spaces': warnInDevErrorInProd,
      'eol-last': [ warnInDevErrorInProd, 'never' ],
      'max-statements-per-line': [ ERROR_LEVELS.warn, { max: 1 } ],
      'no-multiple-empty-lines': [
         ERROR_LEVELS.warn,
         {
            max: 3,
            maxEOF: 0,
            maxBOF: 0,
         },
      ],
      // No need to enforce this because Git handles it for us.
      'linebreak-style': ERROR_LEVELS.off,
      'unicode-bom': [ warnInDevErrorInProd, 'never' ],
      //#endregion Indentation & line format

      //#region Inline whitespace
      'keyword-spacing': [
         warnInDevErrorInProd,
         {
            before: true,
            after: true,
         },
      ],
      'space-infix-ops': [ warnInDevErrorInProd, { int32Hint: false } ],
      'space-unary-ops': [
         warnInDevErrorInProd,
         {
            words: true,
            nonwords: false,
         },
      ],
      'no-multi-spaces': [ warnInDevErrorInProd, { ignoreEOLComments: true } ],
      //#endregion Inline whitespace

      //#region Comments
      'lines-around-comment': ERROR_LEVELS.off,
      // This is super annoying when commenting/uncommenting code, so no.
      'capitalized-comments': ERROR_LEVELS.off,
      'spaced-comment': [
         ERROR_LEVELS.warn,
         'always',
         {
            markers: [ '*', '#region', '#endregion' ],
            block: { balanced: true },
         },
      ],
      //#endregion Comments

      //#region Confusing code
      'no-mixed-operators': ERROR_LEVELS.error,
      'no-unexpected-multiline': ERROR_LEVELS.error,
      'new-parens': [ warnInDevErrorInProd, 'always' ],
      'newline-per-chained-call': [ warnInDevErrorInProd, { ignoreChainWithDepth: 2 } ],
      //#endregion Confusing code

      //#region Strings & quotes
      quotes: [
         warnInDevErrorInProd,
         'single',
         {
            avoidEscape: true,
            allowTemplateLiterals: true,
         },
      ],
      'template-curly-spacing': [ warnInDevErrorInProd, 'always' ],
      //#endregion Strings & quotes

      //#region Objects & arrays

      'computed-property-spacing': [ warnInDevErrorInProd, 'never' ],
      'no-useless-computed-key': warnInDevErrorInProd,

      //#region Object functionality
      'no-new-object': warnInDevErrorInProd,
      'dot-location': [ warnInDevErrorInProd, 'property' ],
      'dot-notation': warnInDevErrorInProd,
      //#endregion Object functionality

      //#region Object look & feel
      'object-curly-spacing': [ warnInDevErrorInProd, 'always' ],
      'object-curly-newline': [
         warnInDevErrorInProd,
         {
            multiline: true,
            minProperties: minItemsForLineBreak,
         },
      ],
      'object-property-newline': warnInDevErrorInProd,
      'key-spacing': [
         warnInDevErrorInProd,
         {
            beforeColon: false,
            afterColon: true,
            mode: 'strict',
         },
      ],
      'no-whitespace-before-property': warnInDevErrorInProd,
      'quote-props': [ ERROR_LEVELS.warn, 'as-needed' ],
      // 'consistent' causes issues with objects containing both properties: values and methods().
      'object-shorthand': [ warnInDevErrorInProd, 'methods' ],
      'rest-spread-spacing': [ warnInDevErrorInProd, 'never' ],
      //#endregion Object look & feel

      //#region Array functionality
      'no-array-constructor': warnInDevErrorInProd,
      'array-callback-return': warnInDevErrorInProd,
      //#endregion Array functionality

      //#region Array look & feel
      'array-bracket-newline': [
         warnInDevErrorInProd,
         {
            multiline: true,
            minItems: minItemsForLineBreak,
         },
      ],
      'array-element-newline': [
         warnInDevErrorInProd,
         {
            multiline: true,
            minItems: minItemsForLineBreak,
         },
      ],
      'array-bracket-spacing': [ warnInDevErrorInProd, 'always', { singleValue: true } ],
      //#endregion Array look & feel

      //#endregion Objects & arrays


      //#region Blocks & functions

      'no-empty': warnInDevErrorInProd,

      //#region Braces & parentheses
      'block-spacing': [ warnInDevErrorInProd, 'always' ],
      'padded-blocks': [ warnInDevErrorInProd, 'never' ],
      'brace-style': [ warnInDevErrorInProd, '1tbs', { allowSingleLine: false } ],
      'space-before-blocks': [ warnInDevErrorInProd, 'always' ],
      'space-in-parens': [ warnInDevErrorInProd, 'never' ],
      //#endregion Braces & parentheses

      //#region Functions
      'func-call-spacing': [ warnInDevErrorInProd, 'never' ],
      'function-call-argument-newline': [ warnInDevErrorInProd, 'consistent' ],
      'function-paren-newline': [ warnInDevErrorInProd, 'consistent' ],
      'max-params': [ ERROR_LEVELS.warn, { max: 3 } ],
      'space-before-function-paren': [
         warnInDevErrorInProd,
         {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
         },
      ],
      'template-tag-spacing': [ warnInDevErrorInProd, 'always' ],
      'generator-star-spacing': [
         warnInDevErrorInProd,
         {
            before: true,
            after: false,
         },
      ],
      'prefer-spread': ERROR_LEVELS.warn,
      //#endregion Functions

      //#region Anonymous & arrow functions
      'implicit-arrow-linebreak': [ warnInDevErrorInProd, 'beside' ],
      'wrap-iife': warnInDevErrorInProd,
      'arrow-body-style': [ ERROR_LEVELS.warn, 'as-needed' ],
      'arrow-parens': [ ERROR_LEVELS.warn, 'always' ],
      'arrow-spacing': [
         warnInDevErrorInProd,
         {
            before: true,
            after: true,
         },
      ],
      //#endregion Anonymous & arrow functions

      //#region Classes
      'lines-between-class-members': [ warnInDevErrorInProd, 'always', { exceptAfterSingleLine: true } ],
      'new-cap': ERROR_LEVELS.warn,
      'no-useless-constructor': warnInDevErrorInProd,
      //#endregion Classes

      //#region Loops
      'no-continue': ERROR_LEVELS.warn,
      //#endregion Loops

      //#region If, conditions & ternaries
      'multiline-ternary': [ warnInDevErrorInProd, 'always-multiline' ],
      'no-lonely-if': warnInDevErrorInProd,
      'no-unneeded-ternary': warnInDevErrorInProd,
      'operator-linebreak': [ warnInDevErrorInProd, 'before' ],
      yoda: [ warnInDevErrorInProd, 'never' ],
      //#endregion If, conditions & ternaries

      //#region Switch/case
      'default-case': [ ERROR_LEVELS.warn, { commentPattern: 'default' } ],
      'default-case-last': warnInDevErrorInProd,
      'no-fallthrough': [ ERROR_LEVELS.warn, { commentPattern: 'break' } ],
      'switch-colon-spacing': [
         warnInDevErrorInProd,
         {
            before: false,
            after: true,
         },
      ],
      //#endregion Switch/case

      //#endregion Blocks & functions

      //#endregion Stylistic issues


      // ******************************************************************************************************
      // Plugins
      // ******************************************************************************************************

      //#region plugin: newline-destructuring
      'newline-destructuring/newline': [ warnInDevErrorInProd, { items: minItemsForLineBreak - 1 } ],
      //#endregion plugin: newline-destructuring

      //#region plugin: import-newlines
      'import-newlines/enforce': [
         warnInDevErrorInProd,
         {
            items: minItemsForLineBreak - 1,
            semi: false,
         },
      ],
      //#endregion plugin: import-newlines


      //#region plugin: import

      // TODO: Implement more rules. Use .eslintrc.js from branch SDT/AB/Eslint/import for a first iteration of all rules set.

      //#region Import - Style guide

      'import/extensions': [ warnInDevErrorInProd, 'always', { ignorePackages: true } ],

      //#endregion Import - Style guide

      //#endregion plugin: import


      //#region plugin: vue

      //#region Vue - Global
      'vue/component-api-style': [ ERROR_LEVELS.warn, [ 'composition-vue2', 'options', 'script-setup' ] ],
      //#endregion Vue - Global

      //#region Vue - HTML
      'vue/html-indent': [ warnInDevErrorInProd, indentWidth ],
      'vue/html-self-closing': [ warnInDevErrorInProd, { html: { void: 'any' } } ],
      'vue/no-v-html': ERROR_LEVELS.off,
      'vue/html-closing-bracket-newline': [
         warnInDevErrorInProd,
         {
            singleline: 'never',
            multiline: 'always',
         },
      ],
      'vue/html-quotes': [ warnInDevErrorInProd, 'double', { avoidEscape: true } ],
      'vue/max-attributes-per-line': [
         warnInDevErrorInProd,
         {
            singleline: indentWidth,
            multiline: 1,
         },
      ],
      'vue/multiline-html-element-content-newline': warnInDevErrorInProd,
      'vue/mustache-interpolation-spacing': [ warnInDevErrorInProd, 'always' ],
      'vue/no-multi-spaces': [ warnInDevErrorInProd, { ignoreProperties: true } ],
      'vue/no-spaces-around-equal-signs-in-attribute': warnInDevErrorInProd,
      'vue/require-explicit-emits': warnInDevErrorInProd,
      'vue/require-prop-types': warnInDevErrorInProd,
      'vue/v-bind-style': [ warnInDevErrorInProd, 'shorthand' ],
      'vue/v-on-style': [ warnInDevErrorInProd, 'shorthand' ],
      'vue/attributes-order': warnInDevErrorInProd,
      'vue/html-button-has-type': ERROR_LEVELS.warn,
      'vue/order-in-components': warnInDevErrorInProd,
      'vue/component-tags-order': [ warnInDevErrorInProd, { order: [ 'script', 'template', 'style' ] } ],
      'vue/component-definition-name-casing': warnInDevErrorInProd,

      'vue/block-tag-newline': [
         warnInDevErrorInProd,
         {
            singleline: 'consistent',
            multiline: 'always',
         },
      ],
      'vue/component-name-in-template-casing': [ warnInDevErrorInProd, 'PascalCase' ],
      'vue/html-comment-content-newline': [
         warnInDevErrorInProd,
         {
            singleline: 'never',
            multiline: 'always',
         },
      ],
      'vue/html-comment-content-spacing': [ warnInDevErrorInProd, 'always' ],
      'vue/html-comment-indent': [ warnInDevErrorInProd, indentWidth ],
      'vue/no-bare-strings-in-template': [ ERROR_LEVELS.warn, { allowlist: [ 'Slot default HTML' ] } ],
      'vue/no-template-target-blank': warnInDevErrorInProd,
      'vue/no-static-inline-styles': ERROR_LEVELS.warn,
      'vue/v-for-delimiter-style': [ ERROR_LEVELS.warn, 'in' ],
      'vue/v-on-event-hyphenation': [ ERROR_LEVELS.warn, 'always', { autofix: false } ],
      'vue/v-on-function-call': [ ERROR_LEVELS.warn, 'never' ],
      'vue/no-useless-mustaches': warnInDevErrorInProd,
      'vue/no-child-content': [ warnInDevErrorInProd, { additionalDirectives: [ 't' ] } ],
      'vue/prefer-separate-static-class': ERROR_LEVELS.warn,
      'vue/no-v-text-v-html-on-component': ERROR_LEVELS.error,
      //#endregion Vue - HTML

      //#region Vue - JS
      'vue/match-component-file-name': [
         warnInDevErrorInProd,
         {
            extensions: [ 'vue' ],
            shouldMatchCase: true,
         },
      ],
      'vue/new-line-between-multi-line-property': [ ERROR_LEVELS.warn, { minLineOfMultilineProperty: minItemsForLineBreak } ],
      'vue/no-potential-component-option-typo': ERROR_LEVELS.warn,
      'vue/no-reserved-component-names': [
         ERROR_LEVELS.error,
         {
            disallowVueBuiltInComponents: true,
            disallowVue3BuiltInComponents: true,
         },
      ],
      // TODO: Make this warnInDevErrorInProd & fix the components where parents call child components' methods.
      'vue/no-unused-properties': [
         ERROR_LEVELS.warn,
         {
            groups: [
               'props',
               'data',
               'computed',
               'methods',
            ],
         },
      ],
      // Way too many false positives due to mixins and Vuex map methods. Maybe later.
      'vue/no-undef-properties': ERROR_LEVELS.off,
      'vue/no-unused-components': warnInDevErrorInProd,
      'vue/no-undef-components': [
         warnInDevErrorInProd,
         {
            // Remove these exceptions once we're rid of global components.
            ignorePatterns: globalComponentPatterns,
         },
      ],
      'vue/padding-line-between-blocks': [ ERROR_LEVELS.warn, 'always' ],
      'vue/require-name-property': warnInDevErrorInProd,
      'vue/no-expose-after-await': warnInDevErrorInProd,
      'vue/component-options-name-casing': [ warnInDevErrorInProd, 'PascalCase' ],
      //#endregion Vue - JS

      //#region Vue - Extension rules
      // Handled with a loop below.


      //#endregion Vue - Extension rules

      // Temporarily disabled rules.
      // TODO: Work to re-enable ASAP
      'vue/custom-event-name-casing': ERROR_LEVELS.off,
      'vue/no-mutating-props': ERROR_LEVELS.off,
      'vue/no-lone-template': ERROR_LEVELS.off,
      'vue/one-component-per-file': ERROR_LEVELS.off,
      //#endregion plugin: vue
   },
}


// ************************************************************************************************************
// Vue extension rules
//
// We want them to act identically to their normal counterparts, so let's copy them all.
// ************************************************************************************************************

const vueExtensionRules = [
   'array-bracket-newline',
   'array-bracket-spacing',
   'arrow-spacing',
   'block-spacing',
   'brace-style',
   'camelcase',
   'comma-dangle',
   'comma-spacing',
   'comma-style',
   'dot-location',
   'dot-notation',
   'eqeqeq',
   'func-call-spacing',
   'key-spacing',
   'keyword-spacing',
   'max-len',
   'no-constant-condition',
   'no-empty-pattern',
   'no-extra-parens',
   'no-irregular-whitespace',
   'no-restricted-syntax',
   'no-sparse-arrays',
   'no-useless-concat',
   'object-curly-newline',
   'object-curly-spacing',
   'object-property-newline',
   'object-shorthand',
   'operator-linebreak',
   'prefer-template',
   'quote-props',
   'space-in-parens',
   'space-infix-ops',
   'space-unary-ops',
   'template-curly-spacing',
]

for (const ruleName of vueExtensionRules) {
   const origRule = eslintSettings.rules[ruleName]

   if (typeof origRule != 'undefined') {
      eslintSettings.rules[`vue/${ ruleName }`] = origRule
   }
}

module.exports = eslintSettings