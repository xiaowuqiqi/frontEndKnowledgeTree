---
title: TerserPlugin
nav: Webpack
group:
  title: optimization
  order: 1
order: 3
---
# TerserPlugin插件

webpack v5 开箱即带有最新版本的 `terser-webpack-plugin`。如果使用 webpack v4，则必须安装 `terser-webpack-plugin` v4 的版本。

**对于source maps**

只对 [`devtool`](https://www.webpackjs.com/configuration/devtool/) 选项的 `source-map`，`inline-source-map`，`hidden-source-map` 和 `nosources-source-map` 有效。

## test

类型： `String|RegExp|Array<String|RegExp>` 

用来匹配需要压缩的文件。

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i, // 默认值
      }),
    ],
  },
};
```

## include

类型： `String|RegExp|Array<String|RegExp>` 

匹配参与压缩的文件。

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: undefined, // 默认值
        include: /\/includes/,
      }),
    ],
  },
};
```

## exclude

类型： `String|RegExp|Array<String|RegExp>` 

匹配不需要压缩的文件。

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: undefined, // 默认值
        exclude: /\/excludes/,
      }),
    ],
  },
};
```

## parallel

使用多进程并发运行以提高构建速度。 并发运行的默认数量： `os.cpus().length - 1` 。

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 默认开启
        parallel: 4, // 启用多进程并发运行并设置并发运行次数。
      }),
    ],
  },
};
```

## minify

类型： `Function` 

默认值： `TerserPlugin.terserMinify`

允许自定义压缩函数。 

默认情况下，插件使用 [terser](https://github.com/terser/terser) 库。

对于使用和测试未发布的版本或 fork 的代码很帮助。

下面实现一个自定义的压缩函数，用于删除 console 替换成 log removed 注释。

详情api查看 [terser官网](https://terser.org/docs/api-reference/)

> 启用 `parallel` 选项时，在 `minify` 函数内部只能使用 `require` *。*

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: (file, sourceMap) => {
          // 如果你使用了 sourceMap, 请确保压缩函数也返回一个正确的 sourceMap
          const terserResult = Terser.minify(file, {
            /* 你的 Terser 配置 */
          });

          if (terserResult.error) {
            throw terserResult.error;
          }

          // 示例：添加自定义的压缩逻辑
          const modifiedCode = terserResult.code.replace(/console\.log/g, '/* log removed */');

          return {
            code: modifiedCode,
            map: terserResult.map, // 如果你处理了 sourceMap, 也返回它
            warnings: terserResult.warnings,
            errors: terserResult.errors,
          };
        },
      }),
    ],
  },
};
```

使用**内置压缩函数**。

```js
import type { JsMinifyOptions as SwcOptions } from "@swc/core";
import type { MinifyOptions as UglifyJSOptions } from "uglify-js";
import type { TransformOptions as EsbuildOptions } from "esbuild";
import type { MinifyOptions as TerserOptions } from "terser";

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin<SwcOptions>({
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          // `swc` options
        },
      }),
      new TerserPlugin<UglifyJSOptions>({
        minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          // `uglif-js` options
        },
      }),
      new TerserPlugin<EsbuildOptions>({
        minify: TerserPlugin.esbuildMinify,
        terserOptions: {
          // `esbuild` options
        },
      }),

      // Alternative usage:
      new TerserPlugin<TerserOptions>({
        minify: TerserPlugin.terserMinify,
        terserOptions: {
          // `terser` options 默认
        },
      }),
    ],
  },
};
```



## terserOptions

Terser [配置项](https://github.com/terser/terser#minify-options) 。

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          // Deprecated
          output: null,
          format: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
};
```

## extractComments

是否将**注释剥离到单独的文件**中（请参阅[详细信息](https://github.com/webpack/webpack/commit/71933e979e51c533b432658d5e37917f9e71595a)）。 默认情况下，**仅剥离 `/^\**!|@preserve|@license|@cc_on/i` 正则表达式匹配的注释**，**其余注释会删除**。 如果原始文件名为 `foo.js` ，则注释将存储到 `foo.js.LICENSE.txt` 。

1，如果设置为 `true`，则会将所有注释提取到一个单独的文件中。`false`则会删除所有注释。

2，提供一个**对象**以更细致地控制注释的提取。

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: {
        condition: 'some', // 提取满足某些条件的注释
        filename: 'comments.js', // 提取到的文件名
        banner: (filename) => `For license information please see ${filename}`, // 在原文件的顶部添加的banner
      },
    })],
  },
};
```

提供一个**函数**来决定哪些注释被保留。

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: (astNode, comment) => /@license/i.test(comment.value),
    })],
  },
};
```

指定**正则表达式**匹配的所有注释将会被剥离到单独的文件中。

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: /@extract/i,
      }),
    ],
  },
};
```

### 保留注释

剥离所有有效的注释（即 `/^\**!|@preserve|@license|@cc_on/i` ）并保留 `/@license/i` 注释。

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /@license/i,
          },
        },
        extractComments: true,
      }),
    ],
  },
};
```

### 删除注释

如果要在构建时去除注释，请使用以下配置：

**webpack.config.js**

```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
```



## Q & A

### `UglifyJsPlugin` 和 `TerserPlugin` 区别

`UglifyJsPlugin` 和 `TerserPlugin` 都是用于压缩和优化 JavaScript 代码的 Webpack 插件。它们有各自的历史和用途。下面是它们的区别和建议的使用场景：

1. **UglifyJsPlugin**:
   - `UglifyJsPlugin` 是较早的 Webpack 插件，用于压缩 JavaScript 代码。
   - 它基于 `uglify-js` 库。
   - 在早期，当大多数代码还是 ES5 时，`UglifyJsPlugin` 是非常流行的。
   - 但是，随着 ES6+（如 ES2015、ES2016 等）的出现和普及，`UglifyJsPlugin` 开始面临问题，因为它在处理某些新的 JavaScript 特性时有困难。
2. **TerserPlugin**:
   - `TerserPlugin` 是一个更新的插件，用于压缩和优化 JavaScript 代码。
   - 它基于 `terser` 库，这是一个 `uglify-es` 的分支，专门用于处理 ES6+ 代码。
   - `TerserPlugin` 不仅支持 ES6+ 代码，还提供了其他优化，如 Tree Shaking 的更好支持。
   - 在 Webpack 4+ 中，`TerserPlugin` 已经替代 `UglifyJsPlugin` 成为默认的压缩插件。

### terser中ecma属性的语法转化，相比babel有何不同？

1. **Terser 的 `ecma` 选项**:
   - 这个选项主要决定了压缩后的代码应遵循哪个 ECMAScript 版本的语法。例如，如果您选择 `ecma: 5`，那么 terser 会确保输出的代码是 ES5 兼容的，这可能意味着某些 ES6+ 的特性（如箭头函数）会被转化为 ES5 的语法。
   - 但是，请注意，`terser` 的这个功能是有限的。它不会像 Babel 那样提供完全的语法转换，它只会在压缩过程中做出一些简单的转换，如箭头函数转为普通函数。
2. **Babel**:
   - Babel 提供了全面的语法转换功能。它可以将新的 JavaScript 语法（如 async/await、对象扩展、类属性等）转换为旧版本的 JavaScript。
   - Babel 的插件和预设系统允许用户自定义他们希望进行的转换。

**结论**: 尽管 `terser` 的 `ecma` 选项可以进行一些基本的语法转换，但它的主要目的仍然是代码压缩和优化。如果需要全面的语法转换（尤其是为了兼容旧版本的浏览器），您应该使用 Babel。

在实际应用中，这两个工具通常一起使用：首先**使用 Babel 进行语法转换**，然后**使用 `terser` 进行压缩和优化**。这样，您可以确保代码既**兼容老浏览器**，又进行了**优化和压缩**。

### mangle 选项和 compress 选项区别是什么分别控制什么？

1. **mangle**:
   - `mangle` 的主要任务是通过重命名变量、函数、属性等来缩短代码长度。
   - 例如，它可能会将一个长变量名 `veryLongVariableName` 改为 `a`，从而减少文件大小。
   - 当你启用 `mangle` 时，你通常可以获得更小的代码输出，但代码可读性会降低。
   - 你也可以使用 `mangle` 的配置选项来保留某些名称不被混淆，或者使用其他更高级的功能。
2. **compress**:
   - `compress` 的目的是通过各种转换来减小代码的大小。这包括删除未使用的代码、简化条件、合并连续的声明、优化循环等。
   - 例如，它可能会将 `if (true) { console.log('yes'); }` 直接优化为 `console.log('yes');`。
   - `compress` 提供了许多配置选项，允许你控制哪些优化应该被应用或被跳过。
   - 与 `mangle` 不同，`compress` 的重点是逻辑和结构优化，而不仅仅是名称的重命名。



### TerserPlugin中可以设置内置压缩函数：swc，uglif-js，esbuild，terser，这四个压缩函数他们对比一下？

`TerserPlugin` 是一个常用于 Webpack 的插件，用于压缩 JavaScript 代码。它支持多种压缩工具，包括 swc、uglify-js、esbuild 和 terser。以下是这四种工具的简要对比：

1. **swc (Speedy Web Compiler)**

   **优势：**

   - 性能：`swc` 是使用 Rust 写的，因此它的编译速度非常快。
   - 功能全面：支持 ES6+ 语法、JSX、TypeScript 等。

   **劣势：**

   - 相对于其他工具，`swc` 可能在一些边缘情况或特定功能上不够稳定。

   **使用情况：** 当你需要非常快的编译速度，同时要求支持现代 JavaScript 和 TypeScript 语法时。

2. **uglify-js**

   **优势：**

   - 成熟：这是一个在 JavaScript 社区中使用已久的工具，因此它在处理各种 JS 代码上已经经过了时间的考验。
   - 可配置性高：提供了许多选项和功能供用户选择。

   **劣势：**

   - 速度：与其他现代工具相比，它的编译速度可能稍慢。
   - 不支持 ES6+ 语法：你需要将代码转换为 ES5 以使用 `uglify-js`。

   **使用情况：** 当你的代码主要是 ES5 语法，并且你想要一个经过时间测试的可靠工具时。

3. **esbuild**

   **优势：**

   - 极快的速度：使用 Go 编写，是目前市面上最快的 JavaScript 打包工具之一。
   - 支持多种语言和功能：ES6+、JSX、TypeScript、JSON 等。

   **劣势：**

   - 相对较新：可能在某些特定的场景或功能上缺少成熟性。

   **使用情况：** 当你追求极致的编译速度，并且需要支持现代 JavaScript 和 TypeScript 语法时。

4. **terser**

   **优势：**

   - 支持 ES6+：这使它成为 `uglify-js` 的现代替代品。
   - 成熟与稳定：被广大社区所接受和信任。
   - 可配置性高：与 `uglify-js` 类似，但支持更多现代语法。

   **劣势：**

   - 相对于 `esbuild` 和 `swc`，它的速度可能稍慢一些。

   **使用情况：** 当你的代码使用了 ES6+ 语法，你想要一个稳定且可配置的工具时。

总结：

- 对于最快的编译速度：考虑使用 `esbuild` 或 `swc`。
- 对于经过时间测试的稳定性：考虑使用 `uglify-js` 或 `terser`。
- 对于现代 JS 语法的支持：考虑使用 `terser`、`esbuild` 或 `swc`。

最终选择哪个工具取决于你的具体需求和项目情况。每个工具都有其适用的场景，你可以基于自己的项目需求进行权衡选择。
