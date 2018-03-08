require('babel-polyfill')
require('babel-register')({
    presets: ['react'],
    ignore: function (filename) {
        if (filename.indexOf('/app/') === -1 && filename.indexOf('/common/') === -1) {
            return true;
        }

        return false;
    },
    plugins: [
        "transform-es2015-modules-commonjs",
        "transform-object-rest-spread"
    ]
});

require('./server');
