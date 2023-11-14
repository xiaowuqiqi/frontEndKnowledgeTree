# 构建自定义插件

## 创建项目

新建目录（zhufeng-dll）

### **创建项目**

使用指令，

```js
cnpm init -y
```

### **webpack配置**

新建文件webpack.config.js （zhufeng-dll/webpack.config.js）

```js
const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'none', // 设置为none，关闭预设，方式影响。
    entry: { // 入口有两个，分别是压缩和非压缩版本。
        'zhufengmath': './res/index.js',
        'zhufengmath.min': './res/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                include: /\.min\.js$/, // 只压缩.min文件
                parallel: true,
                cache: true
            })
        ]
    }
}

```

### **写入内容代码**

res内写入index文件

```js
function add(a, b) {
    return a + b;
}

function minus(a, b) {
    return a + b;
}

function multipry(a, b) {
    return a * b
}

function divide(a, b) {
    return a / b
}

export default {
    add, minus, multipry, divide
}

```

### 使用指令打包文件

```js
npx webpack
```

## 导出库

### 创建导出出口文件

新建文件（zhufeng-dll/index）

读取用户的环境切换不同引入方式

```js
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./dist/zhufengmath.min.js')
}else{
    module.exports = require('./dist/zhufengmath.js')
}
```

### 修改导出名等信息

修改webpack配置文件

当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到它们

- `output.library` 配置导出库的名称
- `output.libraryExport` 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
- `output.libraryTarget` 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                   | 使用者提供给被使用者的模块的方式         |
| :------------ | :--------------------------------- | :--------------------------------------- |
| var           | 只能以script标签的形式引入我们的库 | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照commonjs的规范引入我们的库 | 被依赖模块需要按照commonjs规范引入       |
| amd           | 只能按amd规范引入                  | 被依赖的模块需要按照amd规范引入          |
| umd           | 可以用script、commonjs、amd引入    | 按对应的方式引入                         |

设置配置文件

```js
module.exports = {
    mode: 'none',
    entry: {……},
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'zhufengmath', // 导出库名字
        libraryTarget: 'umd', // 什么模式导出 // umd 可以用script标签、commonjs、amd引入
        libraryExport: 'default' // 导出什么属性(可以设置add，这样只导出add方法，使用时由window.zhufengmath.add()变为window.zhufengmath())
    },
    optimization: {
        ……
    }
}
```

> umd 不包括var方式，var方式只能用script标签引入。

libraryTarget当这是为window时：

```js
window["zhufengmath"] =
```

libraryTarget当设置umd打包后：

```js
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(); // commonjs2
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zhufengmath"] = factory(); // commonjs
	else
		root["zhufengmath"] = factory(); // 使用script标签时，赋值给zhufengmath
})(window, function() {……
```

> 使用script标签时，window.zhufengmath.add()

## 上线

```js
// 登录
nrm use npm // 切回npm
npm login
// 查询包名
npm search zhufenglib
// 发布（包根目录）
npm pulish

```

