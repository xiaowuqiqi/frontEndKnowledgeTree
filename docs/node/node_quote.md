---
title: node 其他
nav: Node
group:
  title: node笔记
  order: 0
order: 100
---

# node 其他

## Content-Type

Content-Type（内容类型），一般是指网页中存在的 Content-Type，用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件，这就是经常看到一些 PHP 网页点击的结果却是下载一个文件或一张图片的原因。

Content-Type 标头告诉客户端实际返回的内容的内容类型。

更多参考：https://www.runoob.com/http/http-content-type.html

### request中常用

设置为 **none**，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2'
```

设置为 **form-data**，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--form 'test="hahahahahahhaa"' \
--form 'nihao="[1,2,3]"' \
--form 'teshi=""'
```

设置为 **x-www-form-urlencoded**，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'nihao=[1,2,3]' \
--data-urlencode 'test=zsdfasdf'
```

设置为 **application/json** (属于 raw 大类)，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "test":"hahahha",
    "test2":[1,2,3]
}'
```

设置为 **application/javascript** (属于 raw 大类)，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--header 'Content-Type: application/javascript' \
--data-raw 'function test(){
    console.log('\''test'\'')
}
test()'
```

设置为 **text/html** (属于 raw 大类)，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--header 'Content-Type: text/html' \
--data-raw '<div>1</div>'
```

设置为 **text/plain** (属于 raw 大类)，curl 为：

```js
curl --location --request POST 'http://localhost:8080/test1?a=1&a=2' \
--header 'Content-Type: text/plain' \
--data-raw '123123test1'
```



## util

### promisify

采用遵循常见的错误优先的回调风格的函数（也就是将 `(err, value) => ...` 回调作为最后一个参数），并返回一个返回 promise 的版本。

```js
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
}); 
```

**自己构建异步函数**

自己构建异步函数时，注意的是参数定义 n 个（不包括callback），调用时就要传入 n 个。调用时不能少传入参数，如果需要默认值参数，则需要特殊处理。

```js
const {promisify} = require('node:util')

const delayFn = promisify((...arg) => {// node 中 arguments 不在是方法参数数组。
  let callback = arg[arg.length - 1]; // 最后一个参数都会传入 callback。
  const [time = 2000] = arg.slice(0, -1); // 其他参数，如果没有赋值默认值。
  setTimeout(() => {
    callback(null, 'data')
  }, time)
})
delayFn().then((data) => {
  console.log(data)
})
```



## node 引用包整理

### recursive-readdir

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

### body-parser

用于 node http 请求体数据解析。解析数据，会填充到 req.body 中。

安装

```
npm install body-parser
```

github:https://github.com/expressjs/body-parser

**bodyParser.json()**

返回仅解析`json`并仅查看`Content-Type`标头与选项匹配的请求的中间件`type`。该解析器接受正文的任何 Unicode 编码，并支持自动扩展`gzip`和 `deflate`编码。

**bodyParser.raw()**

返回将所有body解析为Buffer的中间件，并且只查看Content-Type头与类型选项匹配的请求。此解析器支持gzip和deflate编码的自动膨胀。

**bodyParser.text()**

返回将所有body解析为字符串的中间件，并且只查看Content-Type头与类型选项匹配的请求。此解析器支持gzip和deflate编码的自动膨胀。

**bodyParser.urlencoded()**

返回只解析urlencoded主体的中间件，并且只查看Content-Type头与类型选项匹配的请求。该解析器只接受正文的UTF-8编码，并支持gzip和deflate编码的自动膨胀。

案例

```js
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
})
```

案例2：仅用于 node 中时，可以使用 promisify 封装。

```js
const http = require('node:http');
const querystring = require('node:querystring');
const bodyParser = require('body-parser');
const {promisify} = require('node:util');

const bodyJsonParser = bodyParser.json();
const bodyJsonParserPromise = promisify(bodyJsonParser)
const bodyJoin = async (req, res) => {
  await bodyJsonParserPromise(req, res)
  return req.body;
}

const post = async (req, res) => {
  let data = await bodyJoin(req, res);
  console.log('data', data);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify({
    isSucceed: true,
    message: data
  }));
}
```

### multer

Multer 是一个 node.js 中间件，用于处理 `multipart/form-data` 类型的表单数据，它主要用于上传文件。它是写在 [busboy](https://github.com/mscdex/busboy) 之上非常高效。

安装

```
npm install --save multer
```

github：https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md

Multer 会添**加一个 `body` 对象** 以及 **`file` 或 `files` 对象** 到 express 的 **`request` 对象**中。 `body` 对象包含表单的文本域信息，`file` 或 `files` 对象包含对象表单上传的文件信息。

基本使用方法:

```js
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files 是 `photos` 文件数组的信息
  // req.body 将具有文本域数据，如果存在的话
})

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files 是一个对象 (String -> Array) 键是文件名，值是文件数组
  //
  // 例如：
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body 将具有文本域数据，如果存在的话
})
```

如果你需要处理一个只有文本域的表单，你应当使用 `.none()`:

```js
const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer()

app.post('/profile', upload.none(), function (req, res, next) {
  // req.body 包含文本域
})
```

**API**

**`multer(opts)`** 的 opts 中可以传入：

| Key                 | Description                        |
| ------------------- | ---------------------------------- |
| `dest` or `storage` | 在哪里存储文件                     |
| `fileFilter`        | 文件过滤器，控制哪些文件可以被接受 |
| `limits`            | 限制上传的数据                     |
| `preservePath`      | 保存包含文件名的完整文件路径       |

通常，一般的网页应用，只需要设置 `dest` 属性，像这样：

```js
const upload = multer({ dest: 'uploads/' })
```

上边 **upload** 可以使用一些方法：

 **`.single(fieldname)`** 接受一个以 `fieldname` 命名的文件。这个文件的信息保存在 `req.file`。

 **`.array(fieldname[, maxCount])`** 受一个以 `fieldname` 命名的文件数组。可以配置 `maxCount` 来限制上传的最大数量。这些文件的信息保存在 `req.files`。

**`.fields(fields)`** 接受指定 `fields` 的混合文件。这些文件的信息保存在 `req.files`。

`fields` 应该是一个对象数组，应该具有 `name` 和可选的 `maxCount` 属性。

```js
[
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]
```

**`.none()`**只接受文本域。如果任何文件上传到这个模式，将发生 "LIMIT_UNEXPECTED_FILE" 错误。这和 `upload.fields([])` 的效果一样。

**`.any()`**接受一切上传的文件。文件数组将保存在 `req.files`。

> **警告:** 确保你总是处理了用户的文件上传。 永远不要将 multer 作为全局中间件使用，因为恶意用户可以上传文件到一个你没有预料到的路由，应该只在你需要处理上传文件的路由上使用。

**磁盘存储引擎 (`DiskStorage`)**

磁盘存储引擎可以让你控制文件的存储。

```js
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })
```



有两个选项可用，`destination` 和 `filename`。他们都是用来确定文件存储位置的函数。

`destination` 是用来确定上传的文件应该存储在哪个文件夹中。也可以提供一个 `string` (例如 `'/tmp/uploads'`)。如果没有设置 `destination`，则使用操作系统默认的临时文件夹。

**注意:** 如果你提供的 `destination` 是一个函数，你需要负责创建文件夹。当提供一个字符串，multer 将确保这个文件夹是你创建的。

`filename` 用于确定文件夹中的文件名的确定。 如果没有设置 `filename`，每个文件将设置为一个随机文件名，并且是没有扩展名的。

**注意:** Multer 不会为你添加任何扩展名，你的程序应该返回一个完整的文件名。

每个函数都传递了请求对象 (`req`) 和一些关于这个文件的信息 (`file`)，有助于你的决定。

注意 `req.body` 可能还没有完全填充，这取决于向客户端发送字段和文件到服务器的顺序。

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
