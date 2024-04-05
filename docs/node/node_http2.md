---
title: HTTP-res&req
nav: Node
group:
  title: node笔记
  order: 0
order: 8
---

# node 笔记-HTTP-res&req

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## IncomingMessage

继承：stream.Readable，只读流

`IncomingMessage` 对象由 [`http.Server`](https://nodejs.cn/api/http.html#class-httpserver) 或 [`http.ClientRequest`](https://nodejs.cn/api/http.html#class-httpclientrequest) 创建。

并分别作为**第一个参数传给 [`'request'`](https://nodejs.cn/api/http.html#event-request) 和 [`'response'`](https://nodejs.cn/api/http.html#event-response) 事件**。它可用于访问**响应状态、标头和数据**。

### close 事件

### complete *

如果已接收并**成功解析**完整的 HTTP 消息，**则 `message.complete` 属性将为 `true`**。

此属性作为一种确定客户端或服务器是否在连接终止之前完全传输消息的方法特别有用：

```js
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {// 这里是 ClientRequest.response 事件
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
}); 
```

### destroy()

在接收到 `IncomingMessage` 的套接字上调用 `destroy()`。如果提供了 `error`，则在套接字上触发 `'error'` 事件，并将 `error` 作为参数传给该事件的任何监听器。

### headers *

请求/响应头对象。

标头名称和值的键值对。标头名称是小写的。

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers); 
```

### headersDistinct

类似于 [`message.headers`](https://nodejs.cn/api/http.html#messageheaders)，但没有连接逻辑，并且值始终是字符串数组，即使对于仅收到一次的标头也是如此。

```js
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct); 
```

### rawHeaders *

接收到的**原始标头保留在 `rawHeaders` 属性中**。

**键和值**在**同一个列表中**。它不是元组列表。因此，**偶数**偏移是**键**值，**奇数**偏移是关联的**值**。

标头名称不小写，重复项不合并。

```js
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders); 
```

### httpVersion

在服务器请求的情况下，客户端发送的 HTTP 版本。在客户端响应的情况下，连接到服务器的 HTTP 版本。可能是 `'1.1'` 或 `'1.0'`。

### method *

**仅对从 [`http.Server`](https://nodejs.cn/api/http.html#class-httpserver) 获得的请求有效。**

请求方法作为字符串。只读。示例：`'GET'`, `'DELETE'`.

### statusCode *

**仅对从 [`http.ClientRequest`](https://nodejs.cn/api/http.html#class-httpclientrequest) 获得的响应有效。**

3 位 HTTP 响应状态码。E.G.`404`。

### statusMessage *

**仅对从 [`http.ClientRequest`](https://nodejs.cn/api/http.html#class-httpclientrequest) 获得的响应有效。**

HTTP 响应状态消息（原因短语）。E.G.`OK` 或 `Internal Server Error`。

### url **

**仅对从 [`http.Server`](https://nodejs.cn/api/http.html#class-httpserver) 获得的请求有效。**

请求的网址字符串。这仅包含实际 HTTP 请求中存在的网址。接受以下请求：

```http
GET /status?name=ryan HTTP/1.1
Accept: text/plain
```

要将**网址解析**为它的部分：（重要）

```js
new URL(request.url, `http://${request.headers.host}`);
```

当 `request.url` 为 `'/status?name=ryan'` 且 `request.headers.host` 为 `'localhost:3000'` 时：

```js
$ node
> new URL(request.url, `http://${request.headers.host}`)
URL {
  href: 'http://localhost:3000/status?name=ryan',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
} 
```



## ServerResponse

**继承自 [http.OutgoingMessage](https://nodejs.cn/api/http.html#class-httpoutgoingmessage)** ，此对象由 HTTP 服务器内部创建，而不是由用户创建。

它作为**第二个参数**传给 **[`'request'`](https://nodejs.cn/api/http.html#event-request) 事件。**

### close 事件 *

表示**响应已完成**，或者其底层连接提前终止（在响应完成之前）。

### finish 事件 *

**发送响应时**触发。

更具体地说，当响应头和正文的**最后一段**已**移交给操作系统**以**通过网络传输时**，则将触发此事件。这**并不意味着**客户端已收到任何东西。

### addTrailers()

此方法向响应添加 HTTP 尾随标头（标头，但位于消息末尾）。

仅当响应使用**分块编码时才会触发标尾**；**如果不是**（例如，如果请求是 HTTP/1.0），它们将被**静默丢弃**。

```js
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end(); 
```

### cork()

参见 [`writable.cork()`](https://nodejs.cn/api/stream.html#writablecork)。用于小块数据一次写入。

### uncork()

### end() *

```js
response.end([data[, encoding]][, callback])
/**
data <string> | <Buffer> | <Uint8Array>
encoding <string>
callback <Function>
返回：<this>
*/
```

此方法向服务器触发信号，表明**已发送所有响应标头和正文**；该服务器应认为此**消息已完成**。`response.end()` 方法必须在每个响应上调用。

如果指定了 `data`，则其效果类似于调用 [`response.write(data, encoding)`](https://nodejs.cn/api/http.html#responsewritechunk-encoding-callback) 后跟 `response.end(callback)`。

如果指定了 `callback`，则将在响应流完成时调用。

### destroy() *

**销毁请求**。**可选地触发 `'error'` 事件**，并**触发 `'close'` 事件**。调用它会导致响应中的剩余数据被丢弃并销毁套接字。

### destroyed

在调用 [`request.destroy()`](https://nodejs.cn/api/http.html#requestdestroyerror) 之后是 `true`。

### flushHeaders()

**刷新请求头。**

出于效率原因，Node.js 通常会缓冲请求头，直到调用 `request.end()` 或写入第一块请求数据。然后尝试将请求头和数据打包到单个 TCP 数据包中。这通常是需要的（节省了 TCP 往返），但是当**第一个数据**直到可能**很晚**才发送时才需要。`request.flushHeaders()` **绕过优化**并**启动请求**。

### getHeader() **

读取**请求的标头**。该名称不区分大小写。返回值的类型取决于提供给 [`request.setHeader()`](https://nodejs.cn/api/http.html#requestsetheadername-value) 的参数。

```js
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[] 
```

### getHeaderNames() *

返回包含当前传出**标头**的唯一**名称**的**数组**。所有标头名称均为**小写**。

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie'] 
```

### getHeaders() *

返回当前传出**标头**的**浅拷贝**。由于使用了浅拷贝，因此无需额外调用各种与标头相关的 http 模块方法即可更改数组值。返回对象的**键**是标头**名称**，**值**是相应的**标头值**。所有标头名称均为**小写**。

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] } 
```

### hasHeader() *

如果 `name` 标识的标头当前设置在传出标头中，则返回 `true`。标头名称匹配不区分大小写。

```js
const hasContentType = response.hasHeader('content-type'); 
```

### removeHeader() *

**删除**排队等待**隐式发送**的**标头**。

```js
response.removeHeader('Content-Encoding'); 
```

### req **

对原始的 HTTP `request` 对象的引用。(http.IncomingMessage)

### sendDate *

如果为真，则 **Date 标头**将**自动生成**并在响应中发送，如果它尚未出现在标头中。**默认为真**。

> 这应该只在测试时被禁用；HTTP 要求在响应中使用 Date 标头。

### setHeader() **

为**隐式标头设置单个标头值**。如果该标头已经存在于待发送的标头中，则其值将被替换。

```js
response.setHeader('Content-Type', 'text/html');
```

或者

```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']); 
```

当标头已使用 [`response.setHeader()`](https://nodejs.cn/api/http.html#responsesetheadername-value) 设置时，则它们将与任何传给 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers) 的标头合并，其中传给 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers) 的标头优先。

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
}); 
```

> 如果调用了 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers) 方法而该方法没有被调用，则会直接将提供的标头值写入网络通道，而不进行内部缓存，标头的 [`response.getHeader()`](https://nodejs.cn/api/http.html#responsegetheadername) 不会产生预期的结果。
>
> 如果希望在将来可能进行检索和修改时逐步填充标头，则使用 [`response.setHeader()`](https://nodejs.cn/api/http.html#responsesetheadername-value) 而不是 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers)。

### setTimeout()

设置套接字的超时值。

### socket

对底层套接字的引用。

> 通常用户不会想要访问这个属性。特别是，由于协议解析器附加到套接字的方式，套接字将不会触发 `'readable'` 事件。在 `response.end()` 之后，该属性为空。

```js
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

### statusCode **

> 默认值：`200`

使用**隐式标头**（不显式调用 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers)）时，此属性控制在**标头刷新时**将**发送到客户端**的**状态码**。

```js
response.statusCode = 404;
```

响应头发送到客户端后，该**属性**表示**发送出去的状态码**。

### statusMessage *

当使用**隐式标头**（不显式调用 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers)）时，此属性控制在**标头刷新时**将**发送到客户端**的**状态消息**。如果保留为 `undefined`，则将使用状态码的标准消息。

### strictContentLength

如果设置为 `true`，Node.js 将**检查 `Content-Length`** 标头值和**正文大小**（以字节为单位）**是否相等**。与 `Content-Length` 标头值不匹配将导致抛出 `Error`，由 `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](https://nodejs.cn/api/errors.html#err_http_content_length_mismatch) 标识。默认 false。

### writableEnded **

在**调用 [`response.end()`](https://nodejs.cn/api/http.html#responseenddata-encoding-callback) 之后是 `true`**。此属性**不指示数据**是否**已刷新**，为此则使用 [`response.writableFinished`](https://nodejs.cn/api/http.html#responsewritablefinished) 代替。

```js
  if(res.writableEnded)return; 
  // 如果 end 调用过，再次调用会报错
  // code: 'ERR_STREAM_WRITE_AFTER_END'
  res.writeHead(404, {
    'content-type':'text/plain'
  })
  res.end('网址未找到')
```

### writableFinished *

如果所有数据都已**在 [`'finish'`](https://nodejs.cn/api/http.html#event-finish) 事件触发之前**立即刷新到底层系统，则为 `true`。

### write() **

如果此方法被调用且 **[`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers)** 还**没**被**调用**，则会切换到**隐式**的**标头模式**并刷新隐式的标头。

这会发送一块响应正文。可以多次调用此方法以提供正文的连续部分。

> 当请求方法或响应状态不支持内容时，不允许写入正文。如果尝试写入正文以获取 HEAD 请求或作为 `204` 或 `304` 响应的一部分，则会抛出代码为 `ERR_HTTP_BODY_NOT_ALLOWED` 的同步 `Error`。

`chunk` 可以是字符串或缓冲区。如果 `chunk` 是字符串，则第二个参数指定如何将其编码为字节流。当刷新数据块时将调用 `callback`。

这是原始的 HTTP 正文，与可能使用的更高级别的多部分正文编码无关。

**第一次**调用 [`response.write()`](https://nodejs.cn/api/http.html#responsewritechunk-encoding-callback) 时，它会将**缓存**的**标头信息**和**正文**的**第一个块**发送**给客户端**。

**第二次**调用 [`response.write()`](https://nodejs.cn/api/http.html#responsewritechunk-encoding-callback) 时，Node.js 会**假定数据**将被**流式传输**，并**单独**发送新数据。也就是说，响应被缓冲到正文的第一个块。

如果整个数据被**成功**刷新到**内核缓冲区**，则**返回 `true`**。如果所有或部分数据在用户**内存中排队**，则返回 **`false`**。当缓冲区**再次空闲时**，则将**触发 `'drain'`**。

### writeContinue()

向客户端发送 HTTP/1.1 100 Continue 消息，指示应发送请求正文。请参阅 `Server` 上的 [`'checkContinue'`](https://nodejs.cn/api/http.html#event-checkcontinue) 事件。

### writeEarlyHints()

向客户端发送带有 Link 标头的 HTTP/1.1 103 Early Hints 消息，指示用户代理可以预加载/预连接链接的资源。

### writeHead() **

向请求发送响应头。状态码是 3 位的 HTTP 状态码，如 `404`。最后一个参数 `headers` 是响应头。可选地给定人类可读的 `statusMessage` 作为第二个参数。

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body); 
```

此方法**只能**在消息上**调用一次**，并且必须在**调用 [`response.end()`](https://nodejs.cn/api/http.html#responseenddata-encoding-callback) 之前**调用。

> 如果在**调用**此**之前调用了 [`response.write()`](https://nodejs.cn/api/http.html#responsewritechunk-encoding-callback) 或 [`response.end()`](https://nodejs.cn/api/http.html#responseenddata-encoding-callback)**，**则**将计算**隐式**/可变的**标头**并调用此函数。

> 当标头已使用 [`response.setHeader()`](https://nodejs.cn/api/http.html#responsesetheadername-value) 设置时，则它们将与任何传给 [`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers) 的标头合并，其中传给 **[`response.writeHead()`](https://nodejs.cn/api/http.html#responsewriteheadstatuscode-statusmessage-headers) 的标头优先**。

> 如果调用了此方法，且还没调用 [`response.setHeader()`](https://nodejs.cn/api/http.html#responsesetheadername-value)，则会直接将提供的标头值写入网络通道且内部不缓存，在标头上 [`response.getHeader()`](https://nodejs.cn/api/http.html#responsegetheadername) 不会产生预期的结果。如果需要逐步填充标头并在未来进行潜在的检索和修改，则改用 [`response.setHeader()`](https://nodejs.cn/api/http.html#responsesetheadername-value)。

`Content-Length` 以字节而不是字符读取。使用 [`Buffer.byteLength()`](https://nodejs.cn/api/buffer.html#static-method-bufferbytelengthstring-encoding) 来确定正文的长度（以字节为单位）。

### writeProcessing()

向客户端发送 HTTP/1.1 102 Processing 消息，表示应发送请求正文。

## ClientRequest

继承 OutgoingMessage，此对象**从 [`http.request()`](https://nodejs.cn/api/http.html#httprequestoptions-callback) 内部创建**并返回。

> 它表示一个**正在进行的请求**，其标头已经排队。使用 [`setHeader(name, value)`](https://nodejs.cn/api/http.html#requestsetheadername-value)、[`getHeader(name)`](https://nodejs.cn/api/http.html#requestgetheadername)、[`removeHeader(name)`](https://nodejs.cn/api/http.html#requestremoveheadername) API 时，标头仍然是可变的。实际标头将与第一个数据块一起发送或在调用 [`request.end()`](https://nodejs.cn/api/http.html#requestenddata-encoding-callback) 时发送。

在 **[`'ClientRequest.response'`](https://nodejs.cn/api/http.html#event-response) 事件期间**，可以向**响应对象**添加监听器；特别是**监听 `'data'` 事件**。

> 如果没有添加 [`'ClientRequest.response'`](https://nodejs.cn/api/http.html#event-response) 句柄，则响应将被完全丢弃。但是，如果添加了 [`'ClientRequest.response'`](https://nodejs.cn/api/http.html#event-response) 事件处理程序，则必须使用来自响应对象的数据，方法是在出现 `'readable'` 事件时调用 `response.read()`，或者添加 `'data'` 处理程序，或者通过调用 `.resume()` 方法。在数据被消费之前，不会触发 `'end'` 事件。此外，在读取数据之前，它将消耗内存，最终导致 '进程内存不足' 错误。

> 为了向后兼容，如果注册了 `'error'` 监听器，则 `res` 只会触发 `'error'`。

> 设置 `Content-Length` 标头以限制响应正文大小。如果 [`response.strictContentLength`](https://nodejs.cn/api/http.html#responsestrictcontentlength) 设置为 `true`，与 `Content-Length` 标头值不匹配将导致抛出 `Error`，由 `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](https://nodejs.cn/api/errors.html#err_http_content_length_mismatch) 标识。

> `Content-Length` 值应该以字节为单位，而不是字符。使用 [`Buffer.byteLength()`](https://nodejs.cn/api/buffer.html#static-method-bufferbytelengthstring-encoding) 来确定正文的长度（以字节为单位）。

### close 事件

表示请求已完成，或者其底层连接提前终止（在响应完成之前）。

### connect 事件

每次服务器**使用 `CONNECT` 方法响应请求时触发**。如果未监听此事件，则接收 `CONNECT` 方法的客户端将关闭其连接。

```js
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// 创建HTTP隧道代理
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 连接到原始服务器
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

### continue 事件

当服务器发送 '100 继续' HTTP 响应时触发，通常是因为请求包含“Expect:100-继续'。这是客户端应该发送请求正文的指令。

### finish 事件 *

当**发送请求时触发**。更具体地说，当响应头和正文的**最后一段**已**移交**给**操作系统**以通过网络传输时，则将触发此事件。这并不意味着服务器已经收到任何东西。

### information 事件

当服务器**发送 1xx 中间响应**（不包括 101 升级）时**触发**。此事件的监听器将接收一个对象，其中包含 HTTP 版本、状态码、状态消息、键值标头对象和带有原始标头名称及其各自值的数组。

```js
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

### response 事件 **

```js
// response <http.IncomingMessage>
```

当接收到对此**请求的响应时**触发。此事件仅触发一次。

### timeout 事件

当底层套接字因不活动而超时时触发。这仅通知套接字已空闲。必须手动销毁请求。

### cork()

### end() *

**完成发送请求**。如果正文的任何部分未发送，则会将它们刷新到流中。如果请求被分块，则将发送终止的 `'0\r\n\r\n'`。

如果指定了 `data`，则相当于调用 [`request.write(data, encoding)`](https://nodejs.cn/api/http.html#requestwritechunk-encoding-callback) 后跟 `request.end(callback)`。

如果**指定了 `callback`，则将在请求流完成时调用**。

### destroy() *

**销毁请求**。**可选地触发 `'error'` 事件**，并触发 `'close'` 事件。调用它会导致响应中的剩余数据被丢弃并销毁套接字。

### flushHeaders()

出于效率原因，Node.js 通常会缓冲请求头，直到调用 `request.end()` 或写入第一块请求数据。然后尝试将请求头和数据打包到单个 TCP 数据包中。

这通常是需要的（节省了 TCP 往返），但是当第一个数据直到可能很晚才发送时才需要。**`request.flushHeaders()` 绕过优化并启动请求**。

### getHeader() *

读取请求的标头。该名称不区分大小写。

```js
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[] 
```

### getHeaderNames() *

返回包含当前传出标头的唯一名称的数组。所有标头名称均为小写。

### getHeaders() *

返回当前传出标头的浅拷贝。由于使用了浅拷贝，因此无需额外调用各种与标头相关的 http 模块方法即可更改数组值。返回对象的键是标头名称，值是相应的标头值。所有标头名称均为小写。

### getRawHeaderNames() 

返回包含当前传出原始标头的唯一名称的数组。标头名称返回并设置了它们的确切大小写。

### hasHeader() *

如果 `name` 标识的标头当前设置在传出标头中，则返回 `true`。标头名称匹配不区分大小写。

```js
const hasContentType = request.hasHeader('content-type'); 
```

### path *

请求路径。

### method *

请求方法。

### host *

请求主机。

### protocol *

请求协议。

### removeHeader() *

**删除**已定义到标头对象中的标头。

```js
request.removeHeader('Content-Type'); 
```

### setHeader() *

为标头对象设置单个标头值。如果该标头已经存在于待发送的标头中，则其值将被替换。在此处使用字符串数组发送具有相同名称的多个标头。非字符串值将不加修改地存储。因此，[`request.getHeader()`](https://nodejs.cn/api/http.html#requestgetheadername) 可能返回非字符串值。但是，非字符串值将转换为字符串以进行网络传输。

```js
request.setHeader('Content-Type', 'application/json'); 
```

```js
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`); 
```

### setTimeout ()

一旦套接字被分配给这个请求并被连接，则 [`socket.setTimeout()`](https://nodejs.cn/api/net.html#socketsettimeouttimeout-callback) 将被调用。

### writableEnded *

在调用 [`request.end()`](https://nodejs.cn/api/http.html#requestenddata-encoding-callback) 之后是 `true`。此属性不指示数据是否已刷新，为此则使用 [`request.writableFinished`](https://nodejs.cn/api/http.html#requestwritablefinished) 代替。

### writableFinished *

如果所有数据都已在 [`'finish'`](https://nodejs.cn/api/http.html#event-finish) 事件触发之前立即刷新到底层系统，则为 `true`。

### write() *

发送一块正文。此方法可以被多次调用。如果没有设置 `Content-Length`，则数据将自动使用 HTTP 分块传输编码进行编码，以便服务器知道数据何时结束。`Transfer-Encoding: chunked` 标头会被添加。需要调用 [`request.end()`](https://nodejs.cn/api/http.html#requestenddata-encoding-callback) 来完成发送请求。

`encoding` 参数是可选的，仅当 `chunk` 是字符串时才适用。默认为 `'utf8'`。

`callback` 参数是可选的，将在刷新此数据块时调用，但前提是该块非空。

如果整个数据被成功刷新到内核缓冲区，则返回 `true`。如果所有或部分数据在用户内存中排队，则返回 `false`。当缓冲区再次空闲时，则将触发 `'drain'`。

当使用空字符串或缓冲区调用 `write` 函数时，则什么都不做并等待更多输入。

## OutgoingMessage

继承：Stream，只写流

该类作为 [`http.ClientRequest`](https://nodejs.cn/api/http.html#class-httpclientrequest) 和 [`http.ServerResponse`](https://nodejs.cn/api/http.html#class-httpserverresponse) 的父类。从 HTTP 事务的参与者的角度来看，这是抽象的传出消息。

### drain 事件 *

当消息的缓冲区再次空闲时触发。

### finish 事件 *

当**传输成功完成**时触发。

### prefinish 事件

调用 `outgoingMessage.end()` 后触发。触发事件时，所有数据都已处理，但不一定完全刷新。

### addTrailers()

添加 HTTP 尾标（标头，但在消息末尾）到消息。

仅当消息经过分块编码时才会触发标尾。如果没有，则块头将被默默丢弃。

### appendHeader()

将**单个标头值**附加到**标头对象**。

如果该值为数组，则相当于多次调用该方法。

如果标头**没有先前的值**，则**相当于**调用 **[`outgoingMessage.setHeader(name, value)`](https://nodejs.cn/api/http.html#outgoingmessagesetheadername-value)**。

> 根据创建客户端请求或服务器时 `options.uniqueHeaders` 的值，这将导致标头多次发送或单次发送，并使用 `; `连接值。

### getHeader() *

获取具有给定名称的 HTTP 标头的值。如果未设置该标头，则返回值为 `undefined`。

### getHeaderNames() *

### getHeaders() *

### hasHeader() *

### removeHeader() *

### setHeader() *

### setHeaders() *

### pipe() *

覆盖继承自旧版的 `Stream` 类（`http.OutgoingMessage` 的父类）的 `stream.pipe()` 方法。

调用此方法将抛出 `Error`，因为 `outgoingMessage` 是只写流。

### cork()

### destroy() *

销毁消息。一旦套接字与消息关联并连接，则该套接字也将被销毁。

### end() *

完成传出消息。如果正文的任何部分未发送，则会将它们刷新到底层系统。

如果消息被分块，则它将发送终止块 `0\r\n\r\n`，并发送块尾（如果有）。

> 如果指定了 `chunk`，则相当于调用 `outgoingMessage.write(chunk, encoding)`，后跟 `outgoingMessage.end(callback)`。

> 如果提供了 `callback`，则在消息结束时调用（相当于 `'finish'` 事件的监听器）。

### flushHeaders() 

刷新消息标头。

> 出于效率原因，Node.js 通常会缓冲消息头，直到调用 `outgoingMessage.end()` 或写入第一块消息数据。然后它尝试将标头和数据打包到单个 TCP 数据包中。

> 通常是需要的（节省了 TCP 往返），但不是在第一个数据没有被发送的时候，直到可能很晚。`outgoingMessage.flushHeaders()` 绕过优化并启动消息。

### socket

对底层套接字的引用。通常，用户不会希望访问此属性。

调用 `outgoingMessage.end()` 后，该属性将被清空。

### write()

发送一块正文。此方法可以被多次调用。

`encoding` 参数仅在 `chunk` 是字符串时才相关。默认为 `'utf8'`。

`callback` 参数是可选的，当此数据被刷新时将被调用。

如果整个数据被成功刷新到内核缓冲区，则返回 `true`。如果所有或部分数据在用户内存中排队，则返回 `false`。当缓冲区再次空闲时将触发 `'drain'` 事件。

### writableLength

缓冲的字节数。

## 响应案例 *

### **解析请求体数据**

req 继承自 IncomingMessage。

`IncomingMessage` 是一个**可读流**，因此您可以像处理其他可读流一样处理它。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  let body = ''; // 用于存储请求体数据

  // 监听请求的 'data' 事件，获取请求体数据
  req.on('data', (chunk) => {
    body += chunk; // 将数据块拼接到 body 变量中
  });

  // 监听请求的 'end' 事件，表示请求体数据已经全部接收完成
  req.on('end', () => {
    // 在请求体接收完成后，可以对接收到的数据进行处理
    console.log('Received request body:', body);

    // 发送响应
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Received request body:\n' + body);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

此外还可以**使用 body-parser 包**解析请求体数据。

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

### 文件上传

如果文件上传可以**使用 multer 包**。

```js
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'dist'))
  },
  filename: function (req, file, cb) {
    console.log('fileas', file)
    cb(null, `${file.fieldname}-${Date.now()}.${file.originalname.split('.')[1]}`)
  }
})
const upload = multer({storage})
const fileData = async (req, res, fieldsOpts = []) => {
  const multerUpload = promisify(upload.fields(fieldsOpts))
  await multerUpload(req, res)
  return {body: req.body, files: req.files}
}

const put = async (req, res) => {
  try {
    const {body, files} = await fileData(req, res, [
      {name: 'testFile', maxCount: 1}
    ]);
    console.log('put', body, files);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      isSucceed: true,
      mesage: body
    }))
  } catch (e) {
    if (e.code === 'LIMIT_UNEXPECTED_FILE') {
      res.writeHead(400, {
        'Content-Type': 'text/plain'
      })
      res.end('错误，该属性不能为文件类型--' + e.field)
    } else {
      throw e;
    }
  }
}
```

## 备注

### node http 隐式标头和显示标头区别

在 Node.js 中，HTTP 请求和响应都可以包含标头（header），它们是包含元数据的重要组成部分。标头可以分为两种类型：隐式标头（implicit headers）和显式标头（explicit headers）。

#### 隐式标头（implicit headers）：

隐式标头是在写入响应主体之前自动发送的标头。在使用 `response.write()` 或 `response.end()` 发送响应主体时，Node.js 会自动发送一些默认的标头，例如 Content-Length 和 Transfer-Encoding。这些标头不需要明确地设置，而是由 Node.js 根据响应主体的内容自动设置。

#### 显式标头（explicit headers）：

显式标头是通过调用 `response.setHeader()` 或 `response.writeHead()` 显式设置的标头。这些标头需要您明确地设置，以覆盖默认的隐式标头或提供其他自定义的标头。显式设置标头允许您更精细地控制响应的标头信息。

区别：

1. **自动设置**：隐式标头是由 Node.js 自动设置的，而显式标头是由开发人员明确设置的。
2. **自动发送时机**：隐式标头是在响应主体发送之前自动发送的，而显式标头可以在任何时候设置，但通常在发送响应之前设置。
3. **默认设置**：隐式标头是由 Node.js 根据情况自动设置的，默认情况下不需要手动干预，而显式标头需要您显式地设置。

总的来说，隐式标头是 Node.js 在发送 HTTP 响应时自动添加的一些默认标头，而显式标头则是开发人员根据需要明确设置的标头。显式标头允许您更灵活地控制响应的元数据。

### 隐式标题有那些

在 Node.js 中，隐式标头是在发送 HTTP 响应时自动添加的一些默认标头，它们不需要您明确地设置，而是根据情况自动添加到响应中。一些常见的隐式标头包括：

1. `Content-Length`：指定响应主体的长度（以字节为单位）。
2. `Content-Type`：指定响应主体的 MIME 类型。
3. `Transfer-Encoding`：指定传输编码，例如 chunked。
4. `Date`：指定响应生成的日期和时间。
5. `Server`：指定服务器的软件信息。

