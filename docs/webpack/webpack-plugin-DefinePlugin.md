---
title: DefinePlugin
nav: webpack
group:
  title: plugin
  order: 5
order: 4
---
# DefinePlugin

`DefinePlugin` 允许在 **编译时** 将你代码中的变量替换为其他值或表达式。这在需要根据开发模式与生产模式进行不同的操作时，非常有用。

## **规则**

传递给 `DefinePlugin` 的每个键都是一个标识符或多个以 `.` 连接的标识符。

- 如果该值为字符串，它将被作为代码片段来使用。
- 如果该值不是字符串，则将被转换成字符串（包括函数方法）。
- 如果值是一个对象，则它所有的键将使用相同方法定义。
- 如果键添加 `typeof` 作为前缀，它会被定义为 typeof 调用。

例如

```js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify('5fa3b9'),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1',
  'typeof window': JSON.stringify('object'),// 在代码中执行 typeof window 时返回 object
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});
```

> 在为 `process` 定义值时，
>
> `'process.env.NODE_ENV': JSON.stringify('production')` 会比
>
>  `process: { env: { NODE_ENV: JSON.stringify('production') } }` 更好，
>
> 后者会**覆盖 `process` 对象**，这可能会破坏与某些模块的兼容性，
>
> 因为这些模块会在 process 对象上定义其他值。

请注意，由于本插件会**直接替换文本**，因此提供的值必须在字符串本身中再包含一个**实际的引号** 。通常，可以使用类似 `'"production"'` 这样的替换引号，**或者**直**接用 `JSON.stringify('production')`。**

## 用于 process.env 变量注入

使用 `process.env.WDS_SOCKET_HOST` 可以从 Node.js 进程环境中获取一个名为 `WDS_SOCKET_HOST` 的环境变量的值。然后，通过 `DefinePlugin` 将这个值注入到 Webpack 编译过程中，使得代码中可以直接引用这个值。

举个例子，假设在你的开发环境中，你希望 Webpack Dev Server 的主机地址为 `localhost`，而在生产环境中，你希望它为你的生产服务器的地址。你可以这样设置环境变量：

```bash
# 开发环境
export WDS_SOCKET_HOST=localhost;
# 生产环境
export WDS_SOCKET_HOST=your_production_server_address;
```

然后，在 Webpack 配置中使用 `DefinePlugin`：

```js
webpack.DefinePlugin({
  'process.env.WDS_SOCKET_HOST': JSON.stringify(process.env.WDS_SOCKET_HOST)
});
```

这样做之后，Webpack 就会根据当前环境的 `WDS_SOCKET_HOST` 环境变量的值将其注入到代码中，使得代码在不同环境下可以正确地获取到相应的主机地址。

## **在node中不同的 process 使用方式**

**加载一个变量脚本**

```js
// setEnv.js
process.env.WDS_SOCKET_HOST = 'localhost';
```

然后，在运行 Node.js 脚本时，通过 `-r` 参数来加载这个模块：

```bash
bashCopy code
node -r ./setEnv.js your_script.js
```

这样，在运行 `your_script.js` 的时候，`setEnv.js` 中设置的环境变量就会被加载进来，可以在你的脚本中使用 `process.env.WDS_SOCKET_HOST`。

**在 package.json 指令中加入变量**

在 package.json 中的 scripts 部分，你可以像这样设置你的脚本：

```json
{
  "scripts": {
    "start": "NODE_ENV=development webpack-dev-server",
    "build": "NODE_ENV=production webpack"
  }
}
```

