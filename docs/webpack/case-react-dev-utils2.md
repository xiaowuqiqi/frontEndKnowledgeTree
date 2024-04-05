---
title: react-dev-utils详解2
nav: Webpack
group:
  title: react-scripts
  order: 5
order: 2
---
# react-dev-utils详解2

reacte-scripts 很多功能都依赖了 react-dev-utils 包的方法，react-dev-utils 是对webpack配置的一些封装，它也可以单独使用，本章节主要介绍 react-dev-utils 包一些常见的方法。

react-dev-utils 没有单一的入口点。您只能导入各个顶层模块。

## printBuildError

`printBuildError(error: Object): void`

美化一些已知的构建错误。将一个错误对象传递给它，以在控制台中记录漂亮的错误消息。

```js
const printBuildError = require('react-dev-utils/printBuildError');
try {
  build()
} catch(e) {
  printBuildError(e) // 记录漂亮的消息
}
```

### 源码解析

```js
const chalk = require('chalk');

module.exports = function printBuildError(err) {
  const message = err != null && err.message;
  const stack = err != null && err.stack;

  // Add more helpful message for Terser error
  // 为简洁错误添加更多有用的消息
  if (
    stack &&
    typeof message === 'string' &&
    message.indexOf('from Terser') !== -1
  ) {
    try {
      const matched = /(.+)\[(.+):(.+),(.+)\]\[.+\]/.exec(stack);
      // 在控制流中使用错误是不好的。
      if (!matched) {
        // 对控制流使用错误是不好的
        throw new Error('Using errors for control flow is bad.');
      }
      const problemPath = matched[2];
      const line = matched[3];
      const column = matched[4];
      console.log(
        // 未能缩小此文件中的代码
        'Failed to minify the code from this file: \n\n',
        chalk.yellow(
          `\t${problemPath}:${line}${column !== '0' ? ':' + column : ''}`
        ),
        '\n'
      );
    } catch (ignored) {
      // 最小化bundle失败。
      console.log('Failed to minify the bundle.', err);
    }
    console.log('Read more here: https://cra.link/failed-to-minify');
  } else {
    console.log((message || err) + '\n');
  }
  console.log();
};
```

## getProcessForPort

`getProcessForPort(port: number): string`

查找在 `port` 上当前运行的进程。返回一个包含名称和目录的字符串，例如：

```
create-react-app
in /Users/developer/create-react-app
```

```js
var getProcessForPort = require('react-dev-utils/getProcessForPort');

getProcessForPort(3000);
```

### 源码解析

输入进程号，打印进程对应ProcessId，对应的目录地址（项目地址），进程名字（package.name）

```js
// child_process 用于程序中创建和管理子进程。
var execSync = require('child_process').execSync;
var execFileSync = require('child_process').execFileSync;

function getPackageNameInDirectory(directory) {
  var packagePath = path.join(directory.trim(), 'package.json');
  try {
    return require(packagePath).name;
  } catch (e) {
    return null;
  }
}
// 输入进程号，输出ProcessId
function getProcessIdOnPort(port) {
  return execFileSync(
    'lsof',
    ['-i:' + port, '-P', '-t', '-sTCP:LISTEN'],
    execOptions
  )
    // 在指定的端口上查找正在监听的进程，并返回相应的进程ID（PID）。
    // 这对于检查端口是否被占用以及查找占用该端口的进程非常有用。
    .split('\n')[0]
    .trim();
}
// 过滤出对应进程id的目录地址
function getDirectoryOfProcessById(processId) {
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  ).trim();
}

function getProcessCommand(processId, processDirectory) {
  var command = execSync(
    'ps -o command -p ' + processId + ' | sed -n 2p',
    execOptions
  );

  command = command.replace(/\n$/, '');

  if (isProcessAReactApp(command)) {
    // packageName => package.name
    const packageName = getPackageNameInDirectory(processDirectory);
    return packageName ? packageName : command;
  } else {
    return command;
  }
}

function getProcessForPort(port) {
  try {
      // 进程对应的id
    var processId = getProcessIdOnPort(port);
      // 运行目录地址
    var directory = getDirectoryOfProcessById(processId);
      // 进程名字或者package.name
    var command = getProcessCommand(processId, directory);
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    );
  } catch (e) {
    return null;
  }
}
```

## launchEditor

`launchEditor(fileName: string, lineNumber: number): void`

在macOS上，尝试找到已知的运行编辑器进程，并在其中打开文件。还可以通过 `REACT_EDITOR`、`VISUAL` 或 `EDITOR` 环境变量进行显式配置。例如，您可以在 `.env.local` 文件中放置 `REACT_EDITOR=atom`，Create React App 将尊重该配置。

## noopServiceWorkerMiddleware

`noopServiceWorkerMiddleware(servedPath: string): ExpressMiddleware`

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

