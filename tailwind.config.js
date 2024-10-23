/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.vue', './src/components/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
  // to not overlap with vuetify's css classes
  // installing vuetify-vscode and tailwind css extension helps a lot
  prefix: 'tw-',
}

// config reference
// https://tailwindcss.com/docs/configuration#content
