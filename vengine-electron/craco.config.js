const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const AntdTheme = require("./src/styles/AntDesign/customTheme1");
const path = require('path');

console.log(process.env.NODE_ENV);
console.log(process.env.REACT_APP_MODE);

// Don't open the browser during development 한글로 적어주께.. 라이브시에는 주석 풀어라..
process.env.BROWSER = 'none';

module.exports = {
    webpack: {
        plugins: [
            new WebpackBar({ profile: true }),
            ...(process.env.NODE_ENV === 'development'
                ? [
                      new BundleAnalyzerPlugin({
                          //   analyzerMode: 'static', // 분석결과를 파일로 저장
                          //   reportFilename: 'docs/size_dev.html', // 분설결과 파일을 저장할 경로와 파일명 지정
                          //   defaultSizes: 'parsed',
                          //   openAnalyzer: false, // 웹팩 빌드 후 보고서파일을 자동으로 열지 여부
                          //   generateStatsFile: true, // 웹팩 stats.json 파일 자동생성
                          //   statsFilename: 'docs/stats_dev.json', // stats.json 파일명 rename
                      }),
                  ]
                : []),
        ],
    },
    // plugins: [
    //     {
    //         plugin: CracoAntDesignPlugin,
    //         options: {
    //             customizeTheme: AntdTheme,
    //             javascriptEnabled: true,
    //         },
    //     },
    // ],
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath:
                    './src/styles/AntDesign/customTheme.less',
            },
        },
    ],
    // optimization: {
    //     minimizer: [new UglifyJsPlugin()],
    // },
};
