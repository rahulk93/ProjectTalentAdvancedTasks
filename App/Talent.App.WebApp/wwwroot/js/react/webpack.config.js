
module.exports = {
    context: __dirname,
    entry: {
        homePage: './ReactScripts/Home.js'
    },
    output:
    {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    watch: true,
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env', 'babel-preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,  // Exclude CSS files with .module.css extension
                loaders: [
                    'style-loader',
                    'css-loader?modules'
                ]
            },
            {
                test: /\.module\.css$/,  // Target CSS files with .module.css extension
                use: [
                    'style-loader',  // Inject styles into DOM
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,  // Enable CSS Modules
                            sourceMap: true,
                        },
                    },
                ],
            }
        ]
    }
}