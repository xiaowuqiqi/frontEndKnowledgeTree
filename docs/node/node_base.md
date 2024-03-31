---
title: process&module
nav: node
group:
  title: node笔记
  order: 0
order: 1
---

# node 笔记-process&module

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## process

`process` 是 Node.js 的全局对象，代表当前运行的进程。

## process-事件

### exit

当 Node.js 进程由于以下任一原因即将退出时，则会触发 `'exit'` 事件：

- `process.exit()` 方法被显式调用；
- Node.js 事件循环不再需要执行任何额外的工作。

> 此时没有办法阻止事件循环的退出，一旦所有 `'exit'` 监听器都运行完毕，则 Node.js 进程将终止。

> 监听器回调函数使用 [`process.exitCode`](https://nodejs.cn/api/process.html#processexitcode_1) 属性指定的退出码或传给 [`process.exit()`](https://nodejs.cn/api/process.html#processexitcode) 方法的 `exitCode` 参数调用。

```js
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

### uncaughtException

```js
/**
err <Error> 未捕获的异常。
origin <string> 指示异常是源自未处理的拒绝还是源自同步错误。可以是 'uncaughtException' 或 'unhandledRejection'。后者用于在基于 Promise 的异步上下文中发生异常（或者如果 Promise 被拒绝）并且 --unhandled-rejections 标志设置为 strict 或 throw（这是默认值）并且拒绝未被处理，或者当拒绝发生在命令行入口点的 ES 模块静态加载阶段。
*/
```

当未捕获的 JavaScript 异常一直冒泡回到事件循环时，则会触发 `'uncaughtException'` 事件。默认情况下，Node.js 通过将堆栈跟踪打印到 `stderr` 并以代码 1 退出，覆盖任何先前设置的 [`process.exitCode`](https://nodejs.cn/api/process.html#processexitcode_1) 来处理此类异常。为 `'uncaughtException'` 事件添加句柄会覆盖此默认行为。或者，更改 `'uncaughtException'` 处理程序中的 [`process.exitCode`](https://nodejs.cn/api/process.html#processexitcode_1)，这将导致进程以提供的退出码退出。否则，在存在此类句柄的情况下，进程将以 0 退出。

```js
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

## process-属性与方法

### process.pid

获取**当前进程id**。

### process.ppid

当前进程对应的**父进程进程id**。

### process.platform

获取当前进程运行的**操作系统平台信息**。

### process.uptime()

当前**进程已运行时间**，例如：pm2 守护进程的 uptime 值。

### process.title 

指定**进程名称**，有的时候需要给进程指定一个名称。

### process.env

**环境变量**，例如通过 `process.env.NODE_ENV 获取不同环境项目配置信息。

**命令行中注入变量**

如果要设置 env 在命令行中，可以使用  `cross-env` 包实现。它会兼容 Windows、Linux 和 macOS 系统。

在命令行中使用 `cross-env` 来设置 `NODE_ENV` 变量。例如：

```js
cross-env NODE_ENV=production node your_script.js
```

**加载一个变量脚本**

如果参数较多，可以单独写一个脚本，用于注入变量。

```js
// setEnv.js
process.env.WDS_SOCKET_HOST = 'localhost';
```

然后，在运行 Node.js 脚本时，**通过 `-r` 参数**来加载这个模块：

```bash
node -r ./setEnv.js your_script.js
```

这样，在运行 `your_script.js` 的时候，`setEnv.js` 中设置的环境变量就会被加载进来，可以在你的脚本中使用 `process.env.WDS_SOCKET_HOST`。

### process.cwd()

返回当前 Node **进程执行的目录**。

使用例子：

一个Node 模块 A 通过 NPM 发布，项目 B 中使用了模块 A。

在 A 中需要操作 B 项目下的文件时，就可以用 process.cwd() 来获取 B 项目的路径

#### process.cwd() 与 __dirname 的区别

cwd 是指当前 node 命令执行时所在的文件夹目录；
__dirname 是指被执行 js 文件所在的文件夹目录；

> node.js 进程当前工作的目录有可能不是该文件所在目录的完整目录。
>
> 例如：我用 node webpack ../ 打包了一个应用程序。
>
> 我用这个应用程序可以生产出一套完整的页面架构，在应用程序的配置文件中console.log(cwd)在完整的这个页面架构中执行启动这个项目的命令，则对应的cwd就是当前项目所在的绝对路径，而不是应用程序的路径。

### process.chdir()

设置当前的**工作路径**。设置后，会**改变 cwd 的值**。

**案例**

```js
console.log(path.join(process.cwd(),'../'))
// D:\demo\gitlabtest\
process.chdir(path.join(process.cwd(),'../'));

console.log(process.cwd(),__dirname)
// D:\demo\gitlabtest D:\demo\gitlabtest\nodetest\study
```

### process.argv

在终端通过 Node **执行命令**的时候，通过 process.argv 可以获取**传入的命令行参数**，返回值是一个数组：

0: Node 程序的路径（一般用不到，直接忽略）

1: 被执行的 JS 文件路径（一般用不到，直接忽略）

2~n: 真实传入命令的参数

所以，我们只要从 **process.argv[2]** 开始**获取**就好了。

```js
const args = process.argv.slice(2); // 获取传入的命令行参数
```

**案例**

注意的是，参数要在路径后边写入。

```bash
# 运行指令
cross-env WZ_TEST=prod node ./study/process.js t=test1
# 打印 process.argv
argv [
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\demo\\gitlabtest\\nodetest\\study\\process.js',
  't=test1'
]
```

### process.nextTick()

我们知道 NodeJs 是基于**事件轮询**，在这个过程中，同一时间只会处理一件事情

在这种处理模式下，**process.nextTick()** 就是定义出一个动作，并且让这个动作在**下一个事件轮询**的**时间点**上**执行**

例如，下面例子将一个foo函数在下一个时间点调用

```js
function foo() {
    console.error('foo');
}

process.nextTick(foo);
console.error('bar');
// 输出结果为bar、foo
```

虽然下述方式也能实现同样效果：

```js
setTimeout(foo, 0);
console.log('bar');
```

两者**区别**在于：

process.nextTick()会在这一次 **event loop的call stack 清空后**（下一次event loop开始前）再调用callback。

setTimeout() 是并不知道什么时候call stack清空的，所以何时调用 callback 函数是不确定的。

### 进程标准流

**三个标准流**：

process.stdout **标准输出**、 process.stdin **标准输入**、 process.stderr **标准错误输出。**

以 **stdin 为例**，它返回连接到 `stdin` (文件描述符 `0`) 的流。它是一个 [`net.Socket`](https://nodejs.cn/api/net.html#class-netsocket)（它是一个 [双工](https://nodejs.cn/api/stream.html#duplex-and-transform-streams) 流）除非 fd `0` 引用一个文件，在这种情况下它是一个 [可读](https://nodejs.cn/api/stream.html#readable-streams) 流。stdout 同理。

> 有关如何从 `stdin` 读取的详细信息，请参阅 [`readable.read()`](https://nodejs.cn/api/stream.html#readablereadsize)。

**案例**，输入多个值保存起来，输入exit退出程序。

```js
const keyboard = []

process.stdin.on('data', (chunk) => {
  let str = chunk.toString();
  str = str.replace(/\r|\n/g, ''); // 因为键盘出入的数据有 \n 和 \r 进行结尾
  if (str === 'exit')
    process.stdin.push(null)
  else {
    process.stdout.write('write:' + str);
    process.stdout.write('\n\r');
    keyboard.push(str)
  }
})

process.stdin.on('end', () => {
  process.stdout.write('您的键入值为:'+keyboard.join(','))
});
```

## child_process

`child_process` 是 Node.js 的一个核心模块，用于在 Node.js 应用程序中创建和管理子进程。这个模块提供了一些方法，允许你执行外部命令、与子进程进行通信，并控制子进程的生命周期。以下是 `child_process` 模块的一些主要功能和用途：

### spawn

**`spawn` 方法：** 用于启动一个新的进程并执行指定的命令。这是一个异步操作，可以让你与子进程进行交互。

```js
javascriptCopy codeconst { spawn } = require('child_process');

const ls = spawn('ls', ['-l', '/usr']);
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
```

### exec

**`exec` 方法：** 用于执行一个命令并缓存其输出。与 `spawn` 不同，`exec` 返回一个缓冲的输出而不是直接输出到流中。

```js
javascriptCopy codeconst { exec } = require('child_process');

exec('ls -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

### fork

**`fork` 方法：** 用于创建一个新的 Node.js 进程，并在子进程中执行指定的模块。与 `spawn` 不同，`fork` 是专门用于衍生 Node.js 进程的。

```js
javascriptCopy codeconst { fork } = require('child_process');

const child = fork('child.js');
```

### 与子进程通信

**与子进程通信：** 通过 `stdin`、`stdout`、`stderr` 来实现与子进程的双向通信。

```js
javascriptCopy codeconst { spawn } = require('child_process');

const child = spawn('node', ['child.js']);

child.stdout.on('data', (data) => {
  console.log(`Child stdout: ${data}`);
});

child.on('exit', (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});

child.stdin.write('Hello from parent!');
```

这些方法允许你在 Node.js 应用程序中与外部命令和其他 Node.js 进程进行交互，从而实现更复杂的任务和系统集成。

## node热加载方案

安装nodemon可以实现node热加载，每次保存，自动重新执行

```bash
yarn global add nodemon
```

安装完成就可以使用nodemon启动node项目了。

## module

### 导入导出

使用 require 导入模块，使用 exports 或者 module.exports 导出模块。

注意的是 exports 是 module.exports 的引用。

```js
exports === module.exports // true
```

**导出、导入**

```js
// promiseify.js
exports.promisify = promisify;
module.exports = main // 默认模块
// index
var fs = require('fs');
var path = require('path');
var {promisify} = require('./util/promiseify.js');
var main = require('./util/promiseify.js');
```

### isBuiltin()

如果模块是内置的，则返回 true，否则返回 false

```js
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false 
```
