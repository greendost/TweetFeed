const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: {
    app: ["./src/client/index"],
    login: ["./src/client/login"]
  },
  mode: "production"
});
