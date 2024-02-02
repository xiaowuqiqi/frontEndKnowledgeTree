---
title: react-dev-utils详解1
nav: webpack
group:
  title: 案例
  order: 5
order: 1
---
# react-dev-utils详解1

reacte-scripts 很多功能都依赖了 react-dev-utils 包的方法，react-dev-utils 是对webpack配置的一些封装，它也可以单独使用，本章节主要介绍 react-dev-utils 包一些常见的方法。

react-dev-utils 没有单一的入口点。您只能导入各个顶层模块。

## InterpolateHtmlPlugin

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

### 源码分析

通过 htmlPlugin 的 afterTemplateExecution （模板编译后）钩子，获取到 html 模板编译后代码，做替换，即  `data.html = data.html.replace(……) ` 替换 `%` 包裹的字符串。

```js
'use strict';
/**
 * 转义正则中的特殊字符
 * 例如：
 * const escapedString = escapeStringRegexp('How much $ for a 🦄?');
 * //=> 'How much \\$ for a 🦄\\?'
 * */
const escapeStringRegexp = require('escape-string-regexp');

class InterpolateHtmlPlugin {
  constructor(htmlWebpackPlugin, replacements) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
          // Run HTML through a series of user-specified string replacements.
          // 通过一系列用户指定的字符串替换来运行HTML。
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
              value
            );
          });
        });
    });
  }
}
```

## InlineChunkHtmlPlugin

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

### 源码解析

主要流程是，在 alterAssetTagGroups（分组前） 钩子中获取 assets.headTags 和 assets.bodyTags 标签组，遍历标签组获取到 tag.attributes.src ，其为 scriptName ，可以获取源代码，即compilation.assets[scriptName].source()，注入到 innerHTML 中。

这样就成了内联的html文件中的代码。

```js
class InlineChunkHtmlPlugin {
  constructor(htmlWebpackPlugin, tests) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag(publicPath, assets, tag) {
    if (tag.tagName !== 'script' || !(tag.attributes && tag.attributes.src)) {
      return tag;
    }
    const scriptName = publicPath
      ? tag.attributes.src.replace(publicPath, '')
      : tag.attributes.src;
    if (!this.tests.some(test => scriptName.match(test))) {
      return tag;
    }
    const asset = assets[scriptName];
    if (asset == null) {
      return tag;
    }
    return { tagName: 'script', innerHTML: asset.source(), closeTag: true };
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
      const tagFunction = tag =>
        // compilation.assets[filename].source() 获取资源源代码，注意 filename 的入参。
        this.getInlinedTag(publicPath, compilation.assets, tag);

      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
        // headTags 可以获取到所有的标签数据，例如 script src 的信息
        // 也可以赋值，覆盖这些数据。
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);
      });
    });
  }
}
```

## ModuleScopePlugin

`new ModuleScopePlugin(appSrc: string | string[], allowedFiles?: string[])`

这个Webpack插件确保来自应用程序**源目录的相对导入不会超出其范围**。

> 每个模块引入应该在 appSrc 范围内，如果不在则报错。第二个参数是添加一些 appSrc 范围外的忽略路径。
>
> 同时 node_modules 特殊，需要忽略。

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

### 源码分析

首先获取参数1 appSrcs 范围路径数组，以及参数2 allowedPaths 忽略路径数组。

首先，判断**请求者**文件是否来自**webpack内部**的路径（` !request.context.issuer`）,是则不继续处理。

然后，判断**要请求**文件是否来自**node_modules中**的（`request.descriptionFileRoot.indexOf('/node_modules/') !== -1`）,是则不继续处理。

然后，判断**引入时路径（import）**是否不存在（`!request.__innerRequest_request`）,是则不继续处理。

然后，判断**请求者**文件不在 appSrcs 下或子路径下，是则不继续处理。

```js
appSrcs.every(appSrc => {
  const relative = path.relative(appSrc, request.context.issuer);
  return relative.startsWith('../') || relative.startsWith('..\\');
})
```

然后，判断**要请求**文件不在 allowedPaths 下或子路径下，是则不继续处理。

```js
this.allowedPaths.some(allowedFile => {
  return requestFullPath.startsWith(allowedFile);
})
```

然后，判断**要请求**文件不在 appSrcs 下或子路径下，是则报错，否则不继续处理。

```js
  appSrcs.every(appSrc => {
    const requestRelative = path.relative(appSrc, requestFullPath);
    // 如果 requestFullPath 不在 appSrc 的子目录中，则报错。
    return (
      requestRelative.startsWith('../') ||
      requestRelative.startsWith('..\\')
    );
  })
```

源码：

```js
  // 这个插件的作用是在Webpack构建时拦截模块的导入请求，检查模块的路径是否符合规定的范围，如果不符合，则抛出错误。
  // 这有助于确保项目中的模块导入只能在特定的目录范围内进行，提高项目的可维护性和结构的清晰性。
  apply(resolver) {
    const { appSrcs } = this;
    // file 是 enhanced-resolver 内部 hook 。
    // 用于处理文件模块解析请求的 hook。
    // 每个模块路径经 resolver 解析后，文件引入前都要走这个 hook。
    resolver.hooks.file.tapAsync(
      'ModuleScopePlugin',
      (request, contextResolver, callback) => {
        // Unknown issuer, probably webpack internals
        // 未知的 issuer 路径，可能是webpack内部的
        // issuer 请求者的文件的绝对路径。是导入时的位置。详情参考 webpack Rule.issuer。
        if (!request.context.issuer) {
          return callback();
        }
        if (
          // If this resolves to a node_module, we don't care what happens next
          // 如果这解析到一个 node_modules 模块，我们不关心接下来会发生什么。
          request.descriptionFileRoot.indexOf('/node_modules/') !== -1 ||
          request.descriptionFileRoot.indexOf('\\node_modules\\') !== -1 ||
          // Make sure this request was manual
          // 确保这个请求是手动的
          // enhanced-resolver 刚开始的 request 入参，即模块import时的路径（例如 ../test/test.js
          !request.__innerRequest_request
        ) {
          return callback();
        }
        // Resolve the issuer from our appSrc and make sure it's one of our files
        // Maybe an indexOf === 0 would be better?
        // 从我们的 appSrc 解析发起者，并确保它是我们的文件之一
        // 也许使用 indexOf === 0 会更好？
        if (
         // 如果请求者不在我们的 app src 或子目录中，那就不是我们的请求!则忽略
          appSrcs.every(appSrc => {
            const relative = path.relative(appSrc, request.context.issuer);
            return relative.startsWith('../') || relative.startsWith('..\\');
          })
        ) {
          return callback();
        }
        // 如果 issuer 为 /src/index.js，而 __innerRequest_request 为 ../test/test.js 
        // 则 requestFullPath 为 /test/test.js
        const requestFullPath = path.resolve(
          path.dirname(request.context.issuer),
          request.__innerRequest_request 
        );
		// 忽略参数2规定的忽略值
        if (this.allowedFiles.has(requestFullPath)) {
          return callback();
        }
        // 如果子目录在参数2规定的忽略值中，也要忽略
        if (
          this.allowedPaths.some(allowedFile => {
            return requestFullPath.startsWith(allowedFile);
          })
        ) {
          return callback();
        }
        // Find path from src to the requested file
        // Error if in a parent directory of all given appSrcs
        // 查找从src到请求文件的路径
        // 如果在所有给定appsrc的父目录中，则会出错(不在 src 的子目录中)
        if (
          appSrcs.every(appSrc => {
            const requestRelative = path.relative(appSrc, requestFullPath);
            // 如果 requestFullPath 不在 appSrc 的子目录中，则报错。
            return (
              requestRelative.startsWith('../') ||
              requestRelative.startsWith('..\\')
            );
          })
        ) {
          const scopeError = new Error(
            `You attempted to import ${chalk.cyan(
              request.__innerRequest_request
            )} which falls outside of the project ${chalk.cyan(
              'src/'
            )} directory. ` +
              `Relative imports outside of ${chalk.cyan(
                'src/'
              )} are not supported.` +
              os.EOL +
              `You can either move it inside ${chalk.cyan(
                'src/'
              )}, or add a symlink to it from project's ${chalk.cyan(
                'node_modules/'
              )}.`
          );
          Object.defineProperty(scopeError, '__module_scope_plugin', {
            value: true,
            writable: false,
            enumerable: false,
          });
          callback(scopeError, request);
        } else {
          callback();
        }
      }
    );
  }
```

## checkRequiredFiles

`checkRequiredFiles(files: Array<string>): boolean`

确保所有传递的**文件**都**存在**。

文件名应该是绝对路径。

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

### 源码解析

使用 fs.accessSync 方法判断文件是否存在。

```js
try {
    files.forEach(filePath => {
      currentFilePath = filePath;
      fs.accessSync(filePath, fs.F_OK); // 判断文件是否存在，不存在报错
    });
    return true;
} catch (err) {
    var dirName = path.dirname(currentFilePath);
    var fileName = path.basename(currentFilePath);
    console.log(chalk.red('Could not find a required file.'));
    console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
    console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
    return false;
}
```

## clearConsole

`clearConsole(): void`

清除控制台，希望以跨平台的方式完成。

```js
var clearConsole = require('react-dev-utils/clearConsole');

clearConsole();
console.log('刚刚清除了屏幕！');
```

### 源码分析

当前进程标准输出流对象（ process.stdout ），可写入'\x1B[2J\x1B[0f'用于windows清屏， '\x1B[2J\x1B[3J\x1B[H' 用于 Linux和macOS 清屏。

```js
function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}
```

## eslintFormatter

`eslintFormatter(results: Object): string`

这是我们定制的 ESLint 格式化程序，与 Create React App 控制台输出良好集成。
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



## FileSizeReporter

### measureFileSizesBeforeBuild

`measureFileSizesBeforeBuild(buildFolder: string): Promise<OpaqueFileSizes>`

捕获传递的 `buildFolder` 中的JS和CSS资产大小。将结果值保存下来，以便在构建后进行比较。

#### 源码分析

递归目录，记录js，css文件 gzip 压缩后的大小（对象数组，key文件目录，value是gzip后大小）。

```js
function removeFileNameHash(buildFolder, fileName) {
  // 删除文件path中的hash值，返回真实文件path
  return fileName
    .replace(buildFolder, '')
    .replace(/\\/g, '/')
    .replace(
      /\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/,
      (match, p1, p2, p3, p4) => p1 + p4 // (.*)+.js|.css => 真名，例如: print.01f2sd.chunk.js => print.js
    );
}

function measureFileSizesBeforeBuild(buildFolder) {
  return new Promise(resolve => {
    // 递归读取文件
    recursive(buildFolder, (err, fileNames) => {
      var sizes;
      if (!err && fileNames) {
        sizes = fileNames.filter(canReadAsset).reduce((memo, fileName) => {
          var contents = fs.readFileSync(fileName);
          var key = removeFileNameHash(buildFolder, fileName); // c:/d/c/print.js
          memo[key] = gzipSize(contents);
          return memo;
        }, {});
      }
      resolve({
        root: buildFolder, // c:/d/
        sizes: sizes || {},// [{'c/print.js':120}]
      });
    });
  });
}
```

### printFileSizesAfterBuild

`printFileSizesAfterBuild(webpackStats: WebpackStats, previousFileSizes: OpaqueFileSizes, buildFolder: string, maxBundleGzipSize?: number, maxChunkGzipSize?: number)`

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

#### 源码分析

主要是在控制台输出提示，提示打包后包的大小，打包后包是否比之前大或是否大于1kb，打包后的包是否查出设置的值（`maxBundleGzipSize`，`maxChunkGzipSize`）。

```js
// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
  var FIFTY_KILOBYTES = 1024 * 50;
  var difference = currentSize - previousSize;
  var fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;
  if (difference >= FIFTY_KILOBYTES) { // 大于 1kb 红色警告
    return chalk.red('+' + fileSize);
  } else if (difference < FIFTY_KILOBYTES && difference > 0) { // 如果打包后文件大于打包前（gzip后的大小），给与黄色警告
    return chalk.yellow('+' + fileSize);
  } else if (difference < 0) {
    return chalk.green(fileSize);
  } else {
    return '';
  }
}

// Prints a detailed summary of build files.
// 打印生成文件的详细摘要。
function printFileSizesAfterBuild(
  webpackStats, // Stats Data 是webpack compiler.run callback 中的参数值。详情：https://webpack.docschina.org/api/stats/
  previousSizeMap, // 打包前的文件大小（printFileSizesAfterBuild返回值）
  buildFolder,
  maxBundleGzipSize,
  maxChunkGzipSize
) {
  var root = previousSizeMap.root;
  var sizes = previousSizeMap.sizes;
  var assets = (webpackStats.stats || [webpackStats])
    .map(stats =>
      stats
        .toJson({ all: false, assets: true }) // all false 关闭返回的所有信息，assets true 只打开 assets 信息。
        .assets.filter(asset => canReadAsset(asset.name))
        .map(asset => {
          var fileContents = fs.readFileSync(path.join(root, asset.name));
          var size = gzipSize(fileContents); // 打包后大小
          var previousSize = sizes[removeFileNameHash(root, asset.name)]; // 打包前大小
          var difference = getDifferenceLabel(size, previousSize); // 根据大小值给予警告
          return {
            folder: path.join(
              path.basename(buildFolder),
              path.dirname(asset.name)
            ),
            name: path.basename(asset.name),
            size: size,
            sizeLabel:
              filesize(size) + (difference ? ' (' + difference + ')' : ''),
          };
        })
    )
    .reduce((single, all) => all.concat(single), []);
  assets.sort((a, b) => b.size - a.size);
  var longestSizeLabelLength = Math.max.apply( // 最长的一个SizeLabel数据
    null,
    assets.map(a => stripAnsi(a.sizeLabel).length) // 从字符串中去掉ANSI转义码
  );
  var suggestBundleSplitting = false;
  assets.forEach(asset => {
    var sizeLabel = asset.sizeLabel;
    var sizeLength = stripAnsi(sizeLabel).length;
    if (sizeLength < longestSizeLabelLength) {// 控制台输出，对齐最长的
      var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    var isMainBundle = asset.name.indexOf('main.') === 0;
    var maxRecommendedSize = isMainBundled // main文件和chunk文件不能超过的值。
      ? maxBundleGzipSize
      : maxChunkGzipSize;
    var isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;
    if (isLarge && path.extname(asset.name) === '.js') { 
      // 如果超了，还是js文件，则给予下边警告。
      suggestBundleSplitting = true;
    }
    console.log(
      '  ' +
        (isLarge ? chalk.yellow(sizeLabel) : sizeLabel) +
        '  ' +
        chalk.dim(asset.folder + path.sep) +
        chalk.cyan(asset.name)
    );
  });
  if (suggestBundleSplitting) {
    console.log();
    console.log(
      chalk.yellow('The bundle size is significantly larger than recommended.')
      // 包的大小比推荐的大得多。
    );
    console.log(
      chalk.yellow(
        'Consider reducing it with code splitting: https://create-react-app.dev/docs/code-splitting/'
        // 考虑使用代码分割来减少它:https://create-react-app.dev/docs/code-splitting/
      )
    );
    console.log(
      chalk.yellow(
        'You can also analyze the project dependencies: https://goo.gl/LeUzfb'
        // 您还可以分析项目依赖关系:https://goo.gl/LeUzfb
      )
    );
  }
}
```



## formatWebpackMessages

`formatWebpackMessages({errors: Array<string>, warnings: Array<string>}): {errors: Array<string>, warnings: Array<string>}`

从webpack [stats](https://github.com/webpack/docs/wiki/node.js-api#stats) 对象中提取和美化警告和错误消息。

```js
var webpack = require('webpack');
var config = require('../config/webpack.config.dev');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var compiler = webpack(config);

compiler.hooks.invalid.tap('invalid', function () {
  // 在监视编译无效时执行。此挂钩不会复制到子编译器。
  console.log('编译中...');
});

compiler.hooks.done.tap('done', function (stats) {
  // 'done' 在 compilation 完成时执行。这个钩子不会被复制到子编译器。
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

### 源码分析

在 formatMessage 方法中，格式化一些 webpack 的报错信息。

主要格式化信息有：

**Module ……(from……)** 报头信息删掉。

把解析错误转为语法错误（**Parsing error** 转为 **Syntax error:(xx:xx)**）

平滑语法错误也转为语法错误（**SyntaxError** 转为 **Syntax error:(xx:xx)**）

处理导出错误

处理文件名。

处理文件和包的详细“模块未找到”消息。

为没有安装 Sass 的报错添加有用信息。

删除 **`webpack:x:y`** 和 **`at <anonymous>`**错误（webpack内部的堆栈错误，与webpack一些信息）。

删除多余换行符等。

```js
const friendlySyntaxErrorLabel = 'Syntax error:';
function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// Cleans up webpack error messages.
function formatMessage(message) {
  let lines = [];

  if (typeof message === 'string') {
    lines = message.split('\n');
  } else if ('message' in message) {
    lines = message['message'].split('\n');
  } else if (Array.isArray(message)) {
    message.forEach(message => {
      if ('message' in message) {
        lines = message['message'].split('\n');
      }
    });
  }

  // Strip webpack-added headers off errors/warnings
  // https://github.com/webpack/webpack/blob/master/lib/ModuleError.js
  // 将webpack添加的报头从errors/warnings中去掉
  lines = lines.filter(line => !/Module [A-z ]+\(from/.test(line));

  // Transform parsing error into syntax error
  // 将解析错误转换为语法错误
  // TODO: move this to our ESLint formatter?
  lines = lines.map(line => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
      line
    );
    if (!parsingError) {
      return line;
    }
    // errorLine 错误行数 errorColumn 字符位置 errorMessage 错误信息
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });

  message = lines.join('\n');
  // Smoosh syntax errors (commonly found in CSS)
  // 平滑语法错误(在CSS中常见)
  message = message.replace(
    /SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
    // // $1 错误行数 $2 字符位置 $3 错误信息
    `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`
  );
  // Clean up export errors
  // 处理导出错误
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`
    // 尝试导入错误:'$1'未从'$2'导出
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`
    // 尝试导入错误:'$2'不包含默认导出(作为'$1'导入)
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`
    // 尝试导入错误:'$1'没有从'$3'导出(作为'$2'导入)。
  );
  lines = message.split('\n');

  // Remove leading newline
  // 删除行头换行符
  if (lines.length > 2 && lines[1].trim() === '') {
    lines.splice(1, 1);
  }
  // Clean up file name
  // 处理文件名
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');

  // Cleans up verbose "module not found" messages for files and packages.
  // 处理文件和包的详细“模块未找到”消息。
  if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      lines[1]
        .replace('Error: ', '')
        .replace('Module not found: Cannot find file:', 'Cannot find file:'),
      // 找不到模块:找不到文件
    ];
  }

  // Add helpful message for users trying to use Sass for the first time
  // 为第一次尝试使用 Sass css ,添加有用的信息
  if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
    lines[1] = 'To import Sass files, you first need to install sass.\n';
    lines[1] +=
      'Run `npm install sass` or `yarn add sass` inside your workspace.';
    // 运行' npm install sass '或' yarn add sass '在你的工作空间。';
  }

  message = lines.join('\n');
  // Internal stacks are generally useless so we strip them... with the
  // exception of stacks containing `webpack:` because they're normally
  // from user code generated by webpack. For more information see
  // 内部堆栈通常是无用的，所以我们剥离它们… 除了包含' webpack: '的堆栈，
  // 因为它们通常来自由webpack生成的用户代码。有关更多信息，请参见
  // https://github.com/facebook/create-react-app/pull/1050
  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ''
  ); // at ... ...:x:y
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, ''); // at <anonymous>
  lines = message.split('\n');

  // Remove duplicated newlines
  // 删除重复的换行符
  lines = lines.filter(
    (line, index, arr) =>
      index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim()
  );

  // Reassemble the message
  // 重新组装消息
  message = lines.join('\n');
  return message.trim();
}

function formatWebpackMessages(json) {
  // 格式化成数组，每项是一行文字
  const formattedErrors = json.errors.map(formatMessage);
  const formattedWarnings = json.warnings.map(formatMessage);
  const result = { errors: formattedErrors, warnings: formattedWarnings };
  if (result.errors.some(isLikelyASyntaxError)) {
    // 如果有 Syntax error 错误,只显示 Syntax error。
    // If there are any syntax errors, show just them.
    // 如果有任何语法错误，只显示它们。
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}
```



