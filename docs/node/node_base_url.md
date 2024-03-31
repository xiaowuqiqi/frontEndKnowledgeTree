---
title: url
nav: node
group:
  title: node笔记
  order: 0
order: 4
---
# node 笔记-URL

![image-20240321114810620](./node学习.assets/image-20240321114810620.png)

## 简介

`url` 模块提供了两套 API 来处理 URL：

一个是旧版本遗留的 API，

一个是实现了 [WHATWG标准](http://nodejs.cn/s/fKgW8d)的新 API。

WHATWG 的 API 与遗留的 API 的区别如下。 在下图中，URL `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` 上方的是遗留的 `url.parse()` 返回的对象的属性。 下方的则是 WHATWG 的 `URL` 对象的属性。

URL 字符串是结构化的字符串，包含多个含义不同的组成部分。 解析字符串后返回的 URL 对象，每个属性对应字符串的各个组成部分。

![image-20240331143558457](./node_base_url.assets/image-20240331143558457.png)

使用 WHATWG API 解析网址字符串：

```js
const myURL =
  new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

使用旧版 API 解析 URL 字符串：

```js
const url = require('node:url');
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

## 属性

### url.hash *

```js
let myURL = new URL('https://example.org/foo#bar');
console.log(myURL.href); // https://example.org/foo#bar
myURL.hash = 'baz';
console.log(myURL.href); // https://example.org/foo#baz
```

### url.host *

域名不包括协议，包括端口

```js
myURL = new URL('http://localhost:8000/esms/cost-list/list');
myURL.host = 'localhost:8001';
console.log(myURL.href); // http://localhost:8001/esms/cost-list/list
```

### url.hostname *

域名不包括协议，不包括端口

```js
myURL = new URL('http://localhost:8000/esms/cost-list/list');
myURL.hostname = 'wz';
console.log(myURL.href); // http://wz:8000/esms/cost-list/list
```

### url.href *

全部 url

```js
myURL = new URL('http://localhost:8000/esms/cost-list/list');
console.log(myURL.href); // 'http://localhost:8000/esms/cost-list/list'
```

### url.origin *

域名包括协议

```js
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// 打印 https://example.org
```

### url.password

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.password);
// 打印 xyz
```

### url.username

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.username);
// 打印 abc
```

### url.pathname *

路由，不包含 query 和 hash

```js
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// 打印 /abc/xyz
```

### url.port

```js
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// 打印 8888
```

### url.protocol

```js
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// 打印 https:
```

### url.search *

```js
// 1
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);// 打印 ?123
//2
const myURL = new URL('https://example.org/abc?a=123&pass=武术');
console.log(myURL.search); // ?a=123&pass=%E6%AD%A6%E5%B1%95

//获取参数（重要）
const myURL = new URL('https://example.org/abc?a=true&b=%E6%AD%A6%E5%B1%95')
console.log(querystring.decode(myURL.search.substr(1))); // {a: "true", b: "武术"}

//添加参数（重要）
const obj = {
  a: true,
  b: '武术',
};
const myURL = new URL('https://example.org/abc')
myURL.search=querystring.encode(obj)
console.log(myURL.href); // https://example.org/abc?a=true&b=%E6%AD%A6%E5%B1%95
```

## querystring

`querystring` 模块提供用于**解析和格式化 URL 查询字符串的实用工具**。 它可以使用以下方式访问：

```js
const querystring = require('querystring');
```

### querystring.decode()

decode 用于**解码**。string => object

`querystring.decode()` 函数是 `querystring.parse()` 的别名。

### querystring.encode()

encode 用于**编码**。object => string

`querystring.encode()` 函数是 `querystring.stringify()` 的别名。

### querystring.parse(str[, sep[, eq[, options]]]) *

- `str` 要解析的 URL 查询字符串。
- `sep` 用于在查询字符串中分隔键值对的子字符串。**默认值:** `'&'`。
- `eq` 用于在查询字符串中分隔键和值的子字符串。**默认值:** `'='`。
- `options` 
  - `decodeURIComponent` 解码查询字符串中的百分比编码字符时使用的函数。**默认值:** `querystring.unescape()`。
  - `maxKeys` 指定要解析的键的最大数量。指定 `0` 可移除键的计数限制。**默认值:** `1000`。

querystring.parse() 方法将 URL 查询字符串 `str` 解析为键值对的集合。

> 注意：在使用 parse 方法时不要把url都放进去 "http:/baidu.com?a=a"，只放 "a=a" 进去。

例如，查询字符串 `'foo=bar&abc=xyz&abc=123'` 被解析为：

```js
//querystring.parse('foo=bar&abc=xyz&abc=123')

{
  foo: 'bar',
  abc: ['xyz', '123']
}

//querystring.decode('a=%20%E6%AD%A6%E5%B1%95&b=true'));

{a: " 武术", b: "true"}
```

### querystring.stringify(obj[, sep[, eq[, options]]]) *

- `obj` 要序列化为 URL 查询字符串的对象。
- `sep` 用于在查询字符串中分隔键值对的子字符串。**默认值:** `'&'`。
- `eq` 用于在查询字符串中分隔键和值的子字符串。**默认值:** `'='`。
- `options`
  - `encodeURIComponent` 在查询字符串中将 URL 不安全字符转换为百分比编码时使用的函数。**默认值:** `querystring.escape()`。

querystring.stringify() 方法通过迭代对象的自身属性从给定的 `obj` 生成 URL 查询字符串。

```js
// querystring.encode({ a: '我', b: true })

"a=%20%E6%AD%A6%E5%B1%95&b=true"
```

### 案例

```js
let myURL = new URL('http://www.baidu.com/esms/cost-list');

const obj = {
  a: 1,
  b: '测试',
  c: ['a', 'b#']
}
let search = querystring.encode(obj)
console.log(search) // a=1&b=%E6%B5%8B%E8%AF%95&c=a&c=b%23

myURL.search = search;
console.log(myURL.href)
// http://www.baidu.com/esms/cost-list?a=1&b=%E6%B5%8B%E8%AF%95&c=a&c=b%23

const params = querystring.decode(myURL.search.slice(1)) // 删掉多出来的'?'
console.log(params) // { a: '1', b: '测试', c: [ 'a', 'b#' ] }
```

## 全局方法

补充js的全局方法。

decodeURI、decodeURIComponent

encodeURI、encodeURIComponent

> 注意 node 中的 querystring 模块，他会**自动进行**百分号编码，所以就不需要以上四个方法。

### encodeURI

用于 URI 编码，编码为百分号编码。

```js
encodeURI('a= 武术&b=true')
// "a=%20%E6%AD%A6%E5%B1%95&b=true"
```

### encodeURIComponent

同 encodeURI 方法，但是他可以编译**非ASCII的部分其他字符**（如：：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号）

> 注意：该方法会编译 / ? &。

```js
encodeURIComponent("http://www.w3school.com.cn/p 1/") // encodeURI则不会编码 http://
encodeURIComponent(",/?:@&=+$#")

// http%3A%2F%2Fwww.w3school.com.cn%2Fp%201%2F
// %2C%2F%3F%3A%40%26%3D%2B%24%23
```

### decodeURI

decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。

```js
decodeURI('http%3A%2F%2Fwww.w3school.com.cn%2Fp%201%2F')
//解码只解码了空格 %20 ，像 / ？ &都没有解码，需要使用 decodeURIComponent 方法
// "http%3A%2F%2Fwww.w3school.com.cn%2Fp 1%2F"
```

### decodeURIComponent

```js
decodeURIComponent('http%3A%2F%2Fwww.w3school.com.cn%2Fp%201%2F')

// "http://www.w3school.com.cn/p 1/"
```

### 
