

# webpack应用

## 概念

Entry：入口，Webpack执行构建的第一步将从Entry开始，可抽象成输入。

Module：模块，在Webpack里以切皆是模块，一个模块对应着一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块。

Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并和分割。

Loader：代码转换器，用于把模块原有内容按照需求转换成新内容。

Plugin：扩展插件，在Webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

Output：输出结果，在Webpack经过一些列处理并得到最终想要的代码后输出结果。



> hash需要用到三类：
>
> hash 每次编译hash汇编（只要有一个变化）
>
> chunkHash 代码块变化hash会变（只要chunk内文件变化，该hash就会变化）
>
> contentHash 文件内容变化hash会变。
>
> 注，chunkHash /contentHash 不能用在output的filename上，因为output产出的是多个chunk，只能用hash。

## Mode

webpack 4后加入mode预设

development生产环境，

production开发环境（默认），

none

> 如果未设置，则webpack设置`production`为的默认值`mode`。

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%9811.jpg)

**common**

```js
// parent chink中解决了的chunk会背删除
optimization.removeAvailableModules:true;
// 删除空的chunks
optimization.removeEmptyChunks:true;
// 合并重复的chunk
optimization.mergeDuplicateChunks:true;
```

**development**

```js
// 调试
devtool:eval
// 缓存模块，避免在未重改时重建他们。
cache:true
// 缓存已解决的依赖项，避免重新解析他们。
module.unsafeCache:true
// 在bundle中引入【所包含模块信息】的相关注释。
output.pathinfo：true
// 在可能的情况下确定每个模块的导出，背用于其他优化或者代码生成。
optimization.providedExports:true
// 找到chunk中共享的模块，取出来生成单独的chunk
optimization.splitChunks:true
// 为webpack运行时代码创建单独的chunk
optimization.runtimeChunk:true
// 编辑错误时不写入到输出
optimization.noEmitOnErrors:true
// 给模块由意义的名称代替ids
optimization.namedModules:true
// 给chunk有意义的名称代替ids
optimization.namedChunks:true
```

**production**

```js
// 性能相关配置
performance:{hints:"error"...}
// 某些chunk的子chunk以一种方式被确定和标记，这些子chunks在加载更大的块时不必加载
optimization.flagIncludedChunks:true
// 给经常使用的ids更短的值
optimization.occurrenceOrder:true
// 确定每个模块下被使用的导出
optimization.usedExports:true
// 试别package.json or rules sideEffects 标志
optimization.sideEffects:true
// 尝试查找模块图中可以安全连接到单个模块中的段。
optimization.concatenateModules：true
// 使用uglify-js压缩代码
optimization.minimize：true
```



## loader简介

### 配置

模块(module)

这些选项决定了如何处理项目中的[不同类型的模块](https://www.webpackjs.com/concepts/modules)。



#### 条件(condition)

condition有两种属性可以选择：

1. resource：请求文件的绝对路径。匹配的文件就是最终匹配的文件。
2. issuer: 被请求资源(requested the resource)的模块文件的绝对路径。匹配的文件所有引用的子文件才是最终匹配文件。

在规则中，可选属性 [`test`](https://www.webpackjs.com/configuration/module/#rule-test), [`include`](https://www.webpackjs.com/configuration/module/#rule-include), [`exclude`](https://www.webpackjs.com/configuration/module/#rule-exclude) 和 [`resource`](https://www.webpackjs.com/configuration/module/#rule-resource)

其中Rule.test，Rule.include，Rule.exclude都是Rule.resource.test，Rule.resource.include，Rule.resource.exclude的简写。

**条件（匹配）**

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件

> Condition可以是这些之一：
> - 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
> - 正则表达式：test 输入值。
> - 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
> - 条件数组：至少一个匹配条件。
> - 对象：匹配所有属性。每个属性都有一个定义行为。

例如

```js
resource: {
    test:/\.(jpg|png|gif|jpeg|svg)$/,
    or:[/\.(jpg|png|gif|jpeg|svg)$/],
    // 等等
},
issuer: {
    test:/\.(jpg|png|gif|jpeg|svg)$/,
    or:[/\.(jpg|png|gif|jpeg|svg)$/],
},
use: [
    {
        loader: 'url-loader',
        options: {
            limit: 1024 * 10,
        }
    }
], // 内置了file-loader
```

**resourceQuery**

用于匹配导入条件。

匹配import Foo from './foo.css?inline'。

```js
{
  test: /.css$/,
  resourceQuery: /inline/,
  use: 'url-loader'
}
```



#### Rule 结果(results)

规则结果只在规则条件匹配时使用。

规则有两种输入值：

1. 应用的 loader：应用在 resource 上的 loader 数组。
2. Parser 选项：用于为模块创建解析器的选项对象。

这些属性会影响 loader：[`loader`](https://www.webpackjs.com/configuration/module/#rule-loader), [`options`](https://www.webpackjs.com/configuration/module/#rule-options-rule-query), [`use`](https://www.webpackjs.com/configuration/module/#rule-use)。

也兼容这些属性：[`query`](https://www.webpackjs.com/configuration/module/#rule-options-rule-query), [`loaders`](https://www.webpackjs.com/configuration/module/#rule-loaders)。

[`enforce`](https://www.webpackjs.com/configuration/module/#rule-enforce) 属性会影响 loader 种类。不论是普通的，前置的，后置的 loader。

[`parser`](https://www.webpackjs.com/configuration/module/#rule-parser) 属性会影响 parser 选项。

**使用use和不使用use**

```js
// 使用use
{
    test: /\.(jpg|png|gif|jpeg|svg)$/,
    use: [
        {
            loader: 'url-loader', // 内置了file-loader
            options:{
                limit: 10*1024,
            }
        }
    ]
}
// 不使用
{
    test: /\.(jpg|png|gif|jpeg|svg)$/,
    loader: 'url-loader', // 内置了file-loader
    options:{
        limit: 10*1024,
    }
}
```

> Rule.options 和 Rule.query 是 Rule.use: [ { options } ] 的简写

### 简单实现

**以css-loader和style-loader为例**

```js
const path = require('path');
module.exports = {
    mode: 'development',// webpack 4 // 开发环境下和生产环境下的位置
    entry:'./src/index.js',
    output:{
        path: path.join(__dirname,'dist'),// 输出的目录，只能是绝对目录
        filename:'bundle.js'
    },
    devServer:{
        contentBase:path.join(__dirname,'dist'),
        compress: true, // 压缩
        port: 9000
    },
    module:{
        rules:[
            {
                test:/\.css$/, // 如果要require或import的文件时css的文件的话
                // 从右向左
                // 可以写loader也可以写use，use也可以传入数组，字符串。
                use:['style-loader','css-loader']
                
            }
        ]
    }
}
```

**loader实现两个函数**

```js
function css-loader(content){ // css
return dontent
}
function style-loader(content){ // style
let style = document.createElement('style');
style.innerHTML=content;
document.head.appendChild(style);
}
```

> style-loader创建标签让css在html注入到style标签里边。

webpack处理后的结果：

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%98.jpg)

在浏览器中生成style标签

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%982.jpg)

## 入口出口

entry出口，output入口。

**单入口**

```
    entry:'./src/index.js',
    output:{
        path: path.join(__dirname,'dist'),// 输出的目录，只能是绝对目录
        filename:'[name].[hash].js'
    },
```

> 单入口，filename的name默认为main。打包生成main.js 。

**多入口设置**

```js
    entry:{
        // 输入成两个文件
        index:'./src/index.js',
        login:'./src/login.js'
    },
    output:{
        path: path.join(__dirname,'dist'),// 输出的目录，只能是绝对目录
        filename:'[name].[hash].js'
    },
```

> filename中的name是根据entry中的key值生成，其中的hash每次编译后（文件有修改的编译）生成一次新的。
>
> filename：可以选用三种hash中的一种，一般使用contenthash

**设置图片css文件分目录存储**



## devServer

安装

```js
npm install webpack-dev-server --save-dev
```

> 启动server产出的文件在内存里，为了生成文件更加快速。

```js
    devServer:{
        // 启动server产出的文件在内存里，为了生成文件
       contentBase:path.join(__dirname,'dist'),
        compress: true, // 压缩
        port: 9000
    },
```

## 插件

### html-webpack-plugin

选择一个html模板，添加对应的script标签等代码。

```js
entry: {
    index: './src/index.js',
    commin: './src/commin.js',
},
output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
},
plugins: [
    // 这个插件产出html文件。
    new HtmlWebpackPlugin({
        template: './src/index.html', // 指定模板文件。
        filename: 'index.html',
        hash: true,
        chunks: ['commin','index'], // 引入的文件，添加chunksSortMode: 'manual'后，加载顺序会变为手动，从左到右。
        chunksSortMode: 'manual' // 'none' | 'auto' | 'manual' | {Function}
    }),
]
```

> hash: true => `<script src="bundle.57c512135e8eb2f8ade9.js?57c512135e8eb2f8ade9"></script></body>`
>
> 使得js文件引入时后边加上？hash。

> chunks 用于添加引入的文件。chunksSortMode 用于选择排序方案。

**案例**

两个js文件分别是

```
// commin
function getName(name){
    console.log(name)
}
// index
console.log(getName('wuzhan'));
```

> index如果引用getName必须在commin后边加载，使用chunks和chunksSortMode可以实现顺序的加载。

### clean-webpack-plugin

使用clean-webpack-plugin清除dist内的文件。

默认webpack的output.path目录中的所有文件将被删除一次，但是目录本身不会。

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 引入
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['bist'] // 清除目录内容，可以不穿，默认dist目录
        }),
    ]
```

### 分离css

> 分离css单独打包，浏览器下载文件时可以并行下载。

安装插件

```js
yarn add mini-css-extract-plugin -D
```

```js
plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css', // name代码块chunk的名字
            // filename: 'css/[name].[hash].[chunkhash].[contenthash].css', // 通过修改路径，拆分文件到对应文件夹
            chunkFilename: '[id].css',// 异步加载
        })
    ]

 module: {
        rules: [
            {
                test: /\.css$/, 
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
       ]
 }
```

> 修改loader原先的style-loader改为MiniCssExtractPlugin.loader

> 使用filename设置路径，拆分css文件到对应文件夹

### 压缩css和js

> 注：其实开启production时会默认压缩js和css 。

安装

```js
cnpm i uglifyjs-webpack-plugin terser-webpack-plugin optimize-css-assets-webpack-plugin -D
```

**ugifyjs-webpack-plugin**

已经不在使用

压缩js，但是又缺点：不能压缩es6。后用terser-webpack-plugin代替。

**terser-webpack-plugin**

```js
    optimization: { // 放优化的内容
        minimizer: [ // 表示放优化的插件
            new TerserWebpackPlugin({
                parallel: true, // 开启多个进程压缩。
                cache:true // 开启缓存
            })
        ]
    },
```

> 需要设置mode: 'production'

压缩后的代码。

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%9823.png)

**optimize-css-assets-webpack-plugin**

```js
// 还需要装cssnano
cnpm i cssnano -D
```

```js
    optimization: { // 放优化的内容
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin({ // 压缩css
                assetNameRegExp: /\.css$/g, // 指定要要锁的模块的正则
                // cssnano是PostCSS的css优化和分解插件。cssnano采用格式很好的css，
                cssProcessor: require('cssnano')
            })
        ]
    },
```

### **拷贝插件**

```js
cnpm i copy-webpack-plugin -D
```

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
// copy插件
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets'), // 静态资源目录源地址
            to: path.resolve(__dirname, 'dist/assets'), // 目标地址，相对于output的path目录
          },
        ],
      },
```

### 打包第三方库

#### **直接引入**

> 会将所有的lodash引入，不能按需引入

```js
import _ from 'lodash';

console.log(_.join(['a', 'b', 'c'], '@'))
```

#### **插件注入**

使用ProvidePlugin，此插件会自动向所有的模块注入一个_变量，引用lodash模块（非全局变量，所以导入依赖全局变量的插件依旧会失败）

> 可以按需引入

```js
    new webpack.ProvidePlugin({
      _: 'lodash',
      useState: ['react', 'useState'],
      React: 'react',
      ReactDOM: 'react-dom', 
    }),
```

#### **全局引入**

使用expose-loader

可以在js文件内引入（比如codejs3中isArray方法就用到了''$''）

```js
let $ = require(' expose-loader?$!jquery');
console.log($)
```

> 这里的！用于分割模块，使用？给expose-loader赋值（$!jquery）。

或者使用webpack。

```js
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: '$',
            override: true,
          },
        },
      },
    ],
  },
```

index.js

```js
import $ from 'jquery';
```



#### **externals**

如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals

```html
// 手动引入cdn
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
```

```js
// 使用externals
externals: {
  jquery: 'jQuery',
},

  
// 无需下载Jquery
import jQuery from 'jquery';

console.log(jQuery);
```

> externals 实际执行了 module.exports = jQuery

#### **HtmlWebpackExternalsPlugin**

外链入第三方文件。

```js
$ cnpm i html-webpack-externals-plugin -D
```

案例

```
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcss.com/react/15.6.1/react.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcss.com/react/15.6.1/react-dom.js',
          global: 'ReactDOM',
        },
        {
          module: 'jquery',
          entry: 'https://cdn.bootcss.com/jquery/3.4.1/jquery.js',
          global: 'jQuery',
        },
      ],
    }),

```

### 添加全局常量

添加全局常量，使用DefinePlugin

```js
plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: 1,
    }),
]
```

### 忽略某个模块下的文件

使用moment时忽略语言包

```js
// 忽略模块下的文件
new webpack.IgnorePlugin(/^\.\/locale/, /^moment$/),
// 第一个参数忽略模块下文件的路径
// 第二个参数忽略的模块
```

> 需要手动引入所需要的语言包
> import 'moment/locale/zh-cn';

## noParse

参考：https://zhuanlan.zhihu.com/p/55682789

noParse对于require等导入是有影响的，一旦设置了noParse，将不再导入资源。

当读入文件时不在解析导入文件。



> 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。
>
> `module.noParse`
>
> `RegExp | [RegExp]`
>
> `RegExp | [RegExp] | function`（从 webpack 3.0.0 开始）
>
> 忽略一些大型的library可以提高构建性能。

```js
noParse: /jquery|lodash/

// 从 webpack 3.0.0 开始
noParse: function(content) {
  return /jquery|lodash/.test(content);
}
```

**注：noParse对于loader、plugin这些没有影响！！！**



## loader

### 引入图片

安装

```js
yarn add file-loader url-loader -D
```

**使用file-loader**

```js
    module: {
        rules: [
            {
                test: /\.(jpg|png|gif|jpeg|svg)$/,
                use: 'file-loaderd',
            }
        ]
    },
```

**案例**

图片名字会被重新编码，img.src引入该图片。

```js
let logo = require('./img/bg1.jpg');
let img = new Image();
img.src = logo.default; // 路径
console.log(logo);
document.body.appendChild(img);
```

> 生成的文件会有`__webpack_exports__[\"default\"] = (__webpack_require__.p + \"cec2938623a40c0725c4e7f8c6faab2b.jpg\");`这里的`__webpack_require__.p`可以在output.publicPath上设置。

**使用url-loader**

内置了file-loader，并且可以转文件为base64编码。

```js
    module: {
        rules: [
            {
                test: /\.(jpg|png|gif|jpeg|svg)$/,
                use: 'url-loader', // 内置了file-loader
                options: {
                    limit: 10 * 1024,
                    // name:'[name].jpg', // 设置名字
                    outputPath: 'img',//放到img文件夹下边
                    publicPath:'./img',// 重写output下publicPath，程序引用时可以引用到这个路径
                }
            }
        ]
    },
```

> 通过 outoutPath 指定放到那个文件夹下。
>
> 通过 publicPath 重写output下publicPath，程序引用时可以引用到这个路径。
>
> 实现图片拆分到不同文件夹。

### html内引入图片

安装

```js
cnpm i html-withimg-loader -D
```

解析html内引入img标签的loader。

```js
module: {
    rules: [
        {
            test: /\.(html|htm)$/,
            loader: 'html-withimg-loader',
        }
    ]
},
```

> 如果有图片路径错误问题，例如`<img src={"default":"c853dae0f18c964fe3f105cea94f9d34.jpg"} alt="12" />`
>
> 可以设置url-loader配置为esModule: false（启用CommonJS模块）

### 压缩优化图片

安装

```js
cnpm i image-webpack-loader --save-dev	
```

配置

```js
rules: [{
  test: /\.(gif|png|jpe?g|svg|bmp)$/i,
  use: [
    'file-loader',
    { // 压缩图片
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65,
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4,
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75,
        },
      },
    },
  ],
}],
```



### 使用less和sass

```js
cnpm i less less-loader node-sass sass-loader -D	
```

添加webpack配置

```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
            test: /\.less$/, 
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
        },
    ]
},
```

### 处理字体文件

使用url-loader实现。

```js
      {
        test: /\.(ttf|svg|eot|woff|woff2|otf)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
          },
        },
      },
```

案例

```css
@font-face {
  // 引入文字文件
  src: url(./HabanoST.otf) format('truetype');
  font-family: 'HabanoST';
}

.welcome {
  font-size: 100px;
  font-family: 'HabanoST'; // 使用这个文字文件
}

```



### 处理css3前缀

- Trident内核：主要代表为IE浏览器, 前缀为-ms
- Gecko内核：主要代表为Firefox, 前缀为-moz
- Presto内核：主要代表为Opera, 前缀为-o
- Webkit内核：产要代表为Chrome和Safari, 前缀为-webkit

```js
cnpm i postcss-loader autoprefixer -D
```

把postcss添加到cssLoader内

```js
{
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader','postcss']
},
```



添加postcss配置文件

**使用autoprefixer插件**

```js
// postcss.config.js
module.exports = {
    plugins:[require('autoprefixer')]
}
```

对于autoprefixer插件可以添加配置文件，兼容浏览器版本

```js
// .browserslistrc
last 1 version
> 1%
IE 6 # sorry
```

### 安装babel

```js
cnpm i babel-loader @babel/core @babel/preset-env  @babel/preset-react  -D
```

#### **babel安装**

babel-loader（bable的loader针对webpack） 

@babel/core（核心文件）

@babel/preset-env（预设|ES6、ES7转成ES5） 

 @babel/preset-react（react转义|JSX转成ES5）

> 这里@babel就是一个类库，@什么东西，对应什么库。

> `@babel/preset-env` 中的 useBuiltIns 选项，如果你设置了 usage，babel 编绎的时候就**不用整个 polyfills** , **只加载你使用 polyfills**，这样就可以减少包的大小。

#### **针对使用装饰器安装两个插件**

```js
cnpm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

@babel/plugin-proposal-decorators （用于装饰器）

@babel/plugin-proposal-class-properties （用于class内变量赋值）

> loose为true的时候,属性是直接赋值,loose为false的时候会使用Object.defineProperty。

```js
// babel.config.js下
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", {legacy: true}], //
    ["@babel/plugin-proposal-class-properties", {loose: true}], //
  ]
}
```

**案例**

> ```js
> class Person {    
> static a = 1    
> b = 1    
> @readonly PI = 3.14
> }
> ```

使用装饰器的案例

```js
import React from 'react';
import ReactDOM from 'react-dom';

function readonly(target, key, discriptor) {
    console.log(key, target, discriptor) // 键，上下文环境  // discriptor装饰器属性。
    // discriptor装饰器属性内属性
    // configurable: true
    // enumerable: true
    // initializer: ƒ initializer()
    // readonly: true
    // writable: true
    discriptor.writable = false; // 不可写入
}


class Person {
    @readonly PI = 3.14 // class内可以赋值plugin-proposal-class-properties功劳，装饰器使用plugin-proposal-decorators功劳
}

let p = new Person()
p.PI = 3.15 // 由于pi是只读的，所以报错
```

> @readonly PI = 3.14 // class内可以赋值plugin-proposal-class-properties功劳，装饰器使用plugin-proposal-decorators功劳

#### **babel runtime**

```js
cnpm install --save-dev @babel/plugin-transform-runtime
cnpm install --save @babel/runtime
```

babel runtime（babel运行时）。

> `@babel/plugin-transform-runtime` 是开发时引入, `@babel/runtime` 是运行时引用

babel在每个文件都插入了辅助代码，使得代码体积过大。

babel在一些公共方法使用了非常小的辅助代码，比如 _extend

默认情况下会被添加到每一个需要它的文件中。你可以引入 @babel/runtime作为一个**独立模块**，来避免重复引入。

> plugin-transform-runtime 已经默认包括了 @babel/polyfill，因此不用在独立引入

**引入**

```js
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            ['@babel/blugin-transform-runtime', {
                                corejs: false,
                                helpers: true,
                                regenerator: true,
                                useESModules: true
                            }]
                        ]
                    }
                }
            },
```

#### polyfill

**全局引入**

下载

```js
cnpm i babel-polyfill -D
```

使用

```js
import 'babel-polyfill';

const promise = new Promise((resolve) => resolve);
console.log(promise);
```

引入和不引入打包后差别有94kb左右。

**使用core-js**

再babel.config.js中配置

```js
    ['@babel/plugin-transform-runtime', {
      corejs: 3, // corejs 是一个给低版本的浏览器提供接口的库，如 Promise、Map和Set 等
      helpers: true, // 工具方法
      regenerator: true, //
      useESModules: true, // 是否使用ES6模块
    }],
```

> corejs可以使用`false`, `2`, `3`。

**使用自动的polyfill**

官网https://c7sky.com/polyfill-io.html

按照需求自动加载polyfill

使用

在indexHTML模板内添加

```html
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```

#### babel-runtime和babel-polyfill区别

参考：https://www.jianshu.com/p/73ba084795ce



## browserslist

> 上边使用Autoprefixer时添加了browserslist。实际上使用该文件的插件还有很多。

- [Autoprefixer](https://github.com/postcss/autoprefixer) （postcss CSS规则添加供应商前缀 ）
- [Babel](https://github.com/babel/babel/tree/master/packages/babel-preset-env) （bable-preset-env编译预设环境 智能添加polyfill垫片代码）
- [postcss-preset-env](https://github.com/jonathantneal/postcss-preset-env)
- [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)  (减少代码的浏览器兼容性)
- [stylelint-no-unsupported-browser-features](https://github.com/ismay/stylelint-no-unsupported-browser-features) （写代码自动校验，禁止browserslist标记的浏览器不支持的css）
- [postcss-normalize](https://github.com/jonathantneal/postcss-normalize) (css初始化文件)
- [obsolete-webpack-plugin](https://github.com/ElemeFE/obsolete-webpack-plugin) （Webpack插件生成一个浏览器端独立脚本，该脚本基于[Browserslist](https://github.com/browserslist/browserslist)检测浏览器兼容性，并提示网站用户对其进行升级。）

**基础语法**

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/20181220182438681.png)

**给一个默认配置**

\> 1%

last 2 versions

not ie <=8

Android >=4.0

## devtool

参考1：https://www.cnblogs.com/axl234/p/6500534.html

参考2：https://blog.csdn.net/liwusen/article/details/79414508

**介绍**

- sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
- webpack通过配置可以自动给我们`source maps`文件，`map`文件是一种对应编译文件和源文件的方法
- [whyeval](https://github.com/webpack/docs/wiki/build-performance#sourcemaps)
- [source-map](https://github.com/mozilla/source-map)
- [javascript_source_map算法](https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

**可取值**

| 类型                         | 含义                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| source-map                   | 原始代码 最好的sourcemap质量有完整的结果，但是会很慢         |
| eval-source-map              | 原始代码 同样道理，但是最高的质量和最低的性能（追查错误时会追查到eval内） |
| cheap-module-eval-source-map | 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能    |
| cheap-eval-source-map        | 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl |
| eval                         | 生成代码 每个模块都被eval执行，并且存在@sourceURL,带eval的构建模式能cache SourceMap |
| cheap-source-map             | 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用 |
| cheap-module-source-map      | 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射（打印错误时，有时候会多打印一遍，并且时没有source-map） |

看似配置项很多， 其实只是五个关键字eval、source-map、cheap、module和inline的任意组合

| 关键字     | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| eval       | 使用eval包裹模块代码，增加sourceURL来关联模块处理前后的对应关系（*# sourceURL=webpack:///./src/js/index.js?\'*） |
| source-map | 产生.map文件(*\# sourceMappingURL=index.js.map*)             |
| cheap      | 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap |
| module     | 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）,否则无法定义源文件 |
| inline     | 将.map作为DataURI嵌入，不单独生成.map文件（*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9...*） |

在开发环境中我们使用：cheap-module-eval-source-map

在生产环境中我们使用：cheap-module-source-map。

这里需要补充说明的是，eval-source-map组合使用是指将.map以DataURL的形式引入到打包好的模块中，类似于inline属性的效果，我们在生产中，使用eval-source-map会使打包后的文件太大，因此在生产环境中不会使用eval-source-map。但是因为eval的rebuild速度快，因此我们可以在本地环境中增加eval属性。

## sourceMap

参考：http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

.map文件

```js
{
  "version": 3, // Source map的版本，目前为3
  "sources": [ // 转换前的文件。该项是一个数组，表示可能存在多个文件合并。
    "webpack:///webpack/bootstrap",
    "webpack:///./src/commin.js"
  ],
  "names": [ // 转换前的所有变量名和属性名
    "window",
    "getName",
    "name",
    "console",
    "log"
  ],
  "mappings": // 记录位置信息的字符串
  ";QAAA;QACA;;QAEA;QACA;;QAEA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;;QAEA;QACA;;QAEA;QACA;;QAEA;QACA;QACA;;;QAGA;QACA;;QAEA;QACA;;QAEA;QACA;QACA;QACA,0CAA0C,gCAAgC;QAC1E;QACA;;QAEA;QACA;QACA;QACA,wDAAwD,kBAAkB;QAC1E;QACA,iDAAiD,cAAc;QAC/D;;QAEA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA;QACA,yCAAyC,iCAAiC;QAC1E,gHAAgH,mBAAmB,EAAE;QACrI;QACA;;QAEA;QACA;QACA;QACA,2BAA2B,0BAA0B,EAAE;QACvD,iCAAiC,eAAe;QAChD;QACA;QACA;;QAEA;QACA,sDAAsD,+DAA+D;;QAErH;QACA;;;QAGA;QACA;;;;;;;;;;;;AClFAA,MAAM,CAACC,OAAP,GAAiB,UAACC,IAAD,EAAU;AACzBC,SAAO,CAACC,GAAR,CAAYF,IAAZ;AACD,CAFD,C,CAGA;AACA;AACA,I",
  "file": "commin.dbae0498fc1f90087a24.js", // 转换后的文件名
  "sourcesContent": [], // 内容
  "sourceRoot": "" // 转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空
}
```



## ESlint

```js
cnpm i eslint eslint-loader babel-eslint -D
```

引入

```js
{
    test: /\.(js)%/,
    loader: 'eslint-loader',
    enforce: 'pre', // 高优先级执行，先执行。 post// 优先级最低最后执行
    include: path.join(__dirname, 'src'), // 只校验自己写的代码
    exclude: /node_modules/, // 排除node_modules
},
```

配置.eslintrc.js

```js
module.exports = {
    root: true, // 是否是根目录配置,配置文件可以继承。
    parserOptions: { // 解析器的选项 AST语法树解析。
        sourceType: 'module',
        ecmaVersion: 'es2015'
    },
    env:{ // 指定运行环境
        browser: true, // window document
        node:true, // require process
    },
    rules: {
        indent: ['error',4] // 缩进，长度不等于4则报错。
    },
}
```

**继承**

```js
cnpm i eslint-config-airbnb eslint-loader eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks and eslint-plugin-jsx-a11y -D
```

更改eslintrc.js的配置

```js
module.exports = {
  // root: true, // 是否是根目录配置,配置文件可以继承。
  parser: 'babel-eslint', // 源代码征程语法树的工具
  extends: 'airbnb', // 继承
  parserOptions: { // 解析器的选项 AST语法树解析。
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  env: { // 指定运行环境
    browser: true, // window document
    node: true, // require process
  },
  rules: {
    'linebreak-style': 'off', // 相应的控制序列是"\n"（对于LF）和"\r\n"对于（CRLF）。
    'no-console': 'off',
    'global-require': 'off', // 要求 require() 出现在顶层模块作用域中
    'import/no-extraneous-dependencies': 'off',
    // indent: ['error',4], // 缩进，长度不等于4则报错。
    // // 'no-console':'error' // 不能出现console
  },
};

```

> rules规则查看：https://eslint.bootcss.com/docs/rules/

## resolve

对包引入的指定

### 省略后缀

使用extensions省略引入文件的后缀名

> 如果不表明，会导致打包后找不到引入文件

```js
resolve: {
  extensions: [".js",".jsx",".json",".css"], 
},
```

> 引入这几个后缀名的文件后缀可以省略不写。
>
> **顺序从左到右依次匹配。**

### 使用别名

设置别名，可以在模块引用时引用定义好的模块。

1，减少查找路径，提高查找速度。

2，自定义引入模块。

```js
  resolve: {
    alias: {
      bootstrap: path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css'),
    }, // 减少查找路径，提高查找速度；可以添加额外的引入路径
    modules: ['node_modules'],
  },
```

> modules 指定查找范围。

案例

```jsx
import 'bootstrap';
const Ceshi1 = () => {
  return (
    <div>
      <button type="button" className="btn btn-primary">（首选项）Primary</button>
    </div>
  );
};
```

### 加载包（文件）的顺序

**mainFields**

在包的package.json下。（下面是bootstrap的package.json）

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%9824.png)

默认从main引入，我们可以从style引入

```js
  resolve: {
    mainFields:['style','browser','module','main']
  },
```

**mainFiles**

查找对应文件的顺序

```js
  resolve: {
    mainFiles: ['index.js', 'main.js'],
  },
```

## resolveLoader

配置项同resolve，用于对于loader引入的指定

```js
  resolveLoader: {
    modules: ['node_modules', 'loaders'], // 查找范围
  },
```



## watch

当代码发生修改后可以自动重新编译

```js
module.exports = {
    //默认false,也就是不开启
    watch:true,
    //只有开启监听模式时，watchOptions才有意义
    watchOptions:{
        //默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored:/node_modules/,
        //监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        //判断文件是否发生变化是通过不停的询问文件系统指定议是有变化实现的，默认每秒问1000次
        poll:1000
    }
}
```

使用yarn build生效。

## 代理服务器

服务器代理用一次开发环境下解决跨域问题，和接口测试问题。

### **在devServer中设置代理服务**

```js
devServer: {
    // 启动server产出的文件在内存里，为了生成文件
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 压缩
    port: 9000,
    proxy: {
      // '/api': 'http://localhost:3000',
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '',
        },
      },
    },
```

> 可以直接设置 `'/api': 'http://localhost:3000'`当访问 /api/users 时代理到 localhost:3000
>
> 也可以重写用户输入的代理路径（浏览器url不会变），使用 pathRewrite 属性，把 /api 替换成空，例如 /api/start 后端则获取到 /start
>
> 注：这些都是docment请求，非XHR请求。

后端

使用 node 命令运行服务。

```js
const express = require('express');

const app = express();
app.get('/api/users', (req, res) => {
  res.json([{
    id: 1,
    name: 'wuzhan',
  }]);
});
app.get('/start', (req, res) => {
  res.json([{
    id: 1,
    name: 'wuzhan',
  }]);
});
app.listen(3000);

```

**使用before钩子**

before是一个钩子，此钩子会在应用服务器启动之前执行。

> 可以不用启用proxy

```js
devServer: {
    // 启动server产出的文件在内存里，为了生成文件
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 压缩
    port: 9000,
    before(app) {
      app.get('/api/users2', (req, res) => {
        res.json([{
          id: 1,
          name: 'zhufeng',
        }]);
      });
      app.use(function(req,res,next){
          res.json([{id:1,name:'zhufeng'}])
      })
    },
  },
```

### 在node中打包webpack

```js
cnpm install webpack-dev-middleware --save-dev
```

> devServe内部就是使用webpack-dev-middleware实现

实现

当运行node文件时，自动执行 webpackConfig 配置打包文件。并且开启服务，使用http://localhost:5000/访问。

> 有devServer的热更新功能。

```js
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

const compiler = webpack(webpackConfig);
// 这里中间件做了什么，compiler.run
// 启动编译 compiler.run
// 使用一个中间件，用来响应客户端对打包后的文件的请求
app.use(webpackDevMiddleware(compiler, {}));
app.get('./webpack', (req, res) => {
  res.json([{
    id: 1,
    name: 'zhufeng',
  }]);
});
app.listen(5000);
```

## 区分环境变量

注释掉mode: 'development'，改为通过命令赋值方式。

pachage.json添加 --env=production

```js
  "scripts": {
    "build": "webpack",
    "build:dev": "webpack --env=development",
    "build:prod": "webpack --env=production",
    "dev:dev": "webpack-dev-server --env=development --open",
    "dev:prod": "webpack-dev-server --env=production --open"
  },
```

添加的env变量

```js
module.exports = (env, argv) => ({
	mode: env,
	optimization: {
    minimizer: env === 'production' ? [
        ……
        // 开启优化
    ] : [],
    devtool: env === 'production' ? 'null' : 'source-map',
  },
})
```

**分环境控制log打印**

文件需要提前引入

> 重写全局函数console.log
>
> 重写为分环境执行内容

```js
// 设置console.log分环境开发
const { log } = console;
console.log = function (...args) {
  if (process.env.NODE_ENV === 'development') {
    log.apply(console, args);
  }
};
```

**webpack-merge**

安装

```js
cnpm i webpack-merge -D
```

拆分到不同文件

```js
const path = require('path');
const { smart } = require('webpack-merge');

const base = require('./webpack.base');

module.exports = smart(base,{ // 注：不能放入方法，只能是对象。
  mode: 'development',
  watch: true,
  devtool: 'source-map',
  optimization: { // 放优化的内容
    minimize: false,
    minimizer: [],
  },
  devServer: {
    // 启动server产出的文件在内存里，为了生成文件
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // 压缩
    port: 9000,
    // before(app) {
    //   app.get('/api/users2', (req, res) => {
    //     res.json([{
    //       id: 1,
    //       name: 'zhufeng',
    //     }]);
    //   });
    // },
    // proxy: {
    //   // '/api': 'http://localhost:3000',
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
});
```

## 修改log日志

### **stats**

| 预设        | 替代  | 描述                     |
| :---------- | :---- | :----------------------- |
| errors-only | none  | 只在错误时输出           |
| minimal     | none  | 发生错误和新的编译时输出 |
| none        | false | 没有输出                 |
| normal      | true  | 标准输出                 |
| verbose     | none  | 全部输出                 |

设置

```
stats: 'minimal',
```

### 使用log美化插件

安装

```js
cnpm i friendly-errors-webpack-plugin -D
```

使用

```js
  stats: 'minimal',
  plugins: [
  // 美化log
     new FriendlyErrorsWebpackPlugin(),
  ]
```

## 费时分析

用于分析插件，loader等webpack内部打包时的耗时。

安装

```js
$ cnpm i speed-measure-webpack-plugin -D
```

效果

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/2020-06-19_173829.png)

使用

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// 费时分析
const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap(smart(base, {……}));
```

## 代码质量分析

是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

安装

```js
cnpm i webpack-bundle-analyzer -D
```

使用

```js
//webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  plugins: [
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      analyzerMode: 'disabled',
    }),
  ],

// package.json
{
 "scripts": {
    "generateAnalyzFile": "webpack --config webpack.dev.js --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}
```

使用后

> yarn generateAnalyzFile // 生成数据文件
>
> yarn analyz // 打开服务

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/babel_webpack/%E6%97%A0%E6%A0%87%E9%A2%9825.png)

## &问题

### 把引入的库放到一个文件夹内？

**使用正则**

```js
entry: { 
        index: './src/index.js',
        vendor: /node_modules/, // 把node_modules的文件放入vendor文件夹内。
    },
```

**使用glob**

```js
entry: { 
        index: './src/index.js',
        vendor:glob.sync('./node_modules/**/*.js'), 
    },
```

glob，查找符合规则的目录文件

例如：

```js
// glob，查找符合规则的目录文件
let glob = require('glob');
const files = glob.sync('./src/**/*.js');
console.log(files) // [ './src/commin.js', './src/index.js', './src/login.js' ]

const files2 = glob.sync('./src/**/*.{js,jpg,png}');
console.log(files2)
//     [ './src/commin.js', './src/index.js', './src/login.js' ]
//     [ './src/commin.js',
//     './src/img/bg1.jpg',
//     './src/img/u=2070673098,2420619176&fm=26&gp=0.jpg',
//     './src/index.js',
//     './src/login.js' ]
```

### 碰到bug=>'exports' of object \'#\<Object\>\'

```js
// babel.config.js
sourceType: 'unambiguous',
```

sourceType: 表明代码应该解析的模式。可以是 "script"，"module" 或者 "unambiguous" 中任意一个。默认为 “script”。"unambiguous"将使得Babylon 尝试根据ES6的import 或者export 声明来进行推测。具有 ES6 import和export 的文件被认为是 "module"，否则被认为是 "script"。
