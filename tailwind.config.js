import colors from 'tailwindcss/colors'

/** @type {import("tailwindcss").Config} */
export default {
  content: ['./resources/**/*.{edge,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
    colors: {
      background: '#FBFBFB',
      slate: '#1A22231A',
      competition: '#F75D5D',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      slate: colors.slate,
      red: colors.red,
    },
  },
  plugins: [],
}
