---
title: Compiler
nav: webpack
group:
  title: 基础
  order: 0
order: 1.1
---
# Compiler

`Compiler` 模块是 webpack 的主要引擎，它通过 [CLI](https://www.webpackjs.com/api/cli) 或者 [Node API](https://www.webpackjs.com/api/node) 传递的所有选项**创建出一个 compilation 实例**。 它**继承**（extends）自 **`Tapable` 类**，用来**注册**和**调用插件**。 大多数面向用户的插件会首先在 `Compiler` 上注册。

> 在为 webpack 开发插件时，你可能需要知道每个钩子函数是在哪里调用的。想要了解这些内容，请在 webpack 源码中搜索 `hooks.<hook name>.call`。

## 检索遍历资源、chunk、模块和依赖

在执行完成编译的封存阶段后，编译的所有结构都可以遍历。

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      // 检索每个（构建输出的）chunk：
      compilation.chunks.forEach((chunk) => {
        // 检索 chunk 中（内置输入的）的每个模块：
        chunk.getModules().forEach((module) => {
          // 检索模块中包含的每个源文件路径：
          module.buildInfo &&
            module.buildInfo.fileDependencies &&
            module.buildInfo.fileDependencies.forEach((filepath) => {
              // 我们现在已经对源结构有不少了解……
            });
        });

        // 检索由 chunk 生成的每个资源文件名：
        chunk.files.forEach((filename) => {
          // 获取 chunk 生成的每个文件的资源源代码：
          var source = compilation.assets[filename].source();
        });
      });

      callback();
    });
  }
}
module.exports = MyPlugin;
```



## hooks

以下生命周期钩子函数，是由 `compiler` 暴露， 可以通过如下方式访问：

```js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

取决于不同的钩子类型，也可以在某些钩子上访问 `tapAsync` 和 `tapPromise`。

### environment

SyncHook

在编译器**准备环境时**调用，时机就在配置文件中**初始化插件之后**。

### afterEnvironment $#afterEnvironment$

```
SyncHook
```

当编译器**环境设置完成后**，在 `environment` hook 后直接调用。

### entryOption

```
SyncBailHook
```

在 webpack 选项中的 **[`entry`](https://www.webpackjs.com/configuration/entry-context/#entry) 被处理过之后**调用。

- 回调参数：[`context`](https://www.webpackjs.com/configuration/entry-context/#context), [`entry`](https://www.webpackjs.com/configuration/entry-context/#entry)

```js
compiler.hooks.entryOption.tap('MyPlugin', (context, entry) => {
  /* ... */
});
```

### afterPlugins

```
SyncHook
```

在初始化内部**插件**集合**完成设置之后**调用。

- 回调参数：`compiler`

### afterResolvers

```
SyncHook
```

**resolver 设置完成**之后触发。

- 回调参数：`compiler`

### initialize

```
SyncHook
```

当**编译器对象**被**初始化**时调用。

### beforeRun

```
AsyncSeriesHook
```

在开始执行一次**构建之前**调用，compiler.run 方法开始执行后立刻进行调用。

- 回调参数：`compiler`

### run

```
AsyncSeriesHook
```

在开始**读取 [`records`](https://www.webpackjs.com/configuration/other-options/#recordspath) 之前**调用。

- 回调参数：`compiler`

### watchRun

```
AsyncSeriesHook
```

在监听模式下，一个新的 compilation 触发之后，但在 compilation 实际开始之前执行。

- 回调参数：`compiler`

### normalModuleFactory

```
SyncHook
```

[NormalModuleFactory](https://www.webpackjs.com/api/normalmodulefactory-hooks) 创建之后调用。

- 回调参数：`normalModuleFactory`

### contextModuleFactory

```
SyncHook
```

[ContextModuleFactory](https://www.webpackjs.com/api/contextmodulefactory-hooks) 创建之后调用。

- 回调参数：`contextModuleFactory`

### beforeCompile

```
AsyncSeriesHook
```

在**创建 compilation** parameter **之后**执行。

- 回调参数：`compilationParams`

初始化 `compilationParams` 变量的示例如下：

```js
compilationParams = {
  normalModuleFactory,
  contextModuleFactory,
};
```

此钩子可用于添加/修改 compilation parameter：

```js
compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
  params['MyPlugin - data'] = 'important stuff my plugin will use later';
  callback();
});
```

### compile

```
SyncHook
```

`beforeCompile` 之后立即调用，但在一个**新的 compilation 创建之前**。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`compilationParams`

### thisCompilation

```
SyncHook
```

**初始化 compilation 时调用**，在触发 **`compilation` 事件之前**调用。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`compilation`, `compilationParams`

### compilation

```
SyncHook
```

**compilation 创建之后**执行。

- 回调参数：`compilation`, `compilationParams`

### make

```
AsyncParallelHook
```

**compilation 结束之前执行**。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`compilation`

### afterCompile

```
AsyncSeriesHook
```

**compilation 结束**和封印之后执行。

- 回调参数：`compilation`

### shouldEmit

```
SyncBailHook
```

在输出 asset 之前调用。返回一个布尔值，告知是否输出。

- 回调参数：`compilation`

```js
compiler.hooks.shouldEmit.tap('MyPlugin', (compilation) => {
  // 返回 true 以输出 output 结果，否则返回 false
  return true;
});
```

### emit

```
AsyncSeriesHook
```

**输出 asset** 到 **output 目录之前**执行。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`compilation`

### afterEmit

```
AsyncSeriesHook
```

**输出 asset** 到 **output 目录之后**执行。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`compilation`

### assetEmitted

```
AsyncSeriesHook
```

在 asset 被输出时执行。此钩子可以访问被输出的 asset 的相关信息，例如它的输出路径和字节内容。

- 回调参数：`file`, `info`

例如，可以通过 `info.content` 访问 asset 的内容 buffer：

```js
compiler.hooks.assetEmitted.tap(
  'MyPlugin',
  (file, { content, source, outputPath, compilation, targetPath }) => {
    console.log(content); // <Buffer 66 6f 6f 62 61 72>
  }
);
```

### done

```
AsyncSeriesHook
```

在 compilation 完成时执行。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`stats`

### additionalPass

```
AsyncSeriesHook
```

This hook allows you to do a one more additional pass of the build.

### failed

```
SyncHook
```

在 **compilation 失败**时调用。

- 回调参数：`error`

### invalid

```
SyncHook
```

在一个观察中的 compilation 无效时执行。这个钩子 *不会* 被复制到子编译器。

- 回调参数：`fileName`, `changeTime`

### watchClose

```
SyncHook
```

在一个观察中的 compilation 停止时执行。

### shutdown

```
AsyncSeriesHook
```

当编译器关闭时调用。

### infrastructureLog

```
SyncBailHook
```

在配置中启用 [`infrastructureLogging` 选项](https://www.webpackjs.com/configuration/other-options/#infrastructurelogging) 后，允许使用 infrastructure log(基础日志)。

- 回调参数：`name`, `type`, `args`

### log

```
SyncBailHook
```

启用后允许记录到 [stats](https://www.webpackjs.com/configuration/stats/) 对象，请参阅 [`stats.logging`, `stats.loggingDebug` 和 `stats.loggingTrace` 选项](https://www.webpackjs.com/configuration/stats/#stats-options)。

- 回调参数：`origin`, `logEntry`



## 监听

`Compiler` 支持可以监控文件系统的 [监听(watching)](https://www.webpackjs.com/api/node/#watching) 机制，并且在文件修改时重新编译。 

当处于监听模式(watch mode)时， compiler 会触发诸如 `watchRun`, `watchClose` 和 `invalid` 等额外的事件。 通常在 [开发环境](https://www.webpackjs.com/guides/development) 中使用， 也常常会在 `webpack-dev-server` 这些工具的底层调用， 由此开发人员无须每次都使用手动方式重新编译。 

还可以通过 [CLI](https://www.webpackjs.com/api/cli/#watch-options) 进入监听模式。

> 运行 webpack 并且监听文件变化。
>
> ```bash
> npx webpack watch [options]
> ```
>
> **示例**
>
> ```bash
> npx webpack watch --mode development
> ```

调用 `watch` 方法会触发 webpack 执行，但之后会监听变更（很像 CLI 命令: `webpack --watch`）， 一旦 webpack 检测到文件变更，就会重新执行编译。 该方法返回一个 `Watching` 实例。

```js
const webpack = require('webpack');

const compiler = webpack({
  // ...
});

const watching = compiler.watch(
  {
    // 示例
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {
    // 这里打印 watch/build 结果...
    console.log(stats);
  }
);
```
