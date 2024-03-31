---
title: stream-API
nav: Node
group:
  title: node笔记
  order: 0
order: 5
---

# node 笔记-stream-API

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

**流**是用于在 Node.js 中**处理流数据**的**抽象接口**。`node:stream` 模块提供了用于实现流接口的 API。

Node.js 提供了许多流对象。例如，[向 HTTP 服务器请求](https://nodejs.cn/api/http.html#class-httpincomingmessage) 和 [`process.stdout`](https://nodejs.cn/api/process.html#processstdout) 都是流实例。

Node.js 中有四种基本的流类型：

- [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)：可以写入数据的流（例如，[`fs.createWriteStream()`](https://nodejs.cn/api/fs.html#fscreatewritestreampath-options)）。
- [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable)：可以从中读取数据的流（例如，[`fs.createReadStream()`](https://nodejs.cn/api/fs.html#fscreatereadstreampath-options)）。
- [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex)：`Readable` 和 `Writable` 的流（例如，[`net.Socket`](https://nodejs.cn/api/net.html#class-netsocket)）。
- [`Transform`](https://nodejs.cn/api/stream.html#class-streamtransform)：可以在写入和读取数据时修改或转换数据的 `Duplex` 流（例如，[`zlib.createDeflate()`](https://nodejs.cn/api/zlib.html#zlibcreatedeflateoptions)）。

## 缓冲

**[`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 和 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流都将数据存储在内部缓冲区中。**

可能缓冲的数据量取决于传给流的构造函数的 **`highWaterMark` 选项**。单位为：字节。

### **tead**

当实现调用 [`stream.push(chunk)`](https://nodejs.cn/api/stream.html#readablepushchunk-encoding) 时，**数据缓存在 `Readable` 流**中。如果流的消费者**没有调用** **[`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize)**，则**数据**会**一直驻留**在**内部队列**中，**直到被消费**。

一旦内部读取**缓冲区**的总大小**达到** `highWaterMark` 指定的**阈值**，则流将**暂时停止**从底层资源**读取数据**，**直到可以消费**当前缓冲的**数据**（也就是，流将**停止调用**内部的用于填充读取缓冲区 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 方法）。

### **write**

当重复调用 [`writable.write(chunk)`](https://nodejs.cn/api/stream.html#writablewritechunk-encoding-callback) 方法时，数据会缓存**在 `Writable` 流**中。虽然内部的写入缓冲区的总大小**低于 `highWaterMark`** 设置的阈值，但对 `writable.write()` 的调用将**返回 `true`** 。一旦内部缓冲区的大小**达到或超过 `highWaterMark`**，则将**返回 `false`**。

### **pipe**

 **[`stream.pipe()`](https://nodejs.cn/api/stream.html#readablepipedestination-options) 方法**，是将数据**缓冲限制**在**可接受的水平**，以便不同速度的来源和目标不会压倒可用内存。

> `highWaterMark` 选项是一个阈值，而不是限制：它规定了流在停止请求更多数据之前缓冲的数据量。它通常不强制执行严格的内存限制。特定的流实现可能会选择实现更严格的限制，但这样做是可选的。

> 因为 **[`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 和 [`Transform`](https://nodejs.cn/api/stream.html#class-streamtransform) 流**都是 `Readable` 和 `Writable`，所以每个都维护两个**独立的内部缓冲区**。
>
> 例如，[`net.Socket`](https://nodejs.cn/api/net.html#class-netsocket) 实例是 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流，其 `Readable` 端允许使用从套接字接收的数据，其 `Writable` 端允许将数据写入套接字。因为数据可能以比接收数据更快或更慢的速度写入套接字，所以每一端都应该独立于另一端进行操作（和缓冲）。

**以 `fs.createWriteStream(path[, options])` 为例**，其 options 中就可以传入**配置 {highWaterMark}** ，其**默认值是 16384 字节，16kb**。

## 对象模式

Node.js API 创建的所有流都只对**字符串和 `Buffer`（或 `Uint8Array`）**对象进行操作。

但是，流的实现可以使用**其他类型的 JavaScript 值**（除了 `null`，它在流中具有特殊用途）。这样的流被认为在 "对象模式" 中运行。

流的实例在创建流时**使用 `objectMode` 选项**切换到**对象模式**。尝试将现有的流切换到对象模式是不安全的。

## Promise

### pipeline

**stream.pipeline()方法**是一种模块方法，用于链接传递错误的流，并在**管道完成时准确清理**和**提供回调函数**。

```js
stream.pipeline(source[, ...transforms], destination[, options])
stream.pipeline(streams[, options])
/**
streams <Stream[]> | <Iterable[]> | <AsyncIterable[]> | <Function[]>
source <Stream> | <Iterable> | <AsyncIterable> | <Function>
	返回：<Promise> | <AsyncIterable>
...transforms <Stream> | <Function>
	source <AsyncIterable>
	返回：<Promise> | <AsyncIterable>
destination <Stream> | <Function>
	source <AsyncIterable>
	返回：<Promise> | <AsyncIterable>
options <Object>
	signal <AbortSignal>
	end <boolean>
返回：<Promise> 管道完成时执行。
*/
```

#### 案例

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort()); // 强制终止现在的流，参考 webAPI AbortController。
  await pipeline( // 顺序执行流
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal }, .// 传入 signal 终止控制器
  );
}
run().catch(console.error); // 强制终止时，报错：AbortError
```

#### 异步生成器

流步骤中，支持异步操作，可以**自定义一个流步骤**，这个步骤的函数成为**异步生成器**。

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // 使用字符串而不是' Buffer '。
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal }); // 记得处理传入异步生成器的 signal 参数。
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}
run().catch(console.error);
```

如果**异步生成器**是 pipeline 的第一个参数时，{ signal } 作为参数一传入

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline( // 第一个参数就是异步生成器
    async function* ({ signal }) {// 参数一不是 source 而是，{ signal }
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

### finished

`stream.finished()` 方法是 Node.js stream 模块提供的一个 API，用于判断一个**可读流或可写流**是**否已经结束**。

```js
stream.finished(stream[, options], [callback])
/**
- stream: 可读流或可写流。
- options: 一个可选的对象，可以指定 `error` 是否应该作为常规流事件触发，默认为 true。
- callback: 一个回调函数，当流结束时将被调用。
*/
```

#### 案例

```js
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

#### 可写流结束

判断可写流是否已经结束：

```javascript
const fs = require('fs');
const { finished } = require('stream');

const writeStream = fs.createWriteStream('output.txt');
writeStream.write('write something\n');
writeStream.end(() => {
  console.log('write end');
  finished(writeStream, (err) => {
    if (err) {
      console.error('write stream failed', err);
    } else {
      console.log('write stream finished');
    }
  });
});
```

#### 可读流结束

判断可读流是否已经结束：

```javascript
const fs = require('fs');
const { finished } = require('stream');

const readStream = fs.createReadStream('input.txt');
let content = '';
readStream.on('data', chunk => {
  content += chunk;
});
readStream.on('end', () => {
  console.log('read end');
  finished(readStream, (err) => {
    if (err) {
      console.error('read stream failed', err);
    } else {
      console.log('read stream finished');
      console.log('content:', content);
    }
  });
});
```

## 可写流-示例

可写流是数据写入目标的抽象。

[`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流的示例包括：

- [客户端上的 HTTP 请求](https://nodejs.cn/api/http.html#class-httpclientrequest)
- [在服务器上的 HTTP 响应](https://nodejs.cn/api/http.html#class-httpserverresponse)
- [文件系统写入流](https://nodejs.cn/api/fs.html#class-fswritestream)
- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)
- [TCP 套接字](https://nodejs.cn/api/net.html#class-netsocket)
- [子进程标准输入](https://nodejs.cn/api/child_process.html#subprocessstdin)
- [`process.stdout`](https://nodejs.cn/api/process.html#processstdout), [`process.stderr`](https://nodejs.cn/api/process.html#processstderr)

其中一些示例实际上是实现 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口的 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流。

所有的 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流都实现了 `stream.Writable` 类定义的接口。

虽然 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流的特定实例可能以各种方式不同，但所有的 `Writable` 流都遵循相同的基本使用模式，如下例所示：

```js
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data'); 
```

## 可写流-事件

### close

当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 `'close'` 事件。该事件表明将不再触发更多事件，并且不会发生进一步的计算。

### **drain**

如果对 **[`stream.write(chunk)`](https://nodejs.cn/api/stream.html#writablewritechunk-encoding-callback) 的调用返回 `false`**，则 `'drain'` 事件将在适合继续将数据写入流时触发。

```js
// 向提供的可写流中写入数据一百万次。
// Be attentive to back-pressure.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Last time!
        writer.write(data, encoding, callback);
      } else {
        // 看看我们是该继续，还是等一等。
        // 不要传递回调，因为我们还没完成。
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // 不得不提前停下来
      // 一旦耗尽，再写一些。
      writer.once('drain', write);
    }
  }
} 
```

### error

如果在写入或管道数据时**发生错误**，则会触发 `'error'` 事件。监听器回调在调用时传入单个 `Error` 参数。

> **除非**在创建流时将 **[`autoDestroy`](https://nodejs.cn/api/stream.html#new-streamwritableoptions)** 选项设置**为 `false`**，否则当触发 `'error'` 事件时**将关闭流**。

> 在 `'error'` 之后，**除 `'close'` 之外**不再触发其他事件（包括 `'error'` 事件）。

### finish

表示流操作**已经完成**。

在**调用 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback) 方法之后**，并且所有**数据**都**已刷新到底层系统**，则触发 `'finish'` 事件。

> 在出现错误的情况下，不触发 `'finish'`。

```js
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('所有写操作现在都完成了.');
});
writer.end('This is the end\n'); 
```

### **pipe**

当在可读流上调用 [`stream.pipe()`](https://nodejs.cn/api/stream.html#readablepipedestination-options) 方法，将此可写流**添加到其目标集**时，则触发 `'pipe'` 事件。

```js
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer); 
```

### **unpipe**

当在 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流上调用 [`stream.unpipe()`](https://nodejs.cn/api/stream.html#readableunpipedestination) 方法时，则会触发 `'unpipe'` 事件，从其**目标集合中删除此 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)。**

> 当 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流管道进入它时，如果此 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流触发错误，则这也会触发。

```js
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer); 
```

## 可写流-方法

### cork()

`writable.cork()` 方法强制所有**写入**的数据都缓存在**内存中**。当**调用 [`stream.uncork()`](https://nodejs.cn/api/stream.html#writableuncork) 或 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback) 方法**时，缓冲的数据将被写入。

这是一种优化技术：**软塞**，用于在一系列**写入操作之间缓冲数据**，并在合适的时机**一次性**地发送它们，从而**提高性能**。

这种技术对于在一段时间内**频繁地写入小块数据**到流中的情况非常有用，因为它可以**减少I/O调用**的次数，从而提高性能。特别是在**涉及网络**或**文件系统**等**慢速 I/O 操作**时，软塞可以显著**降低系统开销**。

> `writable.uncork()` 会将它们全部传给 `writable._writev()`。

> 这可以**防止**在等待处理**第一个小块**时正在**缓冲数据**的**行头阻塞**情况。但是，在不实现 `writable._writev()` 的情况下使用 `writable.cork()` 可能会对吞吐量产生不利影响。

### destroy()

**销毁流**可选地触发 `'error'` 事件，并且触发 `'close'` 事件（除非 `emitClose` 设置为 `false`）。

在此调用之后，则可写流已结束，随后对 `write()` 或 `end()` 的调用将导致 `ERR_STREAM_DESTROYED` 错误。

这是销毁流的销毁性和直接的方式。先前对 `write()` 的调用可能没有排空，并且可能触发 `ERR_STREAM_DESTROYED` 错误。

**如果数据应该在关闭之前刷新，或者在销毁流之前等待 `'drain'` 事件，则使用 `end()` 而不是销毁。**

```js
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error 
```

```js
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED 
// 一旦 destroy() 被调用，任何进一步的调用都将是空操作

```

### **closed**

触发 `'close'` 之后为 `true`。

### **destroyed**

在调用 [`writable.destroy()`](https://nodejs.cn/api/stream.html#writabledestroyerror) 之后是 `true`。

### end()

```js
writable.end([chunk[, encoding]][, callback])
/**
chunk <string> | <Buffer> | <Uint8Array> | <any> 
	可选的要写入的数据。
	对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。
	对于对象模式的流，chunk 可以是除 null 之外的任何 JavaScript 值。
	
encoding <string> chunk 为字符串时的编码

callback <Function> 流结束时的回调。

返回：<this>
*/
```

调用 `writable.end()` 方法表示**不再有数据写入 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)**。

可选的 `chunk` 和 `encoding` 参数允许在关闭流之前立即写入最后一个额外的数据块。

> 在调用 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback) 之后调用 [`stream.write()`](https://nodejs.cn/api/stream.html#writablewritechunk-encoding-callback) 方法将引发错误。

### **setDefaultEncoding()**

`writable.setDefaultEncoding()` 方法为 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流设置默认的 `encoding`。

```js
setDefaultEncoding('UTF-8')
```

### uncork()

`writable.uncork()` 方法会刷新自调用 [`stream.cork()`](https://nodejs.cn/api/stream.html#writablecork) 以来缓冲的所有数据。

当使用 [`writable.cork()`](https://nodejs.cn/api/stream.html#writablecork) 和 `writable.uncork()` 管理写入流的缓冲时，使用 `process.nextTick()` 推迟对 `writable.uncork()` 的调用。这样做允许对在给定 Node.js 事件循环阶段中发生的所有 `writable.write()` 调用进行批处理。

```js
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // 在第二次调用uncork()之前，不会刷新数据。
  stream.uncork();
});
// 如果在一个流上多次调用 writable.cork() 方法，则必须调用相同数量的 writable.uncork() 调用来刷新缓冲的数据。
```

### **writable**

如果调用 [`writable.write()`](https://nodejs.cn/api/stream.html#writablewritechunk-encoding-callback) 是安全的，则为 `true`，这意味着流没有被销毁、错误或结束。

### writableEnded

在调用 [`writable.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback) 之后是 `true`。

此属性不指示数据是否已刷新，为此则使用 [`writable.writableFinished`](https://nodejs.cn/api/stream.html#writablewritablefinished) 代替。

### writableFinished

在触发 [`'finish'`](https://nodejs.cn/api/stream.html#event-finish) 事件之前立即设置为 `true`。

### errored

如果流因错误而被销毁，则返回错误。

### writableHighWaterMark

返回创建此 `Writable` 时**传入**的 **`highWaterMark` 的值**。

### writableLength

此属性包含队列中**准备写入的字节数**（或对象数）。该值提供**有关 `highWaterMark`** 状态的**内省数据**。

### writableNeedDrain

如果流的缓冲区**已满**并且流将**触发 `'drain'`**，则为 `true`。

### **write**()

```js
writable.write(chunk[, encoding][, callback])
/**
chunk <string> | <Buffer> | <Uint8Array> | <any> 
	可选的要写入的数据。对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。
	对于对象模式的流，chunk 可以是除 null 之外的任何 JavaScript 值。
encoding <string> | <null> 
	如果 chunk 为字符串，则为编码。默认值：'utf8'
callback <Function> 
	当刷新此数据块时的回调。
返回：<boolean> false 
	如果流希望调用代码在继续写入附加数据之前等待 'drain' 事件触发；否则 true。
*/
```

`writable.write()` 方法将一些数据写入流，并在数据完全处理后调用提供的 `callback`。

如果发生错误，则 `callback` 将使用错误作为其第一个参数进行调用。

`callback` 是异步地调用，并且**在 `'error'` 事件触发之前**。

> 如果在接纳 `chunk` 后，内部缓冲区**小于**当创建流时配置的 **`highWaterMark`**，则**返回值为 `true`**。如果返回 `false`，则应停止进一步尝试将数据写入流，直到触发 [`'drain'`](https://nodejs.cn/api/stream.html#event-drain) 事件。

当流**没有排空时**，对 `write()` 的调用将缓冲 `chunk`，并**返回 false**。一旦所有当前缓冲的块都被排空（操作系统接受交付），则将触发 `'drain'` 事件。一旦 `write()` 返回 false，则**在 `'drain'` 事件触发之前不要写入更多块**。

> 虽然允许在未排空的流上调用 `write()`，但 Node.js 将缓冲所有写入的块，直到出现最大内存使用量，此时它将无条件中止。

> 即使在它中止之前，高内存使用量也会导致垃圾收集器性能不佳和高 RSS（通常不会释放回系统，即使在不再需要内存之后）。由于如果远程对等方不读取数据，TCP 套接字可能永远不会排空，因此写入未排空的套接字可能会导致可远程利用的漏洞。

> 在流未排空时写入数据对于 [`Transform`](https://nodejs.cn/api/stream.html#class-streamtransform) 来说尤其成问题，因为 `Transform` 流是默认暂停，直到它们被管道传输、或添加 `'data'` 或 `'readable'` 事件句柄。

如果要写入的数据可以按需生成或获取，则建议将逻辑封装成 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 并且使用 [`stream.pipe()`](https://nodejs.cn/api/stream.html#readablepipedestination-options)。但是，如果首选调用 `write()`，则可以使用 [`'drain'`](https://nodejs.cn/api/stream.html#event-drain) 事件遵守背压并避免内存问题：

```js
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// 在执行任何其他写操作之前，等待 cb 被调用。
write('hello', () => {
  console.log('写完了，现在再写');
}); 
```

另一个例子，用于文件写入流

```js
const fs = require('fs');

// 创建可写流
const writableStream = fs.createWriteStream('output.txt');

// 向可写流写入数据
writableStream.write('Hello, '); // 写入字符串数据
writableStream.write('world!'); // 再次写入字符串数据

// 写入 Buffer 数据
const bufferData = Buffer.from(' This is buffer data.', 'utf8');
writableStream.write(bufferData);

// 写入操作完成时调用的回调函数
writableStream.write(' The end.', () => {
  console.log('Data has been written.'); // 在写入完成时输出消息
});

// 检查写入缓冲区是否已满
const isBufferFull = writableStream.write(' Check buffer status.');
console.log('Buffer full:', !isBufferFull);

// 一般来说，不会立即调用 writable.write() 的回调函数，因为写入是异步的。
// 如果写入缓冲区已满，write() 方法会返回 false，表明写入缓冲区已满，可以继续写入时会触发 'drain' 事件。
// 您可以监听 'drain' 事件来知道何时可以继续写入。
writableStream.on('drain', () => {
  console.log('Buffer has been drained. You can continue writing.');
});

// 写入结束
writableStream.end();
```

## 可读流-示例

可读流是对消费数据源的抽象。

`Readable` 流的示例包括：

- [客户端上的 HTTP 响应](https://nodejs.cn/api/http.html#class-httpincomingmessage)
- [服务器上的 HTTP 请求](https://nodejs.cn/api/http.html#class-httpincomingmessage)
- [文件系统读取流](https://nodejs.cn/api/fs.html#class-fsreadstream)
- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)
- [TCP 套接字](https://nodejs.cn/api/net.html#class-netsocket)
- [子进程标准输出和标准错误](https://nodejs.cn/api/child_process.html#subprocessstdout)
- [`process.stdin`](https://nodejs.cn/api/process.html#processstdin)

所有的 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流都实现了 `stream.Readable` 类定义的接口。

## 可读流-两种读取模式

`Readable` 流以两种模式之一有效运行：**流动和暂停**。

这些模式与[对象模式](https://nodejs.cn/api/stream.html#object-mode)是分开的。[`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流可以处于或不处于对象模式，无论其是处于流动模式还是暂停模式。

- 在**流动模式**下，数据会**自动从底层系统读取**，并通过 [`EventEmitter`](https://nodejs.cn/api/events.html#class-eventemitter) 接口使用事件尽快提供给应用。
- 在**暂停模式**下，必须显式**调用 [`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 方法**以从流中**读取数据块**。

所有的 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流都**以暂停模式开始**，但可以通过以下方式之一**切换**到**流动模式**：

- 添加 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件句柄。
- 调用 [`stream.resume()`](https://nodejs.cn/api/stream.html#readableresume) 方法。
- 调用 [`stream.pipe()`](https://nodejs.cn/api/stream.html#readablepipedestination-options) 方法将数据发送到 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)。

`Readable` 可以使用以下方法之一**切换**回**暂停模式**：

- 如果**没有管道目标**，则通过**调用 [`stream.pause()`](https://nodejs.cn/api/stream.html#readablepause) 方法**。

- 如果**有管道目标**，则**删除所有管道目标**。可以通过**调用 [`stream.unpipe()`](https://nodejs.cn/api/stream.html#readableunpipedestination) 方法删除多个管道目标**。

- **添加 [`'readable'`](https://nodejs.cn/api/stream.html#event-readable) 事件**句柄会自动**使流停止流动**，并且必须通过 [`readable.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 来消费数据。

  > 如果**删除了 [`'readable'`](https://nodejs.cn/api/stream.html#event-readable) 事件**句柄，则如果**有 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件**句柄，**流**将再次开始**流动**。

要记住的重要概念是，在提供**消费或忽略该数据的机制**之前，**`Readable` 不会产生数据**。如果**消费机制被禁用或取消**，**`Readable` 将尝试停止生成数据**。

> 出于向后兼容性的原因，**删除 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件**处理程序**不会**自动**暂停流**。
>
> 此外，如果**有管道目标**，则**调用 [`stream.pause()`](https://nodejs.cn/api/stream.html#readablepause)** 将不能保证一旦这些目标耗尽并请求更多数据，流将保持暂停状态。

> 如果 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 切换到**流动模式**并且**没有消费者可用于处理数据，则数据将被丢失**。
>
> 例如，当调用 `readable.resume()` 方法而没有绑定到 `'data'` 事件的监听器时，或者当从流中删除 `'data'` 事件句柄时，就会发生这种情况。

## 可读流-三种状态

`Readable` 流的 "两种模式" 操作是对 `Readable` 流实现中发生的更复杂的内部状态管理的简化抽象。

具体来说，在任何给定的时间点，每个 `Readable` 都处于三种可能的状态之一：

- `readable.readableFlowing === null`
- `readable.readableFlowing === false` 可以理解为暂停
- `readable.readableFlowing === true` 可以理解为流动

> **当 `readable.readableFlowing` 为 `null` 时**，则**不提供消费流数据的机制**。因此，流**不会生成数据**。

> 在此状态下，为 **`'data'` 事件绑定监听器**、调用 **`readable.pipe()` 方法**、或调用 **`readable.resume()` 方法**会将 `readable.readableFlowing` **切换到 `true`**，从而使 `Readable` 在生成数据时开始主动触发事件。

> **调用 `readable.pause()`、`readable.unpipe()`** 或接收背压将导致 `readable.readableFlowing` **设置为 `false`**，暂时**停止事件的流动但不会停止数据的生成**。在此状态下，为 `'data'` 事件绑定监听器不会将 `readable.readableFlowing` 切换到 `true`。

```js
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing现在为false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing仍然为false。
pass.write('ok');  // 不会触发 'data'.
pass.resume();     // 必须调用以使流发出 'data'.
// readableFlowing现在为true
```

虽然 `readable.readableFlowing` 是 `false`，但数据可能会在流的内部缓冲区中累积。

## 可读流-事件

### close

当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 `'close'` 事件。该事件表明将不再触发更多事件，并且不会发生进一步的计算。

如果 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流是使用 `emitClose` 选项创建的，则始终会触发 `'close'` 事件。

### **data**

每当流将**数据块**的**所有权移交给消费者**时，则会**触发 `'data'` 事件**（转为流动模式时）。

每当通过**调用 `readable.pipe()`、`readable.resume()`、**或通过将**监听器回调绑定到 `'data'` 事件**而将流**切换到流动模式**时，**就会发生这种情况**。

每当**调用 `readable.read()` 方法**并且可以**返回数据块**时，**也**会**触发 `'data'` 事件**。

**将 `'data'` 事件**监听器**绑定到尚未显式暂停的流**，则会将流**切换到流动模式**。**数据**将在可用时**立即传入**。

如果使用 `readable.setEncoding()` 方法为流**指定了默认编码**，则监听器回调将把**数据块（chunk）**作为**字符串传递**；**否则**数据将**作为 `Buffer` 传递**。

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
}); 
```

### end

当流中**没有更多数据可供消费**时，则会触发 `'end'` 事件。

除非数据完全消耗，否则不会触发 `'end'` 事件。

这可以通过将流切换到流动模式来实现，或者通过重复调用 [`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 直到所有数据都被消费完。

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
}); 
```

### **error**

`'error'` 事件可以随时由 `Readable` 的实现触发。通常，如果底层流由于底层内部故障而无法生成数据，或者当流实现尝试推送无效数据块时，可能会发生这种情况。

### **pause（暂停）**

当调用 [`stream.pause()`](https://nodejs.cn/api/stream.html#readablepause) 并且 `readableFlowing` 不是 `false` 时，则会触发 `'pause'` 事件。

### resume（流动）

当调用 [`stream.resume()`](https://nodejs.cn/api/stream.html#readableresume) 并且 `readableFlowing` 不是 `true` 时，则会触发 `'resume'` 事件。

### **readable**

当有可从流中**读取的数据**或已**到达流的末尾**时，则将**触发 `'readable'` 事件**。

实际上，**`'readable'` 事件表明流有新的信息**（执行了 push）。如果数据**可用**，**则 [`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize)** 将**返回该数据**。

```js
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // 现在有一些数据可以阅读。
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```

> 如果已经到达流的末尾，则调用 [`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 将返回 `null` 并触发 `'end'` 事件。
>
> 如果从未读取任何数据，则也是如此。例如，在以下示例中，`foo.txt` 是一个空文件：
>
> ```js
> const fs = require('node:fs');
> const rr = fs.createReadStream('foo.txt');
> rr.on('readable', () => {
>   console.log(`readable: ${rr.read()}`);
> });
> rr.on('end', () => {
>   console.log('end');
> });
> ```
>
> 运行此脚本的输出是：
>
> ```bash
> $ node test.js
> readable: null
> end
> ```

在某些情况下，为 `'readable'` 事件绑定监听器会导致一些数据被读入内部缓冲区。

一般来说，`readable.pipe()` 和 `'data'` 事件机制比 `'readable'` 事件更容易理解。但是，处理 `'readable'` 可能会导致吞吐量增加。

如果**同时使用 `'readable'` 和 [`'data'`](https://nodejs.cn/api/stream.html#event-data)，则 `'readable'` 优先控制流**，即只有在**调用 [`stream.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 时才会触发 `'data'`**。`readableFlowing` 属性将变为 `false`。如果在删除 `'readable'` 时有 `'data'` 监听器，流将开始流动，即 `'data'` 事件将在不调用 `.resume()` 的情况下触发。

## 可读流-方法

### destroy()

销毁流可选地触发 `'error'` 事件，并且触发 `'close'` 事件（除非 `emitClose` 设置为 `false`）。在此调用之后，可读流将释放任何内部资源，随后对 `push()` 的调用将被忽略。

一旦 `destroy()` 被调用，任何进一步的调用都将是空操作，除了来自 `_destroy()` 的其他错误可能不会作为 `'error'` 触发。

实现者不应覆盖此方法，而应实现 [`readable._destroy()`](https://nodejs.cn/api/stream.html#readable_destroyerr-callback)。

### closed

触发 `'close'` 之后为 `true`。

### destroyed

在调用 [`readable.destroy()`](https://nodejs.cn/api/stream.html#readabledestroyerror) 之后是 `true`。

### isPaused()

`readable.isPaused()` 方法**返回 `Readable` 的当前运行状态（暂停还是流动）**。这主要由作为 `readable.pipe()` 方法基础的机制使用。

在大多数典型情况下，没有理由直接使用此方法。

```js
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false 
```

### pause()

`readable.pause()` 方法将**导致**处于流动模式的**流停止触发 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件**，**切换**出流动模式（就是**暂停模式**）。任何可用的数据都将保留在内部缓冲区中。

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('1秒内不会有额外的数据。');
  setTimeout(() => {
    console.log('现在数据将再次开始流动。');
    readable.resume();
  }, 1000);
});
```

如果**有 `'readable'` 事件监听器，则 `readable.pause()` 方法不起作用**（因为已经在暂停模式了，所以不起作用也应该）。

### pipe()

```js
readable.pipe(destination[, options])
/**
destination <stream.Writable> 写入数据的目标
options <Object> 管道选项
	end <boolean> 当读取结束时结束写入。默认值：true。
返回：<stream.Writable> 目标，如果它是 Duplex 或 Transform 流，则允许管道链
*/
```

`readable.pipe()` 方法**将 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流绑定到 `readable`**，使其自动**切换**到**流动模式**并**将**其**所有数据推送到绑定的 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)**。数据流将被自动管理，以便目标 `Writable` 流不会被更快的 `Readable` 流漫过。

以下**示例**将 `readable` 中的所有数据通过管道传输到名为 `file.txt` 的文件中：

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// 所有可读的数据都放入'file.txt'中。
readable.pipe(writable); 
```

可以将**多个 `Writable` 流**绑定到单个 `Readable` 流。

`readable.pipe()` 方法返回对目标流的引用，从而可以设置**管道流链**：

```js
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w); 
```

默认情况下，当源 **`Readable` 流触发 [`'end'`](https://nodejs.cn/api/stream.html#event-end)** 时，则在目标 **`Writable` 流**上**自动调用 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback)**，因此**目标不再可写**。

要禁用此默认行为，可以将 `end` 选项作为 `false` 传入，从而使目标流保持打开状态：

```js
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
}); 
```

> 一个重要的警告是，如果 `Readable` 流在处理过程中触发错误，则 `Writable` 目标不会自动关闭。如果发生错误，则需要手动关闭每个流以防止内存泄漏。

> [`process.stderr`](https://nodejs.cn/api/process.html#processstderr) 和 [`process.stdout`](https://nodejs.cn/api/process.html#processstdout) `Writable` 流在 Node.js 进程退出之前**永远不会关闭**，无论指定的选项如何。

### read()

```js
readable.read([size])
/**
size <number> 用于指定要读取的数据量的可选参数。
返回：<string> | <Buffer> | <null> | <any>
*/
```

`readable.read()` 方法从内部**缓冲区中读取数据并返回**。如果**没有数据**可以读取，则**返回 `null`**。

**默认情况**下，除非使用 `readable.setEncoding()` 方法指定了编码或流在对象模式下运行，否则数据将作为 **`Buffer`** 对象返回。



可选的 **`size` 参数**指定要读取的特定字节数。如果**无法读取 `size` 个字节**，则将**返回 `null`**（**例如缓存区剩余数据不足 size 个字节，则返回 null**），或者**流已结束**，在**这种情况**下，将**返回内部缓冲区中剩余的所有数据**。

上边这句话总结：read(size) 返回数据时，**要么数据满 size 个字节**，**要么流结束**。



如果**未指定 `size` 参数**，则将**返回**内部**缓冲区**中包含的**所有数据**。

> **`size` 参数必须小于或等于 1 GiB。**



`readable.read()` 方法应该只在暂停模式下操作的 `Readable` 流上调用。在流动模式下，会自动调用 `readable.read()`，直到内部缓冲区完全排空。

```js
const readable = getReadableStreamSomehow();

// 'readable'可能在数据被缓冲时被触发多次
readable.on('readable', () => {
  let chunk;
  console.log('流是可读的(缓冲区中接收到的新数据)');
  // 使用循环来确保我们读取了所有当前可用的数据
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end'将在没有更多可用数据时触发一次
readable.on('end', () => {
  console.log('到达流的末端。');
}); 
```

每次调用 `readable.read()` 都会返回一个数据块或 `null`。块不是串联的。需要 `while` 循环来消费当前缓冲区中的所有数据。

当**读取大文件时**，**`.read()` 可能会返回 `null`**（文件没有读完的情况下返回了 null），到目前为止**已经消费**了所有**缓冲的内容**，**但**是**还有**更多的**数据尚未缓冲**。在这种情况下，当缓冲区中有更多数据时，将**触发新的 `'readable'` 事件**。最后，当没有更多数据时，则将触发 `'end'` 事件。

因此，要从 `readable` 读取文件的全部内容，必须**跨越多个 `'readable'` 事件**来收集块：

```js
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
}); 
```

如果 `readable.read()` 方法返回数据块，则还将触发 `'data'` 事件。

### readable

如果调用 [`readable.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 是安全的，则为 `true`，这意味着流尚未被销毁或触发 `'error'` 或 `'end'`。

### readableEnded

当触发 [`'end'`](https://nodejs.cn/api/stream.html#event-end) 事件时变为 `true`。

### readableFlowing

如 [三种状态](https://nodejs.cn/api/stream.html#three-states) 部分所述，此属性反映 `Readable` 流的当前状态。

### resume()

`readable.resume()` 方法导致显式暂停的 `Readable` 流**恢复触发 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件**，将流**切换**到**流动模式**。

`readable.resume()` 方法可用于完全使用流中的数据，而无需实际处理任何数据：

```js
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('到了最后，却什么也没读。');
  })
```

如果有 `'readable'` 事件监听器，则 `readable.resume()` 方法不起作用（有 readable 事件表明开启了暂停模式，想流动也流不起来，所以readable 与 data 互斥的）。

### setEncoding()

```js
readable.setEncoding(encoding)
```

`readable.setEncoding()` 方法设置从 `Readable` 流中读取的数据的字符编码。

**默认情况**下，没有分配编码，流数据将**作为 `Buffer` 对象返回**。

设置编码会导致流数据作为指定编码的字符串而不是 `Buffer` 对象返回。

> 例如
>
> 调用 `readable.setEncoding('utf8')` 将导致输出数据被解释为 UTF-8 数据，并作为字符串传递。
>
> 调用 `readable.setEncoding('hex')` 将导致数据以十六进制字符串格式编码。

`Readable` 流将正确处理通过流传送的多字节字符，否则如果简单地将其作为 `Buffer` 对象从流中提取，这些字符将无法正确解码。

```js
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Got %d characters of string data:', chunk.length);
})
```



### unpipe()

`readable.unpipe([destination])` 方法**分离**先前使用 [`stream.pipe()`](https://nodejs.cn/api/stream.html#readablepipedestination-options) 方法附加的 **`Writable` 流**。

如果未指定 `destination`，则分离所有管道。

如果指定了 `destination`，但没有为其设置管道，则该方法不执行任何操作。

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// 所有可读的数据都放入'file.txt'，
// 但只在第一秒。
readable.pipe(writable);
setTimeout(() => {
  console.log('停止写入file.txt。');
  readable.unpipe(writable);
  console.log('手动关闭文件流。);
  writable.end();
}, 1000)
```

### unshift()

```js
readable.unshift(chunk[, encoding])
```

将 `chunk` 作为 `null` 传递表示流结束 (EOF)，其行为与 `readable.push(null)` 相同，之后无法写入更多数据。EOF 信号放在缓冲区的末尾，任何缓冲的数据仍将被刷新。

`readable.unshift()` 方法将一大块数据推回内部缓冲区。这在某些情况下很有用，在这种情况下，流正在被需要 "un-consume" 乐观地从源中提取的一些数据的代码使用，以便可以将数据传递给其他方。

在触发 [`'end'`](https://nodejs.cn/api/stream.html#event-end) 事件后不能调用 `stream.unshift(chunk)` 方法，否则将抛出运行时错误。

经常使用 `stream.unshift()` 的开发者应该考虑改用 [`Transform`](https://nodejs.cn/api/stream.html#class-streamtransform) 流。有关详细信息，请参阅 [流实现者的 API](https://nodejs.cn/api/stream.html#api-for-stream-implementers) 部分。

```js
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Found the header boundary.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remove the 'readable' listener before unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Now the body of the message can be read from the stream.
        callback(null, header, stream);
        return;
      }
      // Still reading the header.
      header += str;
    }
  }
} 拷贝
```

与 [`stream.push(chunk)`](https://nodejs.cn/api/stream.html#readablepushchunk-encoding) 不同，`stream.unshift(chunk)` 不会通过重置流的内部读取状态来结束读取过程。如果在读取期间调用 `readable.unshift()`（即从自定义流上的 [`stream._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 实现中调用），这可能会导致意外结果。在调用 `readable.unshift()` 后立即调用 [`stream.push('')`](https://nodejs.cn/api/stream.html#readablepushchunk-encoding) 将适当地重置读取状态，但是最好避免在执行读取过程中调用 `readable.unshift()`。

## 双工和转换流-示例

### stream.Duplex 类

双工流是同时实现 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 和 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口的流。

`Duplex` 流的示例包括：

- [TCP 套接字](https://nodejs.cn/api/net.html#class-netsocket)
- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)

#### duplex.allowHalfOpen

如果为 `false`，则流将在可读端结束时自动结束可写端。最初由 `allowHalfOpen` 构造函数选项设置，默认为 `true`。

这可以手动更改以更改现有 `Duplex` 流实例的半打开行为，但必须在触发 `'end'` 事件之前更改。

### stream.Transform 类

转换流是 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流，其中输出以某种方式与输入相关。与所有 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流一样，`Transform` 流同时实现 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 和 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口。

`Transform` 流的示例包括：

- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)

#### transform.destroy([error])

- `error` [](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 返回：[](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Operators/this)

销毁流，并可选择触发 `'error'` 事件。在此调用之后，转换流将释放所有内部资源。实现者不应覆盖此方法，而应实现 [`readable._destroy()`](https://nodejs.cn/api/stream.html#readable_destroyerr-callback)。`Transform` 的 `_destroy()` 的默认实现也会触发 `'close'`，除非 `emitClose` 设置为 false。

一旦调用了 `destroy()`，任何进一步的调用都将是空操作，并且除了 `_destroy()` 之外的任何其他错误都不会作为 `'error'` 触发。



## stream静态方法

### stream.Readable.from()

```js
stream.Readable.from(iterable[, options])
/**
readableStream <ReadableStream>
options <Object>
	encoding <string>
	highWaterMark <number>
	objectMode <boolean>
	signal <AbortSignal>
返回：<stream.Readable>
*/
```

用于从迭代器中创建可读流的实用方法。

```js
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
})
```

出于性能原因，调用 `Readable.from(string)` 或 `Readable.from(buffer)` 不会迭代字符串或缓冲区以匹配其他流语义。

如果将包含 promise 的 `Iterable` 对象作为参数传递，可能会导致未处理的拒绝。

```js
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]); 
```
