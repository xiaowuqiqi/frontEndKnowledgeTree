---
title: path&require
nav: Node
group:
  title: node笔记
  order: 0
order: 2
---

# node 笔记-path&require

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## Path-常用的三个常量

### __dirname

当前**模块**的**目录名**。这与 [`__filename`](https://nodejs.cn/api/modules.html#__filename) 的 [`path.dirname()`](https://nodejs.cn/api/path.html#pathdirnamepath) 相同。

示例：从 `/Users/mjr` 运行 `node example.js`

```js
console.log(__dirname);
// Prints: /Users/mjr
console.log(path.dirname(__filename));
// Prints: /Users/mjr
```

### __filename

当前**模块**的**文件名**。这是**当前模块文件**的**已解析符号链接**的**绝对路径**。

对于主程序，这不一定与命令行中使用的文件名相同。

> 当前模块的目录名见 [`__dirname`](https://nodejs.cn/api/modules.html#__dirname)。

示例：从 `/Users/mjr` 运行 `node example.js`

```js
console.log(__filename);
// Prints: /Users/mjr/example.js
console.log(__dirname);
// Prints: /Users/mjr
```

给定两个模块：`a` 和 `b`，其中 `b` 是 `a` 的依赖，目录结构为：

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

在 `b.js` 中对 `__filename` 的引用将返回 `/Users/mjr/app/node_modules/b/b.js`，而在 `a.js` 中对 `__filename` 的引用将返回 `/Users/mjr/app/a.js`。

### process.cwd()

返回当前 Node **进程执行的目录**。

使用**例子**：

一个Node 模块 A 通过 NPM 发布，项目 B 中使用了模块 A。

在 A 中需要操作 B 项目下的文件时，就可以用 process.cwd() 来获取 B 项目的路径

#### **process.chdir()**

设置当前的工作路径。设置后，会改变 cwd 的值。

**案例**

```js
console.log(path.join(process.cwd(),'../'))
// D:\demo\gitlabtest\
process.chdir(path.join(process.cwd(),'../'));

console.log(process.cwd(),__dirname)
// D:\demo\gitlabtest D:\demo\gitlabtest\nodetest\study
```



### process.cwd() 与 __dirname 的区别

cwd 是指当前 node 命令执行时所在的文件夹目录；
__dirname 是指被执行 js 文件所在的文件夹目录；

> node.js 进程当前工作的目录有可能不是该文件所在目录的完整目录。
>
> 例如：我用 node webpack ../ 打包了一个应用程序。
>
> 我用这个应用程序可以生产出一套完整的页面架构，在应用程序的配置文件中console.log(cwd)在完整的这个页面架构中执行启动这个项目的命令，则对应的cwd就是当前项目所在的绝对路径，而不是应用程序的路径。

### ES模块中区别

**无 `__filename` 或 `__dirname`**

这些 CommonJS 变量在 ES 模块中不可用。

`__filename` 和 `__dirname` 用例可以通过 [`import.meta.filename`](https://nodejs.cn/api/esm.html#importmetafilename) 和 [`import.meta.dirname`](https://nodejs.cn/api/esm.html#importmetadirname) 复制。

## 方法

### basename()

```js
path.basename(path[, suffix])
/**
path <string>
suffix <string> 要删除的可选后缀
返回：<string>
*/
```

`path.basename()` 方法**返回** `path` 的**最后一部分**，类似于 Unix `basename` 命令。忽略尾随 [目录分隔符](https://nodejs.cn/api/path.html#pathsep)。

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux' 
```

### dirname()

`path.dirname()` 方法**返回** `path` 的**目录名**(前半部分)，类似于 Unix `dirname` 命令。尾随的目录分隔符被忽略，见 [`path.sep`](https://nodejs.cn/api/path.html#pathsep)。

```js
path.dirname('/foo/bar/baz/asdf/quux');
// Returns: '/foo/bar/baz/asdf' 
```

### extname()

`path.extname()` 方法返回 `path` 的**扩展名**，即 `path` 的最后一部分中从**最后一次出现的 `.`**（句点）字符到字符串的结尾。

> 如果 `path` 的最后一部分中没有 `.`，或者除了 `path` 的基本名称（参见 `path.basename()`）的第一个字符之外没有 `.` 个字符，则返回空字符串。

```js
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md' 
```

### format()

```js
path.format(pathObject)
/**
pathObject <Object> 任何具有以下属性的 JavaScript 对象：
	dir <string>
	root <string>
	base <string>
	name <string>
	ext <string>
返回：<string>
*/
```

`path.format()` 方法**从对象返回路径字符串**。这与 [`path.parse()`](https://nodejs.cn/api/path.html#pathparsepath) 相反。

当向 `pathObject` 提供属性时，存在一个属性优先于另一个属性的组合：

- 如果提供 `pathObject.dir`，则忽略 `pathObject.root`。
- 如果 `pathObject.base` 存在，则忽略 `pathObject.ext` 和 `pathObject.name`。

例如，在 POSIX 上：

```js
// If `dir`, `root` and `base` are provided,
// `${dir}${path.sep}${base}`
// will be returned. `root` is ignored.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Returns: '/home/user/dir/file.txt'

// `root` will be used if `dir` is not specified.
// If only `root` is provided or `dir` is equal to `root` then the
// platform separator will not be included. `ext` will be ignored.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Returns: '/file.txt'

// `name` + `ext` will be used if `base` is not specified.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Returns: '/file.txt'

// The dot will be added if it is not specified in `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Returns: '/file.txt' 
```

### parse()

`path.parse()` 方法返回一个对象，其属性表示 `path` 的重要元素。尾随的目录分隔符被忽略，见 [`path.sep`](https://nodejs.cn/api/path.html#pathsep)。

返回的对象将具有以下属性：`dir`,`root`,`base`,`name`,`ext`。

例如，在 POSIX 上：

```js
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 
```

### normalize()

`path.normalize()` 方法规范化给定的 `path`，解析 `'..'` 和 `'.'` 片段。

例如，在 POSIX 上：

```js
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf' 
```

在 Windows 上：

```js
path.normalize('C:\\temp\\\\foo\\bar\\..\\'); // 删除多余的 /
// Returns: 'C:\\temp\\foo\\' 
```

### isAbsolute()

`path.isAbsolute()` 方法确定 `path` **是否**为**绝对路径**。

```js
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false 
```



### path.join()

`path.join()` 方法使用平台特定的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。

> 如果连接的路径字符串是零长度字符串，则将返回 `'.'`，表示当前工作目录。

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'
```

用于获取文件路径

```js
const getPath = (dir) => path.join(__dirname, dir)

getPath('./src') // 当前文件下的src目录
```

### path.relative()

根据当前**工作目录**查找从**给定路径**到**另一个路径**的**相对路径**。（左边路径到右边路径，返回相对路径）

注意，两个路径有 './' 或没有 './' 时，都会拼接当前工作目录。

```js
path.relative("geeks/website", "geeks/index.html"); 
// ..\index.html 需要退后一层，然后查找index.html
   
path.relative("users/admin", "admin/files/website"); 
// ..\..\admin\files\website 
// 退后两层，relative 认为两个路径都是相对于工作目录的路径，
// 所以认为 /WINDOWS/system32 和 /WINDOWS/system32/users/ 中都有一个 admin
```

#### 判断一个目录不在另一个目录中

案例，用于判断一个目录不在另一个目录中

```js
const relative = path.relative(appSrc, request.context.issuer);
// 如果它不在我们的 app src 或子目录中，返回 true
return relative.startsWith('../') || relative.startsWith('..\\');
```

### path.resolve()

`path.resolve()` 方法将**路径**或**路径片段**的序列解析为**绝对路径**。

给定的路径序列从**右到左处理**，每个后续的 `path` 会被追加到前面，**直到**构建**绝对路径**。

> 例如，给定路径段的顺序：`/foo`、`/bar`、`baz`，调用 `path.resolve('/foo', '/bar', 'baz')` 将返回 `/bar/baz`，因为从右往左执行到 /bar 时已经是绝对路径了。

如果在处理完所有给定的 `path` 片段之后，**还没有**生成**绝对路径**，则使用**当前工作目录（就是cwd()）**。

> 生成的路径被规范化，并删除尾部斜杠（除非路径解析为根目录）。

相当于 cd ，而 join 只是拼装路径。

```js
path.resolve('/foo/bar','./baz');
相当于：
cd /foo/bar //此时当前路径为 /foo/bar
cd ./baz //此时路径为 /foo/bar/baz
////////////////////////////////
path.resolve('/foo/bar', '/tmp/file/');
相当于：
cd /foo/bar //此时路径为 /foo/bar
cd /tmp/file/ //此时路径为 /tmp/file
////////////////////////////////
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');// 如果当前工作目录（ process.cwd() ）为 /home/myself/node，
相当于：
cd wwwroot //此时路径为/home/myself/node/wwwroot
cd static_files/png/ //此时路径为/home/myself/node/wwwroot/static_files/png/
cd ../gif/image.gif //这里用cd描述其实是不对的。。。。此时路径为/home/myself/node/wwwroot/static_files/gif/image.gif
```

### sep

提供特定于平台的路径片段分隔符：

- Windows 上是 `\`
- POSIX 上是 `/`

例如，在 POSIX 上：

```js
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz'] 拷贝
```

在 Windows 上：

```js
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz'] 拷贝
```

在 Windows 上，正斜杠 (`/`) 和反斜杠 (`\`) 都被接受为路径段分隔符；但是，`path` 方法仅添加反斜杠 (`\`)。

### win32

`path.win32` 属性提供对 `path` 方法的 Windows 特定实现的访问。

### 符号链接

使用 fs.realpathSync 可以快速找到符号链接的真实地址。

```js
const appDirectory = fs.realpathSync(process.cwd()); // 如果当前工作目录在符号链接中就会报错，所以使用 realpathSync 找到真实路径
```

### 封装路径建议

如果封装一个路径工具，建议使用 path.resolve 而不是 join ，因为 path.resolve 在**用户传入绝对路径**的参数后，可以**覆盖默认的路径**，直接采用用户传入路径。

```js
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = ...relativePath => path.resolve(appDirectory, ...relativePath);
// 使用
resolveApp('abc') // process.cwd() + abc
resolveApp('__dirname','abc') // __dirname + abc // '__dirname' 是绝对路径，覆盖 process.cwd()
```

## require

### require(id)

用于导入模块、`JSON` 和本地文件。模块可以从 `node_modules` 导入。可以使用相对路径（例如 `./`、`./foo`、`./bar/baz`、`../foo`）导入本地模块和 JSON 文件，该路径将根据 [`__dirname`](https://nodejs.cn/api/modules.html#__dirname)（如果有定义）命名的目录或当前工作目录进行解析。POSIX 风格的相对路径以独立于操作系统的方式解析，这意味着上面的示例将在 Windows 上以与在 Unix 系统上相同的方式工作。

```js
// 导入一个本地模块，其路径相对于'__dirname'或current
// 工作目录。(在Windows上，这将解析为 .\path\myLocalModule。)
const myLocalModule = require('./path/myLocalModule');
// 导入JSON文件:
const jsonData = require('./path/filename.json');
// 从node_modules或Node.js内置模块中导入模块:
const crypto = require('node:crypto'); 
```

### resolve()

```js
require.resolve(request[, options])
/**
request <string> 要解析的模块路径。
options <Object>
	paths <string[]> 从中解析模块位置的路径。
		如果存在，将使用这些路径而不是默认解析路径，
		但 GLOBAL_FOLDERS 和 $HOME/.node_modules 除外，它们始终包含在内。
		这些路径中的每一个都用作模块解析算法的起点，这意味着从此位置检查 node_modules 层级。
返回：<string>
*/
```

使用内部的 `require()` 工具查找模块的位置，但**不加载模块**，只**返回**解析的**文件名**。

```js
require.resolve('/Users/enhanced-resolve/')// 绝对路径 -> /Users/enhanced-resolve/lib/node.js

require.resolve('./index')// 相对路径 -> /Users/enhanced-resolve/index.js

require.resolve('diff') // 比较特殊（重要）// 模块路径 -> /Users/enhanced-resolve/node_modules/diff/diff.js

// 如果是模块路径，会自动找 node_modules 中的文件
```

> 注意的是，如果有多层目录都有 node_modules ，会优先找 __dirname 近的 node_modules

## enhanced-resolve

enhanced-resolve 提供了一个异步的 require.resolve 函数，具有高度可配置性。

### 特性

- **插件系统**
- 提供**自定义文件系统**
- 包含**同步和异步**的 Node.js **文件系统**

### 安装

```sh
# 使用 npm 安装

npm install enhanced-resolve

# 或者使用 Yarn 安装

yarn add enhanced-resolve

# 测试

yarn test
```

### 直接使用

有一个 Node.js API，允许根据 Node.js 解析规则解析请求。 提供同步和异步的 API。`create` 方法允许创建一个自定义解析函数。

> resolve 方法接收三个参数，path 、request 、callback

```js
const resolve = require("enhanced-resolve");

// 异步加载模块
resolve("/some/path/to/folder", "module/dir", (err, result) => {
	result; // === "/some/path/node_modules/module/dir/index.js"
});

// 同步加载模块
resolve.sync("/some/path/to/folder", "../../dir");
// === "/some/path/dir/index.js"

// 创建一个 resolve 实例，用于异步加载
const myResolve = resolve.create({
	// 或者使用 resolve.create.sync
	extensions: [".ts", ".js"]
	// 查看下面更多的选项
});
myResolve("/some/path/to/folder", "ts-module", (err, result) => {
	result; // === "/some/node_modules/ts-module/index.ts"
});
```

### 创建一个解析器

创建解析器的最简单方法是使用 `ResolveFactory` 上的 `createResolver` 函数，以及提供的文件系统实现之一。

```js
const fs = require("fs");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");

// 创建一个解析器
const myResolver = ResolverFactory.createResolver({
	// 典型的用法将消耗 `fs` + `CachedInputFileSystem`，它包装了 Node.js `fs` 来添加缓存。
	fileSystem: new CachedInputFileSystem(fs, 4000),
	extensions: [".js", ".json"]
	/* 这里还有其他解析器选项。可以在下面看到选项/默认值 */
});

// 使用新的解析器解析一个文件
const context = {};
const resolveContext = {};
const lookupStartPath = "/Users/webpack/some/root/dir";
const request = "./path/to-look-up.js";
myResolver.resolve({}, lookupStartPath, request, resolveContext, (
	err /*Error*/,
	filepath /*string*/
) => {
	// 对路径进行处理
});
```

### 使用方法总结

enhanced-resolve 对外暴露方法，create，sync，ResolverFactory，CachedInputFileSystem。

```js
const resolve = require("enhanced-resolve");
resolve()
resolve.sync()
resolve.create()
resolve.create.sync()
```

#### resolve

**resolve  本质是 resolve 方法。**

**resolve.sync 本质是 resolveSync 方法。**

**方法作用**是用 enhanced-resolve 默认**封装好的 Resolver 实例**，**不允许**添**加**一下额外 **options 配置**。

#### create（常用）

**create 本质是 create 方法。**

**create.sync 本质是 createSync 方法。**

**方法作用**是用 enhanced-resolve 默认**封装好的 Resolver 实例**，**允许**添**加**一下额外 **options 配置**。（**所以这个方式比较常用**）

#### ResolverFactory.createResolve

最重要的方法 createResolver 用于**注册多个 hook** ，**注入系统内的一些 plugin** ，然后**创建 Resolver 实例**。

更多详情，查看：https://xiaowuqiqi.github.io/frontEndKnowledgeTree/webpack/webpack-base-enhanced-resolve

### 解析器选项

| 字段             | 默认值                      | 描述                                                         |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| alias            | {}                          | 一个模块**别名**配置列表或将键映射到值的对象                 |
| aliasFields      | []                          | 描述文件中的别名字段列表                                     |
| extensionAlias   | {}                          | 将扩展名映射到扩展名别名的对象                               |
| cachePredicate   | function() { return true }; | 一个函数，决定是否应该缓存请求。一个对象被传递给该函数，具有 `path` 和 `request` 属性。 |
| cacheWithContext | true                        | 如果启用了不安全的缓存，则在缓存键中包含 `request.context`   |
| conditionNames   | ["node"]                    | 导出字段条件名称列表                                         |
| descriptionFiles | ["package.json"]            | 读取的描述文件列表                                           |
| enforceExtension | false                       | 强制使用扩展名                                               |
| exportsFields    | ["exports"]                 | 描述文件中的导出字段列表                                     |
| extensions       | [".js", ".json", ".node"]   | 应尝试的文件的扩展名列表                                     |
| fallback         | []                          | 与 `alias` 相同，但仅在默认解析失败时使用                    |
| fileSystem       |                             | 应该使用的文件系统                                           |
| fullySpecified   | false                       | 传递给解析的请求已经完全指定，对于它不会解析扩展名或主文件（对于内部请求仍然会解析它们） |
| mainFields       | ["main"]                    | 描述文件中的主字段列表                                       |
| mainFiles        | ["index"]                   | 目录中的主文件列表                                           |
| modules          | ["node_modules"]            | 解析模块的目录列表，可以是绝对路径或文件夹名称               |
| plugins          | []                          | 应用的附加解析插件列表                                       |
| resolver         | undefined                   | 一个准备好的 Resolver，插件附加到这个 Resolver 上            |
| resolveToContext | false                       | 解析到上下文而不是文件                                       |
| preferRelative   | false                       | 更喜欢将模块请求解析为相对请求，然后回退到解析为模块         |
| preferAbsolute   | false                       | 更喜欢将服务器相对路径解析为绝对路径，然后回退到在根目录中解析 |
| restrictions     | []                          | 解析限制列表                                                 |
| roots            | []                          | 根路径列表                                                   |
| symlinks         | true                        | 是否解析符号链接到它们的符号链接位置                         |
| unsafeCache      | false                       | 使用此缓存对象来不安全地缓存成功的请求                       |

