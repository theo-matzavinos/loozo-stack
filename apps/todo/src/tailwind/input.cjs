const plugin = require('tailwindcss/plugin');

const formControls = plugin(({ addBase, theme }) => {
  addBase({
    [`
      [type='text'],
      [type='email'],
      [type='url'],
      [type='password'],
      [type='number'],
      [type='date'],
      [type='datetime-local'],
      [type='month'],
      [type='search'],
      [type='tel'],
      [type='time'],
      [type='week'],
      [multiple],
      textarea,
      select
    `]: {
      appearance: 'none',
      '-moz-appearance': 'textfield',
      'background-color': '#fff',
      'border-color': theme('colors.gray.300'),
      'border-width': theme('borderWidth.DEFAULT'),
      'border-radius': theme('borderRadius.md'),
      'padding-top': theme('spacing.1'),
      'padding-right': theme('spacing.4'),
      'padding-bottom': theme('spacing.1'),
      'padding-left': theme('spacing.4'),
      'font-size': theme('fontSize.base.0'),
      'line-height': theme('fontSize.base.1'),
      '&:focus, &:focus-visible': {
        outline: theme('outlineWidth.0'),
        'outline-offset': theme('outlineOffset.0'),
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': '0px',
        '--tw-ring-offset-color': '#fff',
        '--tw-ring-color': theme('colors.slate.600'),
        '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
        '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
        'box-shadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)`,
        'border-color': theme('colors.slate.600'),
      },
    },
    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    [`
      [type='text'],
      [type='email'],
      [type='url'],
      [type='password'],
      [type='number'],
      [type='date'],
      [type='datetime-local'],
      [type='month'],
      [type='search'],
      [type='tel'],
      [type='time'],
      [type='week'],
      [multiple],
      select
    `]: {
      'border-radius': theme('borderRadius.md'),
    },

    textarea: {
      'border-radius': theme('borderRadius.md'),
    },

    'input::placeholder, textarea::placeholder': {
      color: theme('colors.gray.500'),
      opacity: '1',
    },

    '::-webkit-datetime-edit-fields-wrapper': {
      padding: '0',
    },

    // Unfortunate hack until https://bugs.webkit.org/show_bug.cgi?id=198959 is fixed.
    // This sucks because users can't change line-height with a utility on date inputs now.
    // Reference: https://github.com/twbs/bootstrap/pull/31993
    '::-webkit-date-and-time-value': {
      'min-height': '1.5em',
    },

    select: {
      'background-image': `url("/assets/shared/icon/caret-down.svg")`,
      'background-position': `right ${theme('spacing.3')} center`,
      'background-repeat': `no-repeat`,
      'background-size': `${theme('spacing.3')} ${theme('spacing.3')}`,
      'padding-right': theme('spacing.10'),
      'color-adjust': `exact`,
    },

    '[multiple]': {
      'background-image': 'initial',
      'background-position': 'initial',
      'background-repeat': 'unset',
      'background-size': 'initial',
      'padding-right': theme('spacing.3'),
      'color-adjust': 'unset',
    },

    [`
      [type='checkbox'],
      [type='radio']
    `]: {
      appearance: 'none',
      padding: '0',
      'color-adjust': 'exact',
      display: 'inline-block',
      'vertical-align': 'middle',
      'background-origin': 'border-box',
      'user-select': 'none',
      'flex-shrink': '0',
      height: theme('spacing.4'),
      width: theme('spacing.4'),
      color: theme('colors.slate.500'),
      'background-color': '#fff',
      'border-color': theme('colors.gray.300'),
      'border-width': theme('borderWidth.DEFAULT'),
    },

    [`[type='checkbox']`]: {
      'border-radius': theme('borderRadius.DEFAULT'),
    },

    [`[type='radio']`]: {
      'border-radius': '100%',
    },

    [`
      [type='checkbox']:focus,
      [type='radio']:focus
    `]: {
      outline: theme('outline.none.0'),
      'outline-offset': theme('outline.none.1'),
      '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-ring-offset-width': '1px',
      '--tw-ring-offset-color': '#fff',
      '--tw-ring-color': theme('colors.slate.600'),
      '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
      '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      'box-shadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)`,
      'border-color': theme('colors.slate.600'),
    },

    [`
      [type='checkbox']:checked,
      [type='radio']:checked
    `]: {
      'border-color': `transparent`,
      'background-color': `currentColor`,
      'background-position': `center`,
      'background-repeat': `no-repeat`,
    },

    [`[type='checkbox']:checked`]: {
      'background-size': `0.75rem 0.75rem`,
      'background-image': `url("/assets/shared/icon/check.svg")`,
    },

    [`[type='radio']:checked`]: {
      'background-size': `100% 100%`,
      'background-image': `url("/assets/shared/icon/bullet.svg")`,
    },

    [`
      [type='checkbox']:checked:hover,
      [type='checkbox']:checked:focus,
      [type='radio']:checked:hover,
      [type='radio']:checked:focus
    `]: {
      color: theme('colors.slate.600'),
      'border-color': 'transparent',
    },

    [`[type='checkbox']:indeterminate`]: {
      'background-image': `url("/assets/shared/icon/minus.svg")`,
      'border-color': `transparent`,
      'background-color': `currentColor`,
      'background-size': `100% 100%`,
      'background-position': `center`,
      'background-repeat': `no-repeat`,
    },

    [`
      [type='checkbox']:indeterminate:hover,
      [type='checkbox']:indeterminate:focus
    `]: {
      color: theme('colors.slate.600'),
      'border-color': 'transparent',
    },

    [`[type='file']`]: {
      background: 'unset',
      'border-color': 'inherit',
      'border-width': '0',
      'border-radius': '0',
      padding: '0',
      'font-size': 'unset',
      'line-height': 'inherit',
    },

    [`[type='file']:focus`]: {
      outline: `1px solid ButtonText`,
      outline: `1px auto -webkit-focus-ring-color`,
    },

    'input[readonly]': {
      backgroundColor: theme('colors.gray.100'),
    },
  });
});

module.exports = formControls;
