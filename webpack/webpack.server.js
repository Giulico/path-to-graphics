const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const address = require('ip').address();

const config = require('./webpack.config');
const paths = require('./paths');

const port = 10100;

// const publicPath = `http://${address}:${port}${paths.publicPath}`;

config.entry.app.unshift(
    // Necessary for hot reloading with IE
    'eventsource-polyfill',
    // activate HMR for React
    'react-hot-loader/patch',
    // bundle the client for webpack-dev-server and connect to the provided endpoint
    `webpack-dev-server/client?http://${address}:${port}`,
    // bundle the client for hot reloading only - means to only hot reload for successful updates
    'webpack/hot/only-dev-server'
);

config.plugins.unshift(
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
);

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    public: address,
    clientLogLevel: 'error',
    compress: false,
    inline: true,
    hot: true,
    stats: {
        colors: true
    },
    headers: {
        'Access-Control-Allow-Origin': `http://${address}:${port}`,
        'Access-Control-Allow-Headers': 'X-Requested-With'
    }
});
server.listen(port, err => {
    if (err) {
        console.log(err); //eslint-disable-line no-console
    }
    console.log('\nStarted a server at http://%s:%s\n', address, port); //eslint-disable-line no-console
});
