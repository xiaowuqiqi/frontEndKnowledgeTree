---
title: targets 属性
nav: Webpack
group:
  title: 基础
  order: 0
order: 6
---
# targets 属性

## 简介

Webpack中的**target属性**指定了打包后的代码将**运行的环境**，以便Webpack能够将代码**输出**为**符合该环境的代码**。

它的作用是告诉Webpack打包后的代码要运行在哪个环境下，并且为该环境**提供**必要的**功能和支持**。

+ 如果你设置了"target"为**"web"**，那么Webpack将会编译出**适用于浏览器环境**的代码。

  Webpack 将提供一些在 Web 浏览器中才有的**全局变量**，例如 **window 和 document 对象**。

  使用 **import 加载模块**。

  > 注意，webpack 运行时代码与您编写的用户代码不同，如果您想**针对特定环境**，您应该**使用 Babel** 等转译器来**转译**这些代码，例如，源代码中有箭头函数并希望在ES5 环境。Webpack **不会**通过`target`配置**自动转译**它们。

+ 而如果你将"target"设置为**"node"**，Webpack会编译出适用于**Node.js环境**的代码，这时Webpack会将所有的依赖**打包到一个文件中**，而不是分开打包。这可以**提高代码的执行效率**，同时避免了在Node.js中加载大量小文件的性能问题。

  提供一些只有在Node.js环境中才有的**全局变量**，例如**process和global对象**。

  使用 Node.js 的 **`require` 加载 chunk**，而不加载任何内置模块，如 `fs` 或 `path`。

  > webpack 5 后，即使是设置为 web ，如 `fs` 或 `path`内置模块也都以及去除，,需要手动加载。例如:
  >
  > ```js
  > resolve: {
  >   fallback: {
  >     "stream": require.resolve("stream-browserify"), // Use stream-browserify as a polyfill
  >     "emitter": require.resolve("emitter"),
  >     "fs": false,
  >     "zlib": require.resolve("browserify-zlib")
  >   },
  > },
  > ```

除此之外，Webpack还支持其他多种target，如"node"、"electron-main"、"electron-renderer"等，可以用来打包运行在不同环境下的代码。

> 除了target属性，Webpack还有一些其他的属性，例如**output.libraryTarget属性**，可以用来指定**打包后**的**代码**是**以何种方式暴露出去**的，以及**module.target属性**，可以用来**指定特定的模块加载器**的**编译目标**。这些属性的作用都是为了让Webpack能够更好地适应不同的运行环境，并生成符合该环境要求的代码。

> 每个 *target* 都包含各种 **deployment（部署）**/**environment（环境）**特定的附加项，以满足其需求。具体请参阅 [target 可用值](https://webpack.docschina.org/configuration/target/)。

## API

通过支持以下字符串值[`WebpackOptionsApply`](https://github.com/webpack/webpack/blob/main/lib/WebpackOptionsApply.js)：

| 选项                       | 描述                                                         |
| :------------------------- | :----------------------------------------------------------- |
| `async-node[[X].Y]`        | 编译以在类似 Node.js 的环境中使用（使用`fs`和`vm`异步加载块） |
| `electron[[X].Y]-main`     | 为主进程编译[Electron 。](https://electronjs.org/)           |
| `electron[[X].Y]-renderer` | 为[Electron](https://electronjs.org/)编译渲染器进程，为浏览器环境以及CommonJS和 Electron 内置模块提供使用`JsonpTemplatePlugin`、的目标。`FunctionModulePlugin``NodeTargetPlugin``ExternalsPlugin` |
| `electron[[X].Y]-preload`  | 为[Electron](https://electronjs.org/)进行编译以用于渲染器进程，为浏览器环境以及CommonJS和Electron 内置模块提供`NodeTemplatePlugin`使用`asyncChunkLoading`set to 的目标。`true``FunctionModulePlugin``NodeTargetPlugin``ExternalsPlugin` |
| `node[[X].Y]`              | 编译以在类似 Node.js 的环境中使用（使用 Node.js`require`加载块） |
| `node-webkit[[X].Y]`       | 编译用于 WebKit 并使用 JSONP 进行块加载。允许导入内置 Node.js 模块和[`nw.gui`](http://docs.nwjs.io/en/latest/)（实验性） |
| `nwjs[[X].Y]`              | 与`node-webkit`                                              |
| `web`                      | 编译以在类似浏览器的环境中使用**（默认）**                   |
| `webworker`                | 编译为 WebWorker                                             |
| `esX`                      | 编译指定的 ECMAScript 版本。示例：es5、es2020。              |
| `browserslist`             | 从 browserslist-config 推断平台和 ES 功能**（如果 browserslist 配置可用，则默认）** |

例如，当`target`设置为时`"electron-main"`，webpack 包含多个电子特定变量。

`node`或 的版本`electron`可以选择性地指定。这`[[X].Y]`由上表中的 表示。

**webpack.config.js**

```js
module.exports = {
  // ...
  target: 'node12.18',
};
```

它有助于确定可用于生成运行时代码的 ES 功能（所有块和模块都由运行时代码包装）。

## **多个目标**

当传递多个目标时，将使用公共特征子集：

**webpack.config.js**

```js
module.exports = {
  // ...
  target: ['web', 'es5'],
};
```

Webpack 将为 Web 平台生成运行时代码，并且仅使用 ES5 功能。

目前并非所有目标都可以混合。

**webpack.config.js**

```js
module.exports = {
  // ...
  target: ['web', 'node'],
};
```

会导致**错误**。 Webpack 目前不支持通用目标。

## 关闭 target

设置`target`为`false`如果上面列表中的预定义目标均不能满足您的需求，则不会应用任何插件。

**webpack.config.js**

```js
module.exports = {
  // ...
  target: false,
};
```

或者您可以应用您想要的特定插件：

**webpack.config.js**

```js
const webpack = require('webpack');

module.exports = {
  // ...
  target: false,
  plugins: [
    new webpack.web.JsonpTemplatePlugin(options.output),
    new webpack.LoaderTargetPlugin('web'),
  ],
};
```

当未提供有关目标或[环境](https://webpack.js.org/configuration/output/#outputenvironment)功能的信息时，将使用 ES2015。
