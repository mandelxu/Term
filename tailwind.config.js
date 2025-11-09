/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 扫描所有 React 组件
    "./public/index.html",      // 扫描 HTML 模板
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}