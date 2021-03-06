var path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "docs/js"),
        publicPath: "/js/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    devServer: {
        contentBase: "docs",
        watchContentBase: true
    },

    watch: false,

    node: {
        __dirname: true
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".js", ".json"]
    },

    module: {
        rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
            exclude: /node_modules/
          },

          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    }
};
