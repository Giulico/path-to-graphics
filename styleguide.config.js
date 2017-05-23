module.exports = {
    webpackConfig: require('./webpack/webpack.config.js'),
    // components: 'src/assets/js/{components,containers}/**/*.js',
    sections: [
        {
            content: './docs/introduction.md'
        },
        {
            name: 'Documentation',
            content: './docs/scaffolding.md',
            sections: [
                {
                    name: 'Page Containers',
                    components: './src/assets/js/containers/**/*.js'
                },
                {
                    name: 'Components',
                    components: './src/assets/js/components/**/*.js'
                }
            ]
        }
    ]
};
