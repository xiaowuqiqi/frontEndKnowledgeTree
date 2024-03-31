---
title: fs
nav: node
group:
  title: node笔记
  order: 0
order: 3
---
# node 笔记-fs

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## filehandle

FileHandle 是 fs 中的一个数据类，其实例是一个数据类型。由 promises fs.open() 方法返回。

注意：FileHandle 新增于: v10.0.0。

```js
import { open } from 'node:fs/promises';
filehandle = await open('temp.txt', 'w+');
```

### 事件-close

当 fileHandle 已关闭且不再可用时，则触发 `'close'` 事件。

> 新增于: v15.4.0

### stat()

```js
filehandle.stat([options])
/**
options <Object>
	bigint <boolean> 返回的 <fs.Stats> 对象中的数值是否应为 bigint。默认值：false。
返回：<Promise> 通过文件的 <fs.Stats> 来履行。
*/
```

### sync()

请求将**打开文件描述符**的**所有数据刷新到存储设备**。

> 具体实现是操作系统和设备特定的。有关更多详细信息，请参阅 POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2.html) 文档。

### truncate()

如果文件大于 `len` 个字节，则仅前 `len` 个字节将保留在文件中。

下面的示例仅保留文件的前四个字节：

```js
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
} 
```



### read()

```js
filehandle.read()
/**
buffer <Buffer> | <TypedArray> | <DataView> 将填充读取的文件数据的缓冲区。
offset <integer> 缓冲区中开始填充的位置。
length <integer> 读取的字节数。
position <integer> | <null> 从文件开始读取数据的位置。如果为 null，则将从当前文件位置读取数据，并将更新该位置。如果 position 是整数，则当前文件位置将保持不变。
返回：<Promise> 成功时将使用具有以下两个属性的对象履行：
	bytesRead <integer> 读取的字节数
	buffer <Buffer> | <TypedArray> | <DataView> 对传入的 buffer 参数的引用。
*/
// 或者
/**
options <Object>
	buffer <Buffer> | <TypedArray> | <DataView> 将填充读取的文件数据的缓冲区。
		默认值：Buffer.alloc(16384)
	offset <integer> 缓冲区中开始填充的位置。默认值：0
	length <integer> 读取的字节数。默认值：buffer.byteLength - offset
	position <integer> | <null> 从文件开始读取数据的位置。
		如果为 null，则将从当前文件位置读取数据，并将更新该位置。
		如果 position 是整数，则当前文件位置将保持不变。Default::null
	返回：<Promise> 成功时将使用具有以下两个属性的对象履行：
		bytesRead <integer> 读取的字节数
		buffer <Buffer> | <TypedArray> | <DataView> 对传入的 buffer 参数的引用。
*/
// 或者
/**
buffer <Buffer> | <TypedArray> | <DataView> 将填充读取的文件数据的缓冲区。
options <Object>
	offset <integer> 缓冲区中开始填充的位置。默认值：0
	length <integer> 读取的字节数。默认值：buffer.byteLength - offset
	position <integer> 从文件开始读取数据的位置。
		如果为 null，则将从当前文件位置读取数据，并将更新该位置。
		如果 position 是整数，则当前文件位置将保持不变。Default::null
返回：<Promise> 成功时将使用具有以下两个属性的对象履行：
	bytesRead <integer> 读取的字节数
	buffer <Buffer> | <TypedArray> | <DataView> 对传入的 buffer 参数的引用。
*/
```

从文件中读取数据，并将其存储在给定的缓冲区中。

如果未同时修改文件，当读取的字节数为零时，则到达文件末尾。

### readFile()

异步地**读取文件的全部内容**。

> 如果 `options` 是字符串，则它指定 `encoding`。

**filehandle** 必须**支持读取(r)**。

如果在文件句柄上**进行**了一次或**多次 `filehandle.read()` 调用**，然后进行 `filehandle.readFile()` 调用，则将**从当前位置读取数据**，直到文件末尾。它并**不**总是**从文件的开头读取**。

### readLines()

```js
filehandle.readLines([options])
/**
options <Object>
	encoding <string> 默认值：null
	autoClose <boolean> 默认值：true
	emitClose <boolean> 默认值：true
	start <integer>
	end <integer> 默认值：Infinity
	highWaterMark <integer> 默认值：64 * 1024
返回：<readline.InterfaceConstructor>
*/
```

一行一行的读取

创建 `readline` 接口和流过文件的便捷方法。有关选项，请参见 [`filehandle.createReadStream()`](https://nodejs.cn/api/fs.html#filehandlecreatereadstreamoptions)。

```js
const { open } = require('node:fs/promises');
(async () => {
  const file = await open('./some/file/to/read');
  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```

### readv()

```js
filehandle.readv(buffers[, position])
/**
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> 要从中读取数据的文件的开头偏移量。如果 position 不是 number，则将从当前位置读取数据。默认值：null
返回：<Promise> 成功时将使用包含以下两个属性的对象履行：
	bytesRead <integer> 读取的字节数
	buffers <Buffer[]> | <TypedArray[]> | <DataView[]> 包含对 buffers 输入的引用的属性。
*/
```

### write()

```js
filehandle.write()
/**
buffer <Buffer> | <TypedArray> | <DataView>le
offset <integer> 要开始写入数据的 buffer 的起始位置。
length <integer> 要从 buffer 写入的字节数。
	默认值：buffer.byteLength - offset
position <integer> | <null> 要写入来自 buffer 的数据的文件的开头偏移量。如果 position 不是 number，则数据将被写入当前位置。
	有关更多详细信息，请参阅 POSIX pwrite(2) 文档。默认值：null
返回：<Promise>
*/
// 或者
/**
string <string>
position <integer> | <null> 要写入来自 string 的数据的文件的开头偏移量。
	如果 position 不是 number，则数据将写入当前位置。
	有关更多详细信息，请参阅 POSIX pwrite(2) 文档。默认值：null。
encoding <string> 预期的字符串编码。默认值：'utf8'。
返回：<Promise>
*/
// 或者
/**
buffer <Buffer> | <TypedArray> | <DataView>
options <Object>
	offset <integer> 默认值：0
	length <integer> 默认值：buffer.byteLength - offset
	position <integer> 默认值：null
返回：<Promise>
*/
```

在同一个文件上多**次使用 `filehandle.write()`** 而**不等待 promise** 被履行（或拒绝）是**不安全**的。

对于这种情况，请使用 [`filehandle.createWriteStream()`](https://nodejs.cn/api/fs.html#filehandlecreatewritestreamoptions)。

> 在 **Linux** 上，以**追加模式**打开文件时，**位置写入不起作用**。内核会忽略位置参数，并始终将数据追加到文件末尾。

### writeFile()

```js
filehandle.writeFile(data, options)

/**
data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
	这里注意的是 data 可以传入字符串、buffer或者流，都可以。
options <Object> | <string>
	encoding <string> | <null> 
	当 data 为字符串时的预期字符编码。默认值：'utf8'
返回：<Promise>
*/

```

**异步**地将数据**写入文件**，如果文件**已经存在**，**则替换**该文件。

> 如果 `options` 是字符串，则它指定 `encoding`。

> 注意 open 打开文件时，必须支持写入（w）。

> 在**同一个文件**上多次使用 `filehandle.writeFile()` 而**不等待 promise** 被履行（或拒绝）是**不安全**的。

如果在文件句柄上**进行了一次或多次 `filehandle.write()` 调用**，**然后进行 `filehandle.writeFile()` 调用**，则**数据**将**从当前位置写入**，直到文件末尾。它并**不**总是**从文件的开头写入**。

这里注意的是 writeFile 和 write 方法差不多，**不同点**在于 **writeFile 可以传入更多的参数**，例如可以传入**流、迭代器等**。

### appendFile()

**[`filehandle.writeFile()`](https://nodejs.cn/api/fs.html#filehandlewritefiledata-options) 的别名**。注意的是 **options** 参数可以传入额外值 **flush**。

flush 如果是 `true`，则在**关闭**基础**文件描述符之前**将其**刷新**。默认值：`false`。

### writev()

```js
filehandle.writev(buffers[, position])
/**
buffers <Buffer[]> | <TypedArray[]> | <DataView[]>
position <integer> | <null> 要写入来自 buffers 的数据的文件的开头偏移量。如果 position 不是 number，则数据将被写入当前位置。默认值：null
返回：<Promise>
*/

```

将 [ArrayBufferView](https://web.nodejs.cn/en-US/docs/Web/API/ArrayBufferView) 的数组写入文件。

这个 promise 是通过一个包含两个属性的对象来实现的：

- [bytesWritten](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数
- buffers <Buffer[]> | <TypedArray[]> | <DataView[]> 对 buffers 输入的引用。

### chmod()

```js
filehandle.chmod(mode)
// mode <integer> 文件模式位掩码。
//返回：<Promise> 成功时将使用 undefined 履行。
```

修改文件的权限。请参阅 [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2.html)。

#### 文件模式常量

以下常量旨在与 `fs.Stats` 对象的 `mode` 属性一起使用，以确定文件的访问权限。

| 常量      | 描述                                   |
| :-------- | :------------------------------------- |
| `S_IRWXU` | 文件模式指示所有者可读、可写和可执行。 |
| `S_IRUSR` | 文件模式指示所有者可读。               |
| `S_IWUSR` | 文件模式指示所有者可写。               |
| `S_IXUSR` | 文件模式指示所有者可执行。             |
| `S_IRWXG` | 文件模式指示群组可读、可写和可执行。   |
| `S_IRGRP` | 文件模式指示群组可读。                 |
| `S_IWGRP` | 文件模式指示群组可写。                 |
| `S_IXGRP` | 文件模式指示群组可执行。               |
| `S_IRWXO` | 文件模式指示其他人可读、可写和可执行。 |
| `S_IROTH` | 文件模式指示其他人可读。               |
| `S_IWOTH` | 文件模式指示其他人可写。               |
| `S_IXOTH` | 文件模式指示其他人可执行。             |

在 Windows 上，只有 `S_IRUSR` 和 `S_IWUSR` 可用。

### chown()

```js
filehandle.chown(uid, gid)
/**
uid <integer> 文件的新所有者的用户 ID。
gid <integer> 文件的新群组的组 ID。
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

更改文件的所有权。chown(2) 的封装。

### close()

等待句柄上的任何未决操作完成后，关闭文件句柄。

```js
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
} 
```

### createReadStream()

> 新增于: v16.11.0

```js
filehandle.createReadStream([options])
/**
options <Object>
	encoding <string> 默认值：null
	autoClos
	emitClose <boolean> 默认值：true
	start <integer>
	end <integer> 默认值：Infinity
	highWaterMark <integer> 默认值：64 * 1024
	返回：<fs.ReadStream>
*/

```

创建可读流。

与 stream.Readable 的 16 KiB 默认 highWaterMark 不同，此方法返回的流的**默认 highWaterMark 为 64 KiB**。

**options** 可以包括 **start 和 end 值**，以从文件中读取**一定范围的字节**，而不是整个文件。start 和 end 均包含在内并从 0 开始计数，**允许**的值在 **[0, Number.MAX_SAFE_INTEGER] 范围内**。

如果省略 **start** 或**为 undefined**，则 filehandle.createReadStream() **从当前的文件位置**开始依次读取。

encoding 可以是 Buffer 接受的任何一种。

> 如果 FileHandle 指向只支持阻塞读取的字符设备（如键盘或声卡），则读取操作在数据可用之前不会完成。这可以防止进程退出和流自然关闭。

> 默认情况下，流将在销毁后触发 'close' 事件。将 emitClose 选项设置为 false 以更改此行为。

### createWriteStream()

> 新增于: v16.11.0

```js
ilehandle.createWriteStream([options])
/**
options <Object>
	encoding <string> 默认值：'utf8'
	autoClose <boolean> 默认值：true
	emitClose <boolean> 默认值：true
	start <integer>
	highWaterMark <number> 默认值：16384
	flush <boolean> 如果是 true，则在关闭基础文件描述符之前将其刷新。默认值：false。
	返回：<fs.WriteStream>
*/
```

创建写入流。

**`options`** 还可以包括 **`start` 选项**，以允许在文件开头之后的**某个位置写入数据**，**允许**的值**在 [0, [`Number.MAX_SAFE_INTEGER`](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)] 范围**内。

**修改文件**（而不是替换它）可能**需要将 `flags` `open` 选项设置为 `r+`**（而不是默认的 `r`）。

`encoding` 可以是 Buffer 接受的任何一种。

> 如果将 `autoClose` 设置为 true（默认行为），则在 `'error'` 或 `'finish'` 时文件描述符将自动关闭。如果 `autoClose` 为 false，则即使出现错误，文件描述符也不会关闭。关闭它并确保没有文件描述符泄漏是应用的责任。

> 默认情况下，流将在销毁后触发 `'close'` 事件。将 `emitClose` 选项设置为 `false` 以更改此行为。

### datasync()

将与文件关联的所有当前排队的 I/O 操作强制为操作系统的同步 I/O 完成状态。有关详细信息，请参阅 POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2.html) 文档。

与 `filehandle.sync` 不同，此方法不会刷新修改的元数据。

### fd

number 由 FileHandle 对象管理的**数字文件描述符**。

## fsPromises

```js
const fsPromises = require('fs/promises');
```

以promises方式异步操作文件。

### access()

```js
fsPromises.access(path[, mode])
/**
path <string> | <Buffer> | <URL>
mode <integer> 默认值：fs.constants.F_OK
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**测试**用户**对** `path` 指定的**文件或目录的权限**。

`mode` 参数是可选的整数，指定要执行的可访问性检查。

`mode` 应该是值 `fs.constants.F_OK` 或由 `fs.constants.R_OK`、`fs.constants.W_OK` 和 `fs.constants.X_OK` 中的任何一个（例如 `fs.constants.W_OK | fs.constants.R_OK`）的按位或组成的掩码。检查 [文件访问常量](https://nodejs.cn/api/fs.html#file-access-constants) 以获得 `mode` 的可能值。

```js
import { access, constants } from 'node:fs/promises';
try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK); // 如果用户由读写权限
  console.log('can access');
} catch {
  console.error('cannot access'); // 没有则报错
} 
```

#### 检查文件是否存在

```js
import { access, constants } from 'node:fs/promises';
try {
  await access('/etc/passwd'); // 默认 fs.constants.F_OK 
  console.log('存在继续');
} catch {
  console.error('不存在，处理或创建'); // 不存在
} 
```

> 检查文件是否存在，已经弃用 `fs.exists` 请改用 [`fs.stat()`](https://nodejs.cn/api/fs.html#fsstatpath-options-callback) 或 [`fs.access()`](https://nodejs.cn/api/fs.html#fsaccesspath-mode-callback)。

#### 文件访问常量

以下常量用作传给 [`fsPromises.access()`](https://nodejs.cn/api/fs.html#fspromisesaccesspath-mode)、[`fs.access()`](https://nodejs.cn/api/fs.html#fsaccesspath-mode-callback) 和 [`fs.accessSync()`](https://nodejs.cn/api/fs.html#fsaccesssyncpath-mode) 的 `mode` 参数。

| 常量   | 描述                                                         |
| :----- | :----------------------------------------------------------- |
| `F_OK` | 指示该文件对调用进程可见的标志。这对于确定**文件是否存在**很有用，但没有提及 `rwx` 权限。如果未指定模式，则使用默认值。 |
| `R_OK` | 指示文件可以被调用进程**读取**的标志。                       |
| `W_OK` | 指示文件可以被调用进程**写入**的标志。                       |
| `X_OK` | 指示该文件可以由调用进程执行的标志。这对 Windows 没有影响（将像 `fs.constants.F_OK` 一样运行）。 |

### appendFile()

```js
fsPromises.appendFile(path, data[, options])
/**
path <string> | <Buffer> | <URL> | <FileHandle> 文件名或 <FileHandle>
data <string> | <Buffer>
options <Object> | <string>
	encoding <string> | <null> 默认值：'utf8'
	mode <integer> 默认值：0o666
	flag <string> 参见 支持文件系统 flags。默认值：'a'。
	flush <boolean> 如果是 true，则在关闭基础文件描述符之前将其刷新。默认值：false。
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**异步**地将数据**追加**到文件，如果该文件尚**不存在**，**则创建**该文件。**data** 可以是**字符串**或 **Buffer**。

如果 options 是字符串，则它指定 encoding。

mode 选项仅影响新创建的文件。有关详细信息，请参阅 fs.open()。

可以将 **path** 指定为已打开用于追加（使用 fsPromises.open()）的 **fileHandle**。

### writeFile()

```js
fsPromises.writeFile(file, data[, options])
/**
file <string> | <Buffer> | <URL> | <FileHandle> 文件名或 FileHandle
data <string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>
options <Object> | <string>
	encoding <string> | <null> 默认值：'utf8'
	mode <integer> 默认值：0o666
	flag <string> 参见 支持文件系统 flags。默认值：'w'。
	flush <boolean> 如果所有数据都成功写入文件，并且 flush 是 true，则使用 filehandle.sync() 来刷新数据。默认值：false。
	signal <AbortSignal> 允许中止正在进行的 writeFile
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**异步地将数据写入文件**，如果文件**已经存在**，**则替换**该文件。

> 如果 `data` 是缓冲区，则忽略 `encoding` 选项。

> 如果 `options` 是字符串，则它指定编码。

> `mode` 选项仅影响新创建的文件。有关详细信息，请参阅 [`fs.open()`](https://nodejs.cn/api/fs.html#fsopenpath-flags-mode-callback)。

> 任何指定的 FileHandle 都必须支持写入。

> 在同一个文件上多次使用 `fsPromises.writeFile()` 而不等待 promise 被解决是不安全的。

> 与 `fsPromises.readFile` 类似 - `fsPromises.writeFile` 是一种便捷方法，它在内部执行多个 `write` 调用以写入传递给它的缓冲区。

> 对于性能敏感的代码，则考虑使用 [`fs.createWriteStream()`](https://nodejs.cn/api/fs.html#fscreatewritestreampath-options) 或 [`filehandle.createWriteStream()`](https://nodejs.cn/api/fs.html#filehandlecreatewritestreamoptions)。

可以使用 AbortSignal 取消 `fsPromises.writeFile()`。取消是 "最大努力"，可能仍有一些数据要写入。

```js
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

中止正在进行的请求不会中止单个操作系统请求，而是中止内部缓冲的 `fs.writeFile` 执行。

### readdir()

```js
fsPromises.readdir(path[, options])
/**
path <string> | <Buffer> | <URL>
options <string> | <Object>
	encoding <string> 默认值：'utf8'
	withFileTypes <boolean> 默认值：false
	recursive <boolean> 如果是 true，则递归读取目录的内容。在递归模式下，它将列出所有文件、子文件和目录。默认值：false。
返回：<Promise> 使用目录中文件的名称数组（不包括 '.' 和 '..'）履行。
*/
```

返回目录中**目录和文件名字**，如果 `options.withFileTypes` 设置为 `true`，则返回的数组将包含 **fsDirent 对象**。

> 可选的 `options` 参数可以是指定编码的字符串，也可以是具有 `encoding` 属性（指定用于文件名的字符编码）的对象。如果 `encoding` 设置为 `'buffer'`，则返回的文件名将作为 buffer 对象传入。

### readFile()

```js
fsPromises.readlink(path[, options])
/**
path <string> | <Buffer> | <URL> | <FileHandle> 文件名或 FileHandle
options <Object> | <string>
	encoding <string> | <null> 默认值：null
	flag <string> 参见 支持文件系统 flags。默认值：'r'。
	signal <AbortSignal> 允许中止正在进行的 readFile
返回：<Promise> 使用文件的内容履行。
*/
```

异步地**读取文件**的**全部内容**。

> 如果**未指定编码**（使用 options.encoding），则数据作为 **Buffer 对象返回**。否则，数据将为字符串。

> 如果 options 是字符串，则它指定编码。

> 当 path 是**目录**时，fsPromises.readFile() 的行为是特定于平台的。在 macOS、Linux 和 Windows 上，promise 将使用**错误拒绝**。在 FreeBSD 上，将返回目录内容的表示。

读取位于运行代码同一目录下的 package.json 文件的示例：

```js
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile()
```

可以使用 AbortSignal 中止正在进行的 readFile。如果请求中止，则返回的 promise 将使用 AbortError 拒绝：

```js
import { readFile } from 'node:fs/promises';
try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // 在 promise 完成之前中止请求
  controller.abort();

  await promise;
} catch (err) {
  // 当请求被中止时，err 是一个 AbortError
  console.error(err);
}
```

> 中止正在进行的请求不会中止单个操作系统请求，而是中止内部缓冲的 fs.readFile 执行。
>
> 任何指定的 FileHandle 必须支持读取。

### readlink()

读取 `path` **引用的符号链接**的**内容**。（读取快捷方式对应的文件路径）

> 有关更多详细信息，请参阅 POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2.html) 文档。`linkString` 的成功兑现了这一 promise。

> 可选的 `options` 参数可以是指定编码的字符串，也可以是具有 `encoding` 属性（指定用于返回的链接路径的字符编码）的对象。如果将 `encoding` 设置为 `'buffer'`，则返回的链接路径将作为 buffer 对象传入。

### realpath()

```js
fsPromises.realpath(path[, options])
/**
path <string> | <Buffer> | <URL>
options <string> | <Object>
	encoding <string> 默认值：'utf8'
返回：<Promise> 成功时将使用解析的路径履行。
*/
```

使用与 `fs.realpath.native()` 函数相同的语义确定 `path` 的**实际位置**(快捷方式的真实位置)。

仅支持可以转换为 UTF8 字符串的路径。

可选的 `options` 参数可以是指定编码的字符串，也可以是具有 `encoding` 属性（指定用于路径的字符编码）的对象。

如果 `encoding` 设置为 `'buffer'`，则返回的路径将作为 buffer 对象传入。

在 Linux 上，将 Node.js 与 musl libc 链接时，必须将 procfs 文件系统挂载在 `/proc` 上，此函数才能起作用。Glibc 没有此限制。



### chmod()

同上

### chown()

同上

### rename()

```js
fsPromises.rename(oldPath, newPath)
//oldPath <string> | <Buffer> | <URL>
//newPath <string> | <Buffer> | <URL>
//返回：<Promise> 成功时将使用 undefined 履行。
```

重命名

### copyFile()

```js
fsPromises.copyFile(src, dest[, mode])
/**
src <string> | <Buffer> | <URL> 要复制的源文件名
dest <string> | <Buffer> | <URL> 复制操作的目标文件名
mode <integer> 指定复制操作行为的可选修饰符。可以创建一个由两个或多个值的按位或组成的掩码（例如 			fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE）默认值：0。
	fs.constants.COPYFILE_EXCL：如果 dest 已经存在，则复制操作将失败。
	fs.constants.COPYFILE_FICLONE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则使用后备复制机制。
	fs.constants.COPYFILE_FICLONE_FORCE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则该操作将失败。
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

异步地将 `src` 复制到 `dest`。默认情况下，如果 `dest` 已经存在，则会被覆盖。

无法保证复制操作的原子性。如果在打开目标文件进行写入后发生错误，则将尝试删除目标文件。

```js
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}

// 通过使用 COPYFILE_EXCL，如果destination.txt存在，则操作将失败。
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
} 
```

### cp()

```js
fsPromises.cp(src, dest[, options])
/**
src <string> | <URL> 要复制的源路径。
dest <string> | <URL> 要复制到的目标路径。
options <Object>
	dereference <boolean> 取消引用符号链接。默认值：false。
	errorOnExist <boolean> 当 force 是 false 且目标存在时，抛出错误。默认值：false。
	filter <Function> 过滤复制文件/目录的函数。
		返回 true 则复制条目，返回 false 则忽略它。
		忽略目录时，其所有内容也将被跳过。还可以返回解析为 true 或 false 默认值的 Promise：undefined。
		src <string> 要复制的源路径。
		dest <string> 要复制到的目标路径。
		返回：<boolean> | <Promise>
	force <boolean> 覆盖现有文件或目录。
		如果将此设置为 false 并且目标存在，则复制操作将忽略错误。
		使用 errorOnExist 选项更改此行为。默认值：true。
	mode <integer> 复制操作的修饰符。默认值：0。参见 fsPromises.copyFile() 的 mode 标志。
	preserveTimestamps <boolean> 当为 true 时，则 src 的时间戳将被保留。默认值：false。
	recursive <boolean> 递归复制目录默认：false
	verbatimSymlinks <boolean> 当为 true 时，则符号链接的路径解析将被跳过。默认值：false
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

将整个目录结构从 `src` 异步地复制到 `dest`，包括子目录和文件。

当将目录复制到另一个目录时，不支持 globs，并且行为类似于 `cp dir1/ dir2/`。

### link()

```
fsPromises.link(existingPath, newPath)
```

创建从 `existingPath` 到 `newPath` 的新链接。有关更多详细信息，请参阅 POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2.html) 文档。

### symlink()

```js
fsPromises.symlink(target, path[, type])
/**
target <string> | <Buffer> | <URL>
path <string> | <Buffer> | <URL>
type <string> | <null> 默认值：null
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**创建符号链接**。

`type` 参数仅在 Windows 平台上使用，可以是 `'dir'`、`'file'` 或 `'junction'` 之一。如果 `type` 参数不是字符串，则 Node.js 将自动检测 `target` 类型并使用 `'file'` 或 `'dir'`。如果 `target` 不存在，将使用 `'file'`。Windows 交接点要求目标路径是绝对路径。使用 `'junction'` 时，`target` 参数将自动规范化为绝对路径。NTFS 卷上的连接点只能指向目录。

### mkdir()

```js
fsPromises.mkdir(path[, options])
/**
path <string> | <Buffer> | <URL>
options <Object> | <integer>
	recursive <boolean> 默认值：false
	mode <string> | <integer> Windows 上不支持。默认值：0o777。
返回：<Promise> 成功后，如果 recursive 为 false，则使用 undefined 履行；如果 recursive 为 true，则使用创建的第一个目录路径履行。
*/
```

**异步地创建目录。**

> 可选的 `options` 参数可以是指定 `mode`（权限和粘性位）的整数，也可以是具有 `mode` 属性和 `recursive` 属性（指示是否应创建父目录）的对象。当 `path` 是已存在的目录时，调用 `fsPromises.mkdir()` 仅在 `recursive` 为 false 时才导致拒绝。

### mkdtemp()

**创建**唯一的**临时目录**。通过在所提供的 **`prefix`** 的**末尾**附加**六个随机字符**来生成**唯一**的**目录名称**。

> 由于平台的不一致，请避免在 `prefix` 中尾随 `X` 字符。某些平台，尤其是 BSD，可能返回六个以上的随机字符，并将 `prefix` 中的尾随 `X` 字符替换为随机字符。

```js
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
} 
```

### rmdir()

```js
fsPromises.rmdir(path[, options])
/**
path <string> | <Buffer> | <URL>
options <Object>
	maxRetries <integer> 如果遇到 EBUSY、EMFILE、ENFILE、ENOTEMPTY 或 EPERM 错误，Node.js 将在每次尝试时以 retryDelay 毫秒的线性退避等待时间重试该操作。此选项表示重试次数。如果 recursive 选项不为 true，则忽略此选项。默认值：0。
	recursive <boolean> 如果为 true，则执行递归目录删除。
		在递归模式下，操作将在失败时重试。默认值：false。已弃用。
	retryDelay <integer> 重试之间等待的时间（以毫秒为单位）。
		如果 recursive 选项不为 true，则忽略此选项。默认值：100。
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**删除**由 `path` 标识的**目录**。

在**文件（而不是目录）**上使用 `fsPromises.rmdir()` 会导致 promise 被拒绝，在 Windows 上使用 `ENOENT` 错误，在 POSIX 上使用 `ENOTDIR` **错误**。

> 要获得类似于 `rm -rf` Unix 命令的行为，则使用具有选项 `{ recursive: true, force: true }` 的 [`fsPromises.rm()`](https://nodejs.cn/api/fs.html#fspromisesrmpath-options)。

### rm()

```js
fsPromises.rm(path[, options])
/**
path <string> | <Buffer> | <URL>
options <Object>
	force <boolean> 当为 true 时，如果 path 不存在，则异常将被忽略。默认值：false。
	maxRetries <integer> 如果遇到 EBUSY、EMFILE、ENFILE、ENOTEMPTY 或 EPERM 错误，
		Node.js 将在每次尝试时以 retryDelay 毫秒的线性退避等待时间重试该操作。
		此选项表示重试次数。如果 recursive 选项不为 true，则忽略此选项。默认值：0。
	recursive <boolean> 如果为 true，则执行递归目录删除。在递归模式下，操作将在失败时重试。默认值：false。
	retryDelay <integer> 重试之间等待的时间（以毫秒为单位）。如果 recursive 选项不为 true，则忽略此选项。默认值：100。
返回：<Promise> 成功时将使用 undefined 履行。
*/
```

**删除文件和目录**（在标准 POSIX `rm` 实用工具上建模）

### unlink()

如果 `path` 指向**符号链接**，则**删除**该**链接**，但不影响链接所指向的文件或目录。

如果 `path` 指向的文件路径**不是符号链接**，则**删除文件**。有关更多详细信息，请参阅 POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html) 文档。

### stat()

```js
fsPromises.stat(path[, options])
/**
path <string> | <Buffer> | <URL>
options <Object>
	bigint <boolean> 返回的 <fs.Stats> 对象中的数值是否应为 bigint。默认值：false。
返回：<Promise> 满足给定 path 的 <fs.Stats> 对象。
*/
```

返回：Promise 满足给定 `path` 的 fsStats 对象。

### statfs()

返回：Promise 满足给定 `path` 的 fsStatFs 对象。

### utimes()

更改 `path` 引用的对象的文件系统时间戳。

### open()

```js
fsPromises.open(path, flags[, mode])
/**
path <string> | <Buffer> | <URL>
flags <string> | <number> 参见 支持文件系统 flags。默认值：'r'。
mode <string> | <integer> 如果创建文件，则设置文件模式（权限和粘性位）。默认值：0o666（可读可写）
返回：<Promise> 使用 <FileHandle> 对象实现。
*/
```

打开 filehandle。

```js
import { open } from 'node:fs/promises';
filehandle = await open('temp.txt', 'w+');
```

#### 文件系统标志

以下标志在 `flag` 选项接受字符串的任何地方可用。

- `'a'`：打开文件进行**追加**。如果文件**不存在**，则**创建**该文件。

- `'ax'`：类似于 `'a'` 但，如果路径存在则失败（**仅用于创建**）。

- `'a+'`：打开文件进行**读取和追加**。如果文件**不存在**，则**创建**该文件。

- `'ax+'`：类似于 `'a+'` 但如果路径存在则失败（**仅用于创建**）。

- `'as'`：以**同步模式**打开文件进行**追加**。如果文件**不存在**，则**创建**该文件。

- `'as+'`：以**同步模式**打开文件进行**读取和追加**。如果文件**不存在**，则**创建**该文件。

- `'r'`：打开文件进行**读取**。如果文件**不存在**，则**会发生异常**。

- `'rs'`：打开文件以**同步模式读取**。如果文件**不存在**，则会**发生异常**。

- `'r+'`：打开文件进行**读写**。如果文件**不存在**，则会**发生异常**。

- `'rs+'`：以**同步模式**打开文件进行**读写**。指示操作系统绕过本地文件系统缓存。

  这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。

  这不会将 `fs.open()` 或 `fsPromises.open()` 变成同步阻塞调用。如果需要同步操作，应该使用类似 `fs.openSync()` 的东西。

- `'w'`：打开文件进行**写入**。**创建**（如果它**不存在**）或截断（如果它存在）该文件。

- `'wx'`：类似于 `'w'` 但如果路径存在则失败（**仅用于创建**）。

- `'w+'`：打开文件进行**读写**。**创建**（如果它**不存在**）或截断（如果它存在）该文件。

- `'wx+'`：类似于 `'w+'` 但如果路径存在则失败（**仅用于创建**）。

常用有 r+ 和 w+ 都是读写，但是不存在时一个发生异常，一个是创建。

a+ 则是读和追加，不存在则创建。

带有 x 都是有写入功能的，表示如果有文件则报错，为了安全，不进行文件覆盖。

### opendir()

```js
fsPromises.opendir(path[, options])
/**
path <string> | <Buffer> | <URL>
options <Object>
	encoding <string> | <null> 默认值：'utf8'
	bufferSize <number> 当从目录读取时，在内部缓冲的目录条目数。
		值越大，性能越好，但内存使用率越高。默认值：32
	recursive <boolean> 已解析的 Dir 将是包含所有子文件和目录的 <AsyncIterable>。
		默认值：false
返回：<Promise> 满足 <fs.Dir>。
*/
```

异步地**打开目录**进行迭代扫描。**返回 `fs.Dir` 流（v12.12.0 新增）**。详情查看下边 Dir 章节。

> 有关更多详细信息，请参阅 POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3.html) 文档。

> 创建 fs.dir，其中包含用于从目录读取和清理目录的所有进一步的函数。

`encoding` 选项设置在打开目录和随后的读取操作时 `path` 的编码。

```js
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir) // 循环遍历这个迭代器
    console.log(dirent.name);
} catch (err) {
  console.error(err);
} 
```

### truncate()

将 `path` 上的内容截断（缩短或延长长度）到 `len` 个字节。同上。

### watch()

### constants

返回一个包含文件系统操作常用常量的对象。对象与 `fs.constants` 相同。有关详细信息，请参阅 [文件系统常量](https://nodejs.cn/api/fs.html#fs-constants)。

## Dir

> 新增于: v12.12.0

表示**目录对象**的**类**。

由 [`fs.opendir()`](https://nodejs.cn/api/fs.html#fsopendirpath-options-callback)、[`fs.opendirSync()`](https://nodejs.cn/api/fs.html#fsopendirsyncpath-options) 或 [`fsPromises.opendir()`](https://nodejs.cn/api/fs.html#fspromisesopendirpath-options) 创建。

```js
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name); // 迭代器中循环的单个元素是 dirent
} catch (err) {
  console.error(err);
}
```

当使用异步迭代器时，**fsDir 对象**将在**迭代器退出**后**自动关闭**。

### close()

异步地关闭目录的底层资源句柄。后续读取将导致错误。

返回一个 promise，该 promise 将在资源关闭后履行。

### closeSync()

同步地关闭目录的底层资源句柄。后续读取将导致错误。

### path

提供给 [`fs.opendir()`](https://nodejs.cn/api/fs.html#fsopendirpath-options-callback)、[`fs.opendirSync()`](https://nodejs.cn/api/fs.html#fsopendirsyncpath-options) 或 [`fsPromises.opendir()`](https://nodejs.cn/api/fs.html#fspromisesopendirpath-options) 的此目录的只读路径。

### read()

返回：Promise 满足 fs.Dirent | null

异步读取下一个目录条目作为 fsDirent。

> 返回一个 promise，如果没有更多的目录条目可供读取，则将通过 fs.Dirent 或 `null` 来实现。

> 此函数返回的目录条目没有操作系统底层目录机制提供的特定顺序。迭代目录时添加或删除的条目可能不包括在迭代结果中。

### readSync()

返回： fs.Dirent | null

同步地读取下一个目录条目作为 fsDirent。

> 如果读取不到更多的目录条目，则将返回 `null`。

> 此函数返回的目录条目没有操作系统底层目录机制提供的特定顺序。迭代目录时添加或删除的条目可能不包括在迭代结果中。

### dir\[Symbol.asyncIterator\]()

返回：AsyncIterator | fs.Dirent 的异步迭代器

异步地遍历目录，直到读取了所有条目。

## Dirent

> 新增于: v10.10.0

目录条目的表示，可以是目录中的文件或子目录，通过从 fs.Dir 读取返回。

目录条目是文件名和文件类型对的组合。

此外，当在 `withFileTypes` 选项设置为 `true` 的情况下调用 [`fs.readdir()`](https://nodejs.cn/api/fs.html#fsreaddirpath-options-callback) 或 [`fs.readdirSync()`](https://nodejs.cn/api/fs.html#fsreaddirsyncpath-options) 时，生成的数组将填充 fsDirent 对象，而不是字符串或 buffer。

### isDirectory()

描述文件系统目录，则返回 `true`。

### isFIFO()

描述先进先出 (FIFO) 管道，则返回 `true`

### isFile()

描述常规文件，则返回 `true`。

### isSocket()

描述套接字，则返回 `true`。

### isSymbolicLink()

描述符号链接，则返回 `true`。

### name

引用的文件名。该值的类型由传给 [`fs.readdir()`](https://nodejs.cn/api/fs.html#fsreaddirpath-options-callback) 或 [`fs.readdirSync()`](https://nodejs.cn/api/fs.html#fsreaddirsyncpath-options) 的 `options.encoding` 决定。

## Stats

提供有关**文件的信息**。

从 [`fs.stat()`](https://nodejs.cn/api/fs.html#fsstatpath-options-callback)、[`fs.lstat()`](https://nodejs.cn/api/fs.html#fslstatpath-options-callback)、[`fs.fstat()`](https://nodejs.cn/api/fs.html#fsfstatfd-options-callback) 及其同步对应对象返回的对象属于此类型。如果传给这些方法的 `options` 中的 `bigint` 为 true，则数值将为 `bigint` 而不是 `number`，并且该对象将包含额外的以 `Ns` 为后缀的纳秒精度属性。

```js
Stats {
  dev: 2114, // 设备的数字标识符。
  ino: 48064969,
  mode: 33188, // 描述文件类型和模式的位字段。
  nlink: 1, // 文件存在的硬链接数。
  uid: 85, // 拥有文件的用户的数字用户标识符 (POSIX)。
  gid: 100,// 拥有文件的群组的数字群组标识符 (POSIX)。
  rdev: 0,// 如果文件代表设备，则为数字设备标识符。
  size: 527,// 文件的大小（以字节为单位）。
  blksize: 4096,// i/o 操作的文件系统块大小。
  blocks: 8,// 为此文件分配的块数。
  atimeMs: 1318289051000.1,// 指示最后一次访问此文件的时间戳
  mtimeMs: 1318289051000.1,// 指示最后一次修改此文件的时间戳
  ctimeMs: 1318289051000.1,// 指示最后一次更改文件状态的时间戳
  birthtimeMs: 1318289051000.1, // 指示此文件创建时间的时间戳
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT } 
```

`bigint` 版本：

```js
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT } 
```

### isDirectory()

对象描述文件系统目录，则返回 `true`。

### isFIFO()

新增于: v0.1.10

对象描述先进先出 (FIFO) 管道，则返回 `true`。

### isFile()

对象描述常规文件，则返回 `true`。

### isSocket()

对象描述套接字，则返回 `true`。

### isSymbolicLink()

对象描述符号链接，则返回 `true`。

## StatFs

> 新增于: v19.6.0, v18.15.0

提供有关**已安装文件系统的信息**。

从 [`fs.statfs()`](https://nodejs.cn/api/fs.html#fsstatfspath-options-callback) 及其同步对象返回的对象属于这种类型。如果传递给这些方法的 `options` 中的 `bigint` 是 `true`，则数值将是 `bigint` 而不是 `number`。

```console
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
} 
```

## 同步与回调相关API

### fs.stat(path[, options], callback)

返回一个 fs.Stats 对象

### fs.mkdir(path[, options], callback)

异步地**创建目录**。 除了可能的异常，完成回调没有其他参数。

可选的 `options` 参数可以是指定模式（权限和粘滞位）的整数，也可以是具有 `mode` 属性和 `recursive` 属性（指示是否应创建父文件夹）的对象。

```js
// 创建 /tmp/a/apple 目录，无论是否存在 /tmp 和 /tmp/a 目录。
fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```

### fs.writeFile(file, data[, options], callback)

当 `file` 是一个文件名时，异步地将**数据写入**到一个**文件**，如果文件已存在则覆盖该文件。 `data` 可以是字符串或 buffer。

```js
const data = new Uint8Array(Buffer.from('Node.js中文网'));
fs.writeFile('文件.txt', data, (err) => {
  if (err) throw err;
  console.log('文件已被保存');
});
```

### fs.readFile(path[, options], callback)

异步**地读取文件**的全部内容。

```js
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

如果 `options` 是字符串，则它指定字符编码：

```js
fs.readFile('/etc/passwd', 'utf8', callback);
```

### fs.unlink(path, callback)

异步地**删除文件**或**符号链接**。 除了可能的异常，完成回调没有其他参数。

```js
// 假设 'path/file.txt' 是常规文件。
fs.unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('文件已删除');
});
```

### fs.rmdir(path[, options], callback)

**删除目录**

### fs.accessSync(path[, mode])

**同步**地**测试**用户对 `path` 指定的**文件或目录**的**权限**。 

如果任何可访问性检查**失败**，**将抛出 `Error`**。 否则，该方法将返回 `undefined`。

```js
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  // fs.constants.W_OK | fs.constants.R_OK 的按位或组成的掩码
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

### promisify

用于把 callback 转为 Promise。

```js
// Symbols is a better way to do this, but not all browsers have good support,
// so instead we'll just make do with a very unlikely string.
const customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";

/**
 * promisify()
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
 * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
 * and rejects when `error` is truthy.
 *
 * @param {function} original - The function to promisify
 * @return {function} A promisified version of `original`
 */
function promisify(original) {

    // Ensure the argument is a function
    if (typeof original !== "function") {
        throw new TypeError("Argument to promisify must be a function");
    }

    // If the user has asked us to decode argument names for them, honour that
    const argumentNames = original[customArgumentsToken];

    // If the user has supplied a custom Promise implementation, use it. Otherwise
    // fall back to whatever we can find on the global object.
    const ES6Promise = promisify.Promise || Promise;

    // If we can find no Promise implemention, then fail now.
    if (typeof ES6Promise !== "function") {
        throw new Error("No Promise implementation found; do you need a polyfill?");
    }

    return function (...args) {
        return new ES6Promise((resolve, reject) => {

            // Append the callback bound to the context
            args.push(function callback(err, ...values) {

                if (err) {
                    return reject(err);
                }

                if (values.length === 1 || !argumentNames) {
                    return resolve(values[0]);
                }

                const o = {};
                values.forEach((value, index) => {
                    const name = argumentNames[index];
                    if (name) {
                        o[name] = value;
                    }
                });

                resolve(o);
            });

            // Call the function.
            original.call(this, ...args);
        });
    };
}

// Attach this symbol to the exported function, so users can use it
promisify.argumentNames = customArgumentsToken;
promisify.Promise = undefined;

// Export the public API
exports.promisify = promisify;
```

### 案例

```js
var fs = require('fs');
var path = require('path')
var {promisify} = require('./util/promiseify.js');

let statPro = promisify(fs.stat);
let unlinkPro = promisify(fs.unlink);
let writeFilePro = promisify(fs.writeFile);
let readFilePro = promisify(fs.readFile);

let mkdirPro = promisify(fs.mkdir);

const getPath = (dir) => path.join(__dirname, dir)
;(async function () {
    try {
        try { //有起始目录
            await statPro(getPath('./src'))
        } catch (e) {//没有起始目录，则创建
            await mkdirPro(getPath('./src'))
        }

        try { //有文件
            let stat = await statPro(getPath('./src/file.json'))
            if (!stat.isFile()) throw new Error('it is != file')
        } catch (e) {//没有文件创建文件
            await writeFilePro(getPath('./src/file.json'),`{"exclude": ["node_modules"]}`)
        }

        try { //有目标目录
            await statPro(getPath('./build'))
        } catch (e) {//没有目标目录，则创建
            await mkdirPro(getPath('./build'))
        }
        //读文件
        let data = await readFilePro(getPath('./src/file.json'))
        console.log(data.toString())
        //写入新的目录下
        await writeFilePro(getPath('./build/file.json'), data, 'UTF-8')
        //删除原来目录
        await unlinkPro(getPath('./src/file.json'))
    } catch (e) {
        console.log(e)
    }
}())
```

