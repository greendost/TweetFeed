module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-custom-properties": { preserve: false },
    "postcss-color-function": {},
    "postcss-preset-env": {
      browsers: "last 2 versions"
    }
    // "postcss-modules-values": {}
  }
};
