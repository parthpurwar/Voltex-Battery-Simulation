// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {}, // ✅ this should be 'tailwindcss', NOT '@tailwindcss/postcss'
    autoprefixer: {},
  },
};
