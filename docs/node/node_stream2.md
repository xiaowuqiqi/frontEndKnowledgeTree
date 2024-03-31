---
title: stream-自定义与实现
nav: Node
group:
  title: node笔记
  order: 0
order: 6
---

# node 笔记-stream-自定义与实现

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## 实现可写流

```js
new stream.Writable([options])
/**
option
	shighWaterMark <number> stream.write() 开始返回 false 时的缓冲级别。
		默认值：16384 (16 KiB)，或 16 用于 objectMode 流。
	decodeStrings <boolean> 是否将传递给 stream.write() 的 string 编码为 Buffer
		（使用 stream.write() 调用中指定的编码），然后再将它们传递给 stream._write()。
		不转换其他类型的数据（即 Buffer 不解码为 string）。
		设置为 false 将阻止 string 被转换。默认值：true。
	defaultEncoding <string> 当没有将编码指定为 stream.write() 的参数时使用的默认编码。默认值：'utf8'。
	objectMode <boolean> stream.write(anyObj) 是否为有效操作。
		设置后，如果流实现支持，则可以写入字符串、Buffer 或 Uint8Array 以外的 JavaScript 值。
		默认值：false。
	emitClose <boolean> 流被销毁后是否应该触发 'close'。默认值：true。
	write <Function> stream._write() 方法的实现。
	writev <Function> stream._writev() 方法的实现。
	destroy <Function> stream._destroy() 方法的实现。
	final <Function> stream._final() 方法的实现。
	construct <Function> stream._construct() 方法的实现。
	autoDestroy <boolean> 此流是否应在结束后自动调用自身的 .destroy()。默认值：true。
	signal <AbortSignal> 表示可能取消的信号。
*/
```

> 在对应于传递的 `AbortSignal` 的 `AbortController` 上调用 `abort` 的行为方式与在可写流上调用 `.destroy(new AbortError())` 的方式相同。
>
> ```js
> const { Writable } = require('node:stream');
> 
> const controller = new AbortController();
> const myWritable = new Writable({
>   write(chunk, encoding, callback) {
>     // ...
>   },
>   writev(chunks, callback) {
>     // ...
>   },
>   signal: controller.signal,
> });
> // Later, abort the operation closing the stream
> controller.abort(); 
> ```

### _construct

```js
writable._construct(callback)
/**
callback 当流完成初始化时调用此函数（可选地带有错误参数）。
*/
```

> 不得直接调用 `_construct()` 方法。它可能由子类实现，如果是这样，将仅由内部 `Writable` 类方法调用。

> 这个可选函数将在流构造函数返回后立即调用，延迟任何 `_write()`、`_final()` 和 `_destroy()` 调用，直到调用 `callback`。这对于在使用流之前初始化状态或异步初始化资源很有用。

```js
const {Writable} = require('node:stream');
const fs = require('node:fs');
const path = require('path');

class WriteStream extends Writable {
  constructor(filename, options) {
    super(options);
    this.filename = filename;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.filename, 'w+', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    console.log('_write', chunk.toString())
    setTimeout(()=>{
      console.log('setTimeout',chunk.toString())
      callback() // 执行了 callback 方法，就说明写入完成，这里用异步模拟写入过程。
    },1000)
    // fs.write(this.fd, chunk.toString(), callback);
    // position 没有写入，证明每次写入位置为累加的上次的。
  }

  _destroy(err, callback) {
    console.log('_destroy', err)
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}

const writeStream = new WriteStream(path.join(__dirname, './test2'),
  {
    highWaterMark: 5,
  }
)
let i = 10;
writeData();

writeStream.on('error', (error) => {
  console.log(error)
});

function writeData() {
  console.log('writeData')
  let ok = true;
  do {
    i--;
    console.log('i', i)
    // const bufferData = Buffer.from(i.toString(), 'utf8');
    if (i === 0) {
      writeStream.end(i.toString());
    } else {
      // 看看我们是该继续，还是等一等。
      // 不要传递回调，因为我们还没完成。
      ok = writeStream.write(i.toString()); // 执行了多少次 write 就会执行多少次 _write
    }
  } while (i > 0 && ok);
  if (i > 0) {
    console.log('drain')
    // 不得不提前停下来
    // 一旦耗尽，再写一些。
    writeStream.once('drain', writeData);
  }
}
```

执行结果

```bash
writeData # 执行 writeData 方法
i 9 # 因为缓存区没有满，所以写入数据进入缓存
i 8
i 7
i 6
i 5
drain # 缓存区满了，注册 drain 事件
_write 9 # 然后一次执行刚刚 write() 方法对应的 _write() 方法。
setTimeout 9 # 执行 callback 方法，证明这次的写入操作完成。
_write 8
setTimeout 8
_write 7
setTimeout 7
_write 6
setTimeout 6
_write 5
setTimeout 5
writeData
i 4 # 缓存区排空后
_write 4
i 3
i 2
i 1
i 0
setTimeout 4
_write 3
setTimeout 3
_write 2
setTimeout 2
_write 1
setTimeout 1
_write 0
setTimeout 0
_destroy null # 最后执行 _destroy
```

### _write

```js
writable._write(chunk, encoding, callback)
/**
chunk <Buffer> | <string> | <any> 要写入的 Buffer，从 string 转换为 stream.write()。如果流的 decodeStrings 选项是 false 或者流在对象模式下运行，则块将不会被转换并且将是传递给 stream.write() 的任何内容。
encoding <string> 如果块是字符串，则 encoding 是该字符串的字符编码。如果块是 Buffer，或者如果流以对象模式运行，则 encoding 可能会被忽略。
callback <Function> 当对提供的块的处理完成时调用此函数（可选地带有错误参数）。
*/
```

所有 `Writable` 流实现都**必须提供 [`writable._write()`](https://nodejs.cn/api/stream.html#writable_writechunk-encoding-callback) 和/或 [`writable._writev()`](https://nodejs.cn/api/stream.html#writable_writevchunks-callback) 方法**来**将数据发送到底层资源**。

> [`Transform`](https://nodejs.cn/api/stream.html#class-streamtransform) 流提供了它们自己的 [`writable._write()`](https://nodejs.cn/api/stream.html#writable_writechunk-encoding-callback) 实现。

> 此函数不得由应用代码直接调用。它应该由子类实现，并且只能由内部 `Writable` 类方法调用。

**`callback` 函数**必须在 `writable._write()` 内部**同步调用或异步调用**（即不同的时钟周期），以**触发写入成功**完成或因错误而失败的信号。**如果调用失败**，传递给 **`callback` 的第一个参数必须是 `Error` 对象**，**如果写入成功，则必须是 `null`**。

在**调用 `writable._write()` 和调用 `callback` 之间**发生的**对 `writable.write()` 的所有调用**都会导致**写入的数据被缓冲**。

如果**缓冲区满了，则触发  [`'drain'`](https://nodejs.cn/api/stream.html#event-drain) 事件**。**初次调用 writable.write 方法**时，**不会触发 _write()** ，**直到缓冲区满**或者 end **才会开始触发 _write()（触发 _write()次数等于writable.write 方法执行的次数）** 。

> 调用 `callback` 时，流可能会触发 [`'drain'`](https://nodejs.cn/api/stream.html#event-drain) 事件。如果流实现能够一次处理多个数据块，则应实现 `writable._writev()` 方法。

> 如果在构造函数选项中将 `decodeStrings` 属性显式设置为 `false`，则 `chunk` 将保持传递给 `.write()` 的同一对象，并且可能是字符串而不是 `Buffer`。这是为了支持对某些字符串数据编码进行优化处理的实现。在这种情况下，`encoding` 参数将指示字符串的字符编码。否则，可以安全地忽略 `encoding` 参数。

> `writable._write()` 方法带有下划线前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

### _writev

```js
writable._writev(chunks, callback)
/**
chunks <Object[]> 要写入的数据。该值是一个 <Object> 数组，每个数组代表要写入的离散数据块。这些对象的属性是：
	chunk <Buffer> | <string> 包含要写入的数据的缓冲区实例或字符串。
		如果创建 Writable 时将 decodeStrings 选项设置为 false 并将字符串传递给 write()，
		则 chunk 将是一个字符串。
	encoding <string> chunk 的字符编码。如果 chunk 是 Buffer，则 encoding 将是 'buffer'。
	callback <Function> 当对提供的块的处理完成时要调用的回调函数（可选地带有错误参数）。
*/
```

此函数不得由应用代码直接调用。它应该由子类实现，并且只能由内部 `Writable` 类方法调用。

`writable._writev()` 方法可以在能够一次处理多个数据块的流实现中作为 `writable._write()` 的补充或替代方法来实现。如果实现并且有来自先前写入的缓冲数据，则将调用 `_writev()` 而不是 `_write()`。

`writable._writev()` 方法带有下划线前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

### _destroy

流结束后都会调用 _destroy 方法。

```js
writable._destroy(err, callback)
/**
err <Error> 可能的错误。
callback <Function> 采用可选的错误参数的回调函数。
*/
```

> `_destroy()` 方法被 [`writable.destroy()`](https://nodejs.cn/api/stream.html#writabledestroyerror) 调用。它可以被子类覆盖，但不能直接调用。

> 此外，`callback` 不应与 async/await 混合使用，一旦它在 promise 被解析时执行。

### _final

```js
writable._final(callback)
// callback 完成写入任何剩余数据后调用此函数（可选地带有错误参数）。
```

> 不得直接调用 `_final()` 方法。它可能由子类实现，如果是这样，将仅由内部 `Writable` 类方法调用。

这个可选函数将在流关闭之前被调用，**延迟 `'finish'` 事件**直到 `callback` 被调用。

这对于在流结束之前关闭资源或写入缓冲数据很有用。



### 写入时出错

在处理 [`writable._write()`](https://nodejs.cn/api/stream.html#writable_writechunk-encoding-callback)、[`writable._writev()`](https://nodejs.cn/api/stream.html#writable_writevchunks-callback) 和 [`writable._final()`](https://nodejs.cn/api/stream.html#writable_finalcallback) 方法期间发生的错误必须通过调用回调并将错误作为第一个参数传递来传播。从这些方法中抛出 `Error` 或手动触发 `'error'` 事件会导致未定义的行为。

**如果 `Readable` 流**在 `Writable` 触发**错误**时通过管道传输到 `Writable` 流，则 `Readable` 流将被取消传输。

```js
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid')); // 如果储存则调用 callback，传入 error
    } else {
      callback();
    }
  },
})
```

### 可写流示例

下面说明了一个相当简单（并且有些毫无意义）的自定义 `Writable` 流实现。虽然这个特定的 `Writable` 流实例没有任何真正特别的用处，但该示例说明了自定义 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流实例的每个必需元素：

```js
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
} 
```

## 实现可读流

自定义 Readable 流必须调用 new stream.Readable([options]) 构造函数并实现 readable._read() 方法。

```js
new stream.Readable([options])
/**
options <Object>
	highWaterMark <number> 在停止从底层资源读取之前存储在内部缓冲区中的最大 字节数。默认值：16384 (16 KiB)，或 16 用于 objectMode 流。
	encoding <string> 如果指定，则缓冲区将使用指定的编码解码为字符串。默认值：null。
	objectMode <boolean> 此流是否应表现为对象流。这意味着 stream.read(n) 返回单个值，而不是大小为 n 的 Buffer。默认值：false。
	emitClose <boolean> 流被销毁后是否应该触发 'close'。默认值：true。
	read <Function> stream._read() 方法的实现。
	destroy <Function> stream._destroy() 方法的实现。
	construct <Function> stream._construct() 方法的实现。
	autoDestroy <boolean> 此流是否应在结束后自动调用自身的 .destroy()。默认值：true。
	signal <AbortSignal> 表示可能取消的信号。
*/
```

> 在对应于传递的 `AbortSignal` 的 `AbortController` 上调用 `abort` 的行为方式与在创建的可读对象上调用 `.destroy(new AbortError())` 的方式相同。
>
> ```js
> const { Readable } = require('node:stream');
> const controller = new AbortController();
> const read = new Readable({
>   read(size) {
>     // ...
>   },
>   signal: controller.signal,
> });
> // Later, abort the operation closing the stream
> controller.abort(); 
> ```

### _construct()

```js
readable._construct(callback)
/**
callback 当流完成初始化时调用此函数（可选地带有错误参数）。
*/
```

> 不得直接调用 `_construct()` 方法。它可能由子类实现，如果是这样，将仅由内部 `Readable` 类方法调用。

> 这个可选函数将被流构造函数安排在下一个时钟周期，延迟任何 `_read()` 和 `_destroy()` 调用，直到调用 `callback`。这对于在使用流之前初始化状态或异步初始化资源很有用。

自定义可读流，案例，重要：

```js
// 实现文件读取的自定义可读流，用于测试。
const {Readable} = require('node:stream');
const fs = require('node:fs');
const path = require('path');

class ReadStream extends Readable {
  constructor(filename, options) {
    super(options);
    this.filename = filename;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _read(n) {
    // 这里的n来自 highWaterMark 值。
    console.log('_read_n',n);
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      // 这里注意的是，position 参数为 null 时,表示会记录读出的文件位置，
      // 读了n个字节后，再次执行fs.read()，指针位置自动后移n个字节。
      if (err) {
        console.log('报错')
        this.destroy(err);
      } else {
        console.log('fs.read_bytesRead:', bytesRead)
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }

  _destroy(err, callback) {
    console.log('destroy',err)
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}

const readStream = new ReadStream(path.join(__dirname, './test'),
  {
    highWaterMark: 9,
  }
)

readStream.on('readable', () => {
  let chunk;
  console.log('readable')
  while (true) {
    chunk = readStream.read(7);
    if(null !== chunk){
      // 这里的 read(size) 的 size 是在缓冲区拿取数据。
      console.log('chunk:', chunk);
      console.log('chunkString:', chunk.toString());
    }else{
      console.log('break')
      break;
    }
  }
})
readStream.on('end', () => {
  console.log('end')
})
readStream.on('close', () => {
  console.log('close')
})
```

执行结果

```bash
_read_n 9
fs.read_bytesRead: 9 # fs.read 获取到9个字节到缓存区
readable # 执行 readable 事件
_read_n 9 # 执行过 push() 方法并且执行过 read() 方法（已准备好），会触发 _read() 方法。
chunk: <Buffer 31 32 33 34 35 36 37>
chunkString: 1234567 # readable 事件中，在缓存区拿取的7个字节数据
break # 继续循环执行 read() 时，发现剩余数据不足7个，则 read 无法读取，返回null
fs.read_bytesRead: 4 #_read() 方法中，fs.read 读取剩余数据（这时缓存区已经缓存了所有数据）
readable # 执行 readable 事件
_read_n 9 # 执行过 push() 方法并且执行过 read() 方法（已准备好），会触发 _read() 方法。（因为这时已经没有数据了，所以后边会push(null)）
break # 执行 read() 时，发现剩余数据不足7个，则 read 无法读取，返回null
fs.read_bytesRead: 0 # fs.read 没有读取到数据，这时 push(null)
readable # 执行 readable 事件
chunk: <Buffer 38 39 30 75 0d 0a>
chunkString: 890u # 执行 read() 时，发现剩余数据不足7个，但是 null 已经 push 进入了，说明流结束 (EOF)，这时会把剩余数据返回，则返回 890
# 注意：read(size) 返回数据时，要么数据满 size 个字节，要么流结束。
break
end
destroy null
close
```

### _read()

```js
readable._read(size)
// size 传入值为：缓存区的大小（highWaterMark），注意这里的 size 和 实例.read() 参数不是一个值
```

> 此函数不得由应用代码直接调用。它应该由子类实现，并且只能由内部 `Readable` 类方法调用。

所有 `Readable` 流实现都**必须提供 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 方法**的实现以**从底层资源中获取数据，然后到缓存区**。

**调用 _read() 时机有两个条件**

**条件1**：**流准备好接受更多数据（已经执行了 read() 方法或者触发了 data 事件）**。

**条件2**： **`_read()`** 将在每次**调用 [`this.push(dataChunk)`](https://nodejs.cn/api/stream.html#readablepushchunk-encoding) 后再次调用**（如果不调用 push 方法，_read 只会执行一次，new 了 Readable 实例后就会执行）。

`_read()` 可能会继续从资源中读取并推送数据，直到 `readable.push()` 返回 `false`（就是 push 了 null）。

只有在停止后再次调用 `_read()` 时，它才会继续将额外的数据推入队列。

> 一旦调用了 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 方法，将**不会再次调用它**，**直到通过 [`readable.push()`](https://nodejs.cn/api/stream.html#readablepushchunk-encoding) 方法推送**更多**数据**。**空缓冲区**和**字符串**等空数据**不会**导致**调用** [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize)。

> [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 方法带有下划线前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

### _destroy()

流结束后都会调用 _destroy 方法。流结束后都会调用 _destroy 方法。

```js
readable._destroy(err, callback)
/**
err 可能的错误。
callback 采用可选的错误参数的回调函数。
*/
```

> `_destroy()` 方法被 [`readable.destroy()`](https://nodejs.cn/api/stream.html#readabledestroyerror) 调用。它可以被子类覆盖，但不能直接调用。

### push()

```js
readable.push(chunk[, encoding])
/**
chunk 要推入读取队列的数据块。对于不在对象模式下操作的流，`chunk` 必须是字符串、`Buffer` 或 `Uint8Array`。对于对象模式流，`chunk` 可以是任何 JavaScript 值。
encoding 字符串块的编码。必须是有效的 `Buffer` 编码，例如 `'utf8'` 或 `'ascii'`。
返回：`true` 如果可以继续推送额外的数据块；`false` 否则。
*/
```

当 `chunk` 为 `Buffer`、`Uint8Array`、`string` 时，会**将数据的 `chunk` 加入缓存区**，供流用户消费。**将 `chunk` 作为 `null` 传递表示流结束 (EOF)**，**之后无法写入更多数据**。

当 `Readable` 运行在**暂停模式**时，在 [`'readable'`](https://nodejs.cn/api/stream.html#event-readable) 事件触发时**调用 [`readable.read()`](https://nodejs.cn/api/stream.html#readablereadsize) 方法**可以**读出 `readable.push()` 添加的数据**。

当 `Readable` 在**流动模式**下运行时，添加了 `readable.push()` 的**数据**将**通过触发 `'data'` 事件来传递**。

`readable.push()` 方法被设计为尽可能灵活。例如，当封装提供某种形式的暂停/恢复机制和数据回调的底层源时，底层源可以由自定义 `Readable` 实例封装：

```js
// `_source` is an object with readStop() and readStart() methods,
// and an `ondata` member that gets called when it has data, and
// an `onend` member that gets called when the data is over.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Every time there's data, push it into the internal buffer.
    this._source.ondata = (chunk) => {
      // If push() returns false, then stop reading from source.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // When the source ends, push the EOF-signaling `null` chunk.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() will be called when the stream wants to pull more data in.
  // The advisory size argument is ignored in this case.
  _read(size) {
    this._source.readStart();
  }
}
```

`readable.push()` 方法用于将内容推入内部缓冲区。可以用 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 方法驱动。

> 对于非对象模式运行的流，如果 `readable.push()` 的 `chunk` 参数为 `undefined`，将被视为空字符串或缓冲区。有关详细信息，请参阅 [`readable.push('')`](https://nodejs.cn/api/stream.html#readablepush)。

### 读取时出错

在处理 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 期间**发生的错误**必须**通过 [`readable.destroy(err)`](https://nodejs.cn/api/stream.html#readable_destroyerr-callback) 方法传播**。从 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 中抛出 `Error` 或手动触发 `'error'` 事件会导致未定义的行为。

```js
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```

### 计数流示例

以下是 `Readable` 流的基本示例，它按升序触发从 1 到 1,000,000 的数字，然后结束。

```js
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
} 
```

## 实现双工流

[`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流是**同时实现 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 和 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 的流**，例如：TCP 套接字连接。

> 因为 JavaScript 不支持多重继承，所以扩展 `stream.Duplex` 类以实现 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流（与扩展 `stream.Readable` 和 `stream.Writable` 类相反）。

> `stream.Duplex` 类原型**继承自 `stream.Readable` 并寄生于 `stream.Writable`**，但由于在 `stream.Writable` 上覆盖了 [`Symbol.hasInstance`](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)，`instanceof` 将适用于两个基类。

自定义 `Duplex` 流必须调用 `new stream.Duplex([options])` 构造函数并**实现 [`readable._read()`](https://nodejs.cn/api/stream.html#readable_readsize) 和 `writable._write()` 方法。**

```js
new stream.Duplex(options)
/**
options <Object> 传给 Writable 和 Readable 构造函数。还有以下字段：
	allowHalfOpen <boolean> 如果设置为 false，则流将在可读端结束时自动结束可写端。默认值：true。
	readable <boolean> 设置 Duplex 是否可读。默认值：true。
	writable <boolean> 设置 Duplex 是否可写。默认值：true。
	readableObjectMode <boolean> 为流的可读端设置 objectMode。如果 objectMode 为 true，则无效。默认值：false。
	writableObjectMode <boolean> 为流的可写端设置 objectMode。如果 objectMode 为 true，则无效。默认值：false。
	readableHighWaterMark <number> 为流的可读端设置 highWaterMark。如果提供 highWaterMark，则无效。
	writableHighWaterMark <number> 为流的可写端设置 highWaterMark。如果提供 highWaterMark，则无效。
*/
```

> 使用管道时：
>
> ```js
> const { Transform, pipeline } = require('node:stream');
> const fs = require('node:fs');
> 
> pipeline(
>   fs.createReadStream('object.json')
>     .setEncoding('utf8'),
>   new Transform({
>     decodeStrings: false, // Accept string input rather than Buffers
>     construct(callback) {
>       this.data = '';
>       callback();
>     },
>     transform(chunk, encoding, callback) {
>       this.data += chunk;
>       callback();
>     },
>     flush(callback) {
>       try {
>         // Make sure is valid json.
>         JSON.parse(this.data);
>         this.push(this.data);
>         callback();
>       } catch (err) {
>         callback(err);
>       }
>     },
>   }),
>   fs.createWriteStream('valid-object.json'),
>   (err) => {
>     if (err) {
>       console.error('failed', err);
>     } else {
>       console.log('completed');
>     }
>   },
> ); 
> ```

### 双工流示例

下面说明了一个 `Duplex` 流的简单示例，它封装了一个假设的更底层的源对象，数据可以写入到该源对象中，并且可以从中读取数据，尽管使用的 API 与 Node.js 流不兼容。

下面说明了一个 `Duplex` 流的简单示例，它缓冲通过 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口传入的写入数据，这些数据通过 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 接口读回。

```js
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // The underlying source only deals with strings.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
} 
```
