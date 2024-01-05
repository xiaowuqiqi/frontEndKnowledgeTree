---
title: reacte-scripts详解1
nav: webpack
group:
  title: 案例
  order: 5
order: 1
---
# reacte-scripts详解1

reacte-scripts 很多功能都依赖了 react-dev-utils 包的方法，react-dev-utils 是对webpack配置的一些封装，它也可以单独使用，本章节主要介绍 react-dev-utils 包一些常见的方法。

## react-dev-utils

react-dev-utils 没有单一的入口点。您只能导入各个顶层模块。

### InterpolateHtmlPlugin

`new InterpolateHtmlPlugin(htmlWebpackPlugin: HtmlWebpackPlugin, replacements: {[key:string]: string})`

这个 webpack 插件允许我们将**自定义变量**插入到 `index.html` 中。

> 它与 [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin) 2.x 一起通过其 [events](https://github.com/ampedandwired/html-webpack-plugin#events) 协同工作。

```js
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

// webpack config
var publicUrl = '/my-custom-url';

module.exports = {
  output: {
    // ...
    publicPath: publicUrl + '/',
  },
  // ...
  plugins: [
    // 生成一个包含注入的 <script> 的 index.html 文件。
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    }),
    // 将公共URL作为 %PUBLIC_URL% 在 index.html 中可用，例如：
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: publicUrl,
      // 您可以传递任意的键值对，这只是一个示例。
      // WHATEVER: 42 将在 index.html 中用 42 替换 %WHATEVER%。
    }),
    // ...
  ],
  // ...
};
```

> 用于替换 html 模板中的字符串，例如替换 href="%PUBLIC_URL%/favicon.ico" 中 %PUBLIC_URL%。
>
> 也可以使用 HtmlWebpackPlugin 的 templateParameters 属性
>
> ```html
> new HtmlWebpackPlugin({
>    // 如果传递一个普通对象，它将与默认值合并
>    // 第4版新增功能
>    templateParameters: {
>      'foo': 'bar'
>    },
>    template: 'index.ejs'
> })
> <!DOCTYPE html>
> <html>
> <head>
>  <meta charset="utf-8">
>  <title><%= foo %></title>
> </head>
> <body>
> </body>
> </html>
> ```

### InlineChunkHtmlPlugin

`new InlineChunkHtmlPlugin(htmlWebpackPlugin: HtmlWebpackPlugin, tests: Regex[])`

这个Webpack插件将脚本块内联到 `index.html` 中。
它与 [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin) 4.x 协同工作。

```js
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

// Webpack配置
var publicUrl = '/my-custom-url';

module.exports = {
  output: {
    // ...
    publicPath: publicUrl + '/',
  },
  // ...
  plugins: [
    // 生成带有注入的 `index.html` 文件。
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('public/index.html'),
    }),
    // 内联带有 `runtime` 名称的块
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    // ...
  ],
  // ...
};
```

#### `new ModuleScopePlugin(appSrc: string | string[], allowedFiles?: string[])`

这个Webpack插件确保来自应用程序源目录的相对导入不会超出其范围。

```js
var path = require('path');
var ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  // ...
  resolve: {
    // ...
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // ...
    ],
    // ...
  },
  // ...
};
```

#### `checkRequiredFiles(files: Array<string>): boolean`

确保所有传递的文件都存在。<br>
文件名应该是绝对路径。<br>
如果找不到文件，打印警告消息并返回 `false`。

```js
var path = require('path');
var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

if (
  !checkRequiredFiles([
    path.resolve('public/index.html'),
    path.resolve('src/index.js'),
  ])
) {
  process.exit(1);
}
```

#### `clearConsole(): void`

清除控制台，希望以跨平台的方式完成。

```js
var clearConsole = require('react-dev-utils/clearConsole');

clearConsole();
console.log('刚刚清除了屏幕！');
```

#### `eslintFormatter(results: Object): string`

这是我们定制的 ESLint 格式化程序，与 Create React App 控制台输出良好集成。<br>
如果您愿意，您也可以使用默认的格式化程序。

```js
const eslintFormatter = require('react-dev-utils/eslintFormatter');

// 在您的webpack配置中：
// ...
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      include: paths.appSrc,
      enforce: 'pre',
      use: [
        {
          loader: 'eslint-loader',
          options: {
            // 传递格式化程序：
            formatter: eslintFormatter,
          },
        },
      ],
    },
  ];
}
```

#### `FileSizeReporter`

##### `measureFileSizesBeforeBuild(buildFolder: string): Promise<OpaqueFileSizes>`

捕获传递的 `buildFolder` 中的JS和CSS资产大小。将结果值保存下来，以便在构建后进行比较。

##### `printFileSizesAfterBuild(webpackStats: WebpackStats, previousFileSizes: OpaqueFileSizes, buildFolder: string, maxBundleGzipSize?: number, maxChunkGzipSize?: number)`

在构建后打印JS和CSS资产大小，并包括与 `measureFileSizesBeforeBuild()` 之前捕获的 `previousFileSizes` 进行比较的大小比较。可以选择指定 `maxBundleGzipSize` 和 `maxChunkGzipSize`，以在主捆绑包或块超过指定大小（以字节为单位）时显示警告。

```js
var {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('react-dev-utils/FileSizeReporter');

measureFileSizesBeforeBuild(buildFolder).then(previousFileSizes => {
  return cleanAndRebuild().then(webpackStats => {
    printFileSizesAfterBuild(webpackStats, previousFileSizes, buildFolder);
  });
});
```

#### `formatWebpackMessages({errors: Array<string>, warnings: Array<string>}): {errors: Array<string>, warnings: Array<string>}`

从webpack [stats](https://github.com/webpack/docs/wiki/node.js-api#stats) 对象中提取和美化警告和错误消息。

```js
var webpack = require('webpack');
var config = require('../config/webpack.config.dev');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var compiler = webpack(config);

compiler.hooks.invalid.tap('invalid', function () {
  console.log('编译中...');
});

compiler.hooks.done.tap('done', function (stats) {
  var rawMessages = stats.toJson({}, true);
  var messages = formatWebpackMessages(rawMessages);
  if (!messages.errors.length && !messages.warnings.length) {
    console.log('成功编译！');
  }
  if (messages.errors.length) {
    console.log('编译失败。');
    messages.errors.forEach(e => console.log(e));
    return;
  }
  if (messages.warnings.length) {
    console.log('编译带有警告。');
    messages.warnings.forEach(w => console.log(w));
  }
});
```

#### `printBuildError(error: Object): void`

美化一些已知的构建错误。将一个错误对象传递给它，以在控制台中记录漂亮的错误消息。

```js
const printBuildError = require('react-dev-utils/printBuildError');
try {
  build()
} catch(e) {
  printBuildError(e) // 记录漂亮的消息
}
```

#### `getProcessForPort(port: number): string`

查找在 `port` 上当前运行的进程。返回一个包含名称和目录的字符串，例如：

```
create-react-app
in /Users/developer/create-react-app
```

```js
var getProcessForPort = require('react-dev-utils/getProcessForPort');

getProcessForPort(3000);
```

#### `launchEditor(fileName: string, lineNumber: number): void`

在macOS上，尝试找到已知的运行编辑器进程，并在其中打开文件。还可以通过 `REACT_EDITOR`、`VISUAL` 或 `EDITOR` 环境变量进行显式配置。例如，您可以在 `.env.local` 文件中放置 `REACT_EDITOR=atom`，Create React App 将尊重该配置。

#### `noopServiceWorkerMiddleware(servedPath: string): ExpressMiddleware`

返回Express中间件，提供一个 `${servedPath}/service-worker.js`，重置先前设置的任何服务工作者配置。在开发中很有用。

#### `redirectServedPathMiddleware(servedPath: string): ExpressMiddleware`

返回Express中间件，如果 `req.url` 不以 `servedPath` 开头，则重定向到 `${servedPath}/${req.path}`。在开发中很有用。

#### `openBrowser(url: string): boolean`

尝试使用给定的URL打开浏览器。<br>
在Mac OS X上，尝试通过AppleScript重用现有的Chrome标签。<br>
否则，退回到 [opn](https://github.com/sindresorhus/opn) 的行为。

```js
var path = require('path');
var openBrowser = require('react-dev-utils/openBrowser');

if (openBrowser('http://localhost:3000')) {
  console.log('浏览器选项卡已打开！');
}
```

#### `printHostingInstructions(appPackage: Object, publicUrl: string, publicPath: string, buildFolder: string, useYarn: boolean): void`

在项目构建后打印托管说明。

将解析后的 `package.json` 对象作为 `appPackage`，您计划托管应用程序的URL作为 `publicUrl`，webpack配置的 `output.publicPath` 作为 `publicPath`，`buildFolder` 名称以及是否在说明中使用 `useYarn` 传递。

```js
const appPackage = require(paths.appPackageJson);
const publicUrl = paths.publicUrlOrPath;
const publicPath = config.output.publicPath;
printHostingInstructions(appPackage, publicUrl, publicPath, 'build', true);
```

#### `WebpackDevServerUtils`

##### `choosePort(host: string, defaultPort: number): Promise<number | null>`

返回一个Promise，解析为 `defaultPort` 或下一个可用端口，如果用户确认可以使用。如果端口已被占用，并且用户拒绝使用另一个端口，或者终端不是交互式的且不能向用户显示选择，则解析为 `null`。

##### `createCompiler(args: Object): WebpackCompiler`

为WebpackDevServer创建一个webpack编译器实例，具有内置的有用消息。

`args` 对象接受许多属性：

- **appName** `string`：将在终端上打印的名称。
- **config** `Object`：提供给webpack构造函数的webpack配置选项。
- **urls** `Object`：要提供 `urls` 参数，请使用下面描述的 `prepareUrls()`。
- **useYarn** `boolean`：如果为 `true`，将在终端中发出yarn说明，而不是npm。
- **useTypeScript** `boolean`：如果为 `true`，将启用TypeScript类型检查。如果将其设置为 `true`，请确保提供上述 `devSocket` 参数。
- **webpack** `function`：对webpack构造函数的引用。

##### `prepareProxy(proxySetting: string, appPublicFolder: string, servedPathname: string): Object`

从 `package.json` 的 `proxy` 设置中创建一个WebpackDevServer `proxy` 配置对象。

##### `prepareUrls(protocol: string, host: string, port: number, pathname: string = '/'): Object`

返回一个对象，其中包含开发服务器的本地和远程URL。将此对象传递给上面描述的 `createCompiler()`。

#### `webpackHotDevClient`

这是 [WebpackDevServer](https://github.com/webpack/webpack-dev-server) 的替代客户端，显示语法错误覆盖。

目前仅支持webpack 3.x。

```
jsCopy code// webpack开发配置
module.exports = {
  // ...
  entry: [
    // 如果您更喜欢stock客户端，则可以将下面的行替换为这两行：
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    'react-dev-utils/webpackHotDevClient',
    'src/index',
  ],
  // ...
};
```

#### `getCSSModuleLocalIdent(context: Object, localIdentName: String, localName: String, options: Object): string`

为使用 `index.module.css` 命名的文件创建CSS模块的类名。对于 `MyFolder/MyComponent.module.css` 和类 `MyClass`，输出将是 `MyComponent.module_MyClass__[hash]`。对于 `MyFolder/index.module.css` 和类 `MyClass`，输出将是 `MyFolder_MyClass__[hash]`。

```
jsCopy codeconst getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

// 在您的webpack配置中：
// ...
module: {
  rules: [
    {
      test: /\.module\.css$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: postCSSLoaderOptions,
        },
      ],
    },
  ];
}
```

#### `getCacheIdentifier(environment: string, packages: string[]): string`

返回一个缓存标识符（字符串），由指定的环境和相关包版本组成，例如：

```js
var getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');

getCacheIdentifier('prod', ['react-dev-utils', 'chalk']); // # => 'prod:react-dev-utils@5.0.0:chalk@3.0.0'
```

