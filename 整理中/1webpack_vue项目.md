# vue的webpack配置

## webpack.common.js

公共配置文件，下面两个文件会去继承。

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require("vue-loader");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');//自动删除

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    module: {
        noParse: /jquery/,//不去解析jquery中的依赖库
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,// 加快编译速度，不包含node_modules文件夹内容
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg|ico|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'url-loader', // 根据图片大小，把图片优化成base64
                        options: {
                            limit: 10000,
                            outputPath: "image"
                        }
                    },
                    {
                        loader: 'image-webpack-loader', // 先进行图片优化
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', //这里需要设置别名，index.js 和 main.js内才可以访问。
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),//清空插件
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,//删除空白符
                removeComments: true,//删除注释
                removeAttributeQuotes: true // 移除属性的引号
            }
        }),
        new VueLoaderPlugin(),//vue插件
    ],
    externals: { //剥离了那些不需要改动的依赖模块
        jquery: 'jQuery',
        // vue: 'Vue',
    },
}

```



## webpack.dev.js

开发环境下运行。

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//4版本后，可以使用MiniCssExtractPlugin
const webpack = require('webpack'); //开启热更新
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); //识别特定类别的webpack错误，并对它们进行清理、聚合和优先级排序，以提供更好的开发人员体验。
const meerge = require('webpack-merge')
const common = require('./webpack.common')

const devServerUrl = {
    host: 'localhost',
    port: '3301'
}

let devConfig = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss/,
                use: [
                    {
                        loader:'style-loader',//因为MiniCssExtractPlugin插件使用目前会导致HMR功能缺失。因此在平常的开发模式中，我们还是使用style-loader。
                        options: {
                            sourceMap: true //开始sourceMap
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true //开始sourceMap
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
        ]
    },
    devtool: 'inline-source-map', //js source-map
    devServer: {
        clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
        hot: true,  // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
        contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
        compress: true, // 一切服务都启用gzip 压缩
        host: devServerUrl.host, // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
        port: devServerUrl.port, // 端口
        open: true, // 是否打开浏览器
        overlay: {  // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
            warnings: true,
            errors: true
        },
        publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
        proxy: {  // 设置代理
            "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
                target: "http://192.168.0.102:8080",
                pathRewrite: {"^/api" : "/mockjsdata/5/api"}
            }
        },
        quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
        watchOptions: { // 监视文件相关的控制选项
            poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
            ignored: /node_modules/, // 忽略监控的文件夹，正则
            aggregateTimeout: 300 // 延迟防抖，默认值，当第一个文件更改，会在重新构建前增加延迟
        }
    },
    plugins: [
        new webpack.NamedModulesPlugin(),  // 更容易查看(patch)的依赖 热加载的
        new webpack.HotModuleReplacementPlugin(),  // 替换插件

        new FriendlyErrorsWebpackPlugin({ //识别特定类别的webpack错误，并对它们进行清理、聚合和优先级排序，以提供更好的开发人员体验。
            compilationSuccessInfo: {
                messages: [
                    `Your application is running here: http://${devServerUrl.host}:${devServerUrl.port}`
                ]
            },
            clearConsole: true
        }),
    ]
}

module.exports = meerge(common, devConfig);

```



## webpack.prod.js

生产环境下运行

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//4版本后，可以使用MiniCssExtractPlugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const meerge = require('webpack-merge')
const common = require('./webpack.common')

let prodConfig = {
    // mode: process.env.NODE_ENV || 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true, //开始sourceMap
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss', //唯一标志overrideBrowserList
                            sourceMap: true,
                            plugins: loader => [
                                require('autoprefixer')({overrideBrowserslist: ['> 0.15% in CN']}) //为css样式添加前缀
                            ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ //引入MiniCssExtractPlugin 替代style-loader，做css抽离。
            filename: '[name].[hash].css', // 设置最终输出的文件名
            chunkFilename: '[id].[hash].css'
        }),

    ],
    optimization: { //优化
        splitChunks: {
            //minSize > maxSize > maxInitialRequest/maxAsyncRequests
            // test:"",//选择特定模块
            chunks: "all",  //  还可以改为函数，返回boolean  initial async all
            minSize: 20000,
            maxSize: 200000,//小于这个标准不做抽离合并进其他js内
            minChunks: 1, //分割前模块被引用次数，不需要多次引用也可以被分割
            maxInitialRequests: 3, //一个入口的最大并行请求数量
            maxAsyncRequests: 5, //按需加载最大并行请求数量
            automaticNameDelimiter: '~',
            cacheGroups: {
                commons: {
                    name: 'commons',    //提取出来的文件命名
                    chunks: 'initial',  //initial表示提取入口文件的公共部分
                    minChunks: 2,       //表示提取公共部分最少的文件数
                    minSize: 0          //表示提取公共部分最小的大小
                },
                vue: {
                    test: /vue/,
                    filename: "[name].js",
                    chunks: "all", //
                    reuseExistingChunk: true, //缓存服用
                    priority: 0 //等级
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),//用于压缩和优化CSS 的处理器，默认是 cssnano.
                cssProcessorOptions: {safe: true, discardComments: {removeAll: true}},//discardComments 去除注释
                canPrint: true//表示插件能够在console中打印信息，默认值是true
            }),//css压缩

        ],
    }
}
module.exports = meerge(common, prodConfig);

```



## package.json

```json
{
  "name": "css_webpack",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "npx webpack-dev-server --config ./config/webpack.dev.js",
    "build": "npx webpack --config ./config/webpack.prod.js",
    "analyz": "cross-env NODE_ENV=production npm_config_report=true npx webpack --config ./test/webpack.analyzer.js"
  },
  "author": "wuzhan",
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/plugin-transform-runtime": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "autoprefixer": "^9.6.1",
    "babel-loader": "^8.0.0-beta.0",
    "clean-webpack-plugin": "^3.0.0",
    "cross-env": "^5.2.0",
    "css-loader": "^3.1.0",
    "cssnano": "^4.1.10",
    "file-loader": "^4.1.0",
    "friendly-errors-webpack-plugin": "^1.7.0",

    "html-webpack-plugin": "^3.2.0",
    "image-webpack-loader": "^5.0.0",
    "less": "^3.9.0",
    "less-loader": "^5.0.0",
    "mini-css-extract-plugin": "^0.8.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "postcss-loader": "^3.0.0",
    "style-loader": "^0.23.1",
    "url-loader": "^2.1.0",
    "vue-loader": "^15.7.1",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.36.1",
    "webpack-bundle-analyzer": "^3.3.2",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2",
    "webpack-merge": "^4.2.1"
  },
  "license": "ISC",
  "dependencies": {
    "@babel/runtime": "^7.5.5",
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  }
}

```

