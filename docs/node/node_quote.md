---
title: node 引用包整理
nav: node
group:
  title: node笔记
  order: 0
order: 100
---

# node 引用包整理

## recursive-readdir

递归列出目录及其子目录中的所有文件。它不列出目录本身。

> 因为它使用 fs.readdir，它在 OS X 和 Linux 上调用[readdir ，所以](http://linux.die.net/man/3/readdir)[不能保证](http://stackoverflow.com/questions/8977441/does-readdir-guarantee-an-order)目录内文件的顺序。

**安装**

```
npm install recursive-readdir
```

**用法**

```js
var recursive = require("recursive-readdir");

recursive("some/path", function (err, files) {
  // 'files' 是一个文件路径数组
  console.log(files);
});
```

它还可以获取要忽略的文件列表。

```js
var recursive = require("recursive-readdir");
// 忽略名为"foo.cs"或以".html"结尾的文件。
recursive("some/path", ["foo.cs", "*.html"], function (err, files) {
  console.log(files);
});
```

您还可以传递调用的函数来确定是否忽略文件：

```js
var recursive = require("recursive-readdir");

function ignoreFunc(file, stats) {
  // `file` is the path to the file, and `stats` is an `fs.Stats`
  // object returned from `fs.lstat()`.
  return stats.isDirectory() && path.basename(file) == "test";
}

// 忽略名为"foo.cs"的文件和名为test的目录的后代
recursive("some/path", ["foo.cs", ignoreFunc], function (err, files) {
  console.log(files);
});
```

**promise**

您可以省略回调并返回一个promise。

```
var recursive = require("recursive-readdir");

recursive("some/path").then(
  function(files) {
    console.log("files are", files);
  },
  function(error) {
    console.error("something exploded", error);
  }
);
```



## **备注**

asynclocalstorage ⭐⭐ k4

crypto 加密

dgram（UDP） 数据报

event 事件触发器 ⭐⭐⭐ k4

fs ⭐⭐⭐⭐k

global ⭐⭐⭐k2

process ⭐⭐⭐⭐ k2

http ⭐⭐⭐⭐ k3

module 模块 ⭐⭐⭐k2

ES 模块和 CommonJS 的区别 ⭐⭐⭐k2

path 路径 ⭐⭐⭐⭐ k

stream & stream/web  ⭐⭐

os 操作系统 ⭐⭐ k4

url ⭐⭐⭐⭐ k

net（TCP 或 IPC） ⭐ k3

zlib 压缩

util ⭐⭐⭐k4

cli ⭐⭐

dns
