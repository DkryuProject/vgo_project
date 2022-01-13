const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/v1',
        createProxyMiddleware({
            target: 'http://52.78.175.70:8080/',
            changeOrigin: true,
        })
    );
};
