module.exports = {
    devServer: {
        port: 9090, //启动时的端口
        disableHostCheck: true,
        // proxy: {
        //     //名字可以自定义，这里我用的是api
        //     '/api': {
        //       target: 'http://localhost:8080',//需要跨域的目标url，设置你调用的接口域名和端口号 别忘了加http
        //       changeOrigin: true, //这里设置是否跨域
        //       ws: true,
        //       pathRewrite: {
        //         '^/api': '' //若请求的路径在目标url下但不在/api 下，则将其转换成空
        //       }
        //     }
        // }
    }
};
