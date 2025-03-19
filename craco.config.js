module.exports = {
  babel: {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-nullish-coalescing-operator"],
    loaderOptions: {
      ignore: [/node_modules\/(?!@tanstack\/virtual-core)/], // Ensure it transpiles this package
    },
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
