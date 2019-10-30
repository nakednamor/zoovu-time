const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: {
    background: "./src/app/background.ts",
    popup: "./src/app/popup/popup.tsx",
    apply: "./src/app/popup/apply.ts",
    options: "./src/app/options/options.tsx"
  },

  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "[name].js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  }
};
