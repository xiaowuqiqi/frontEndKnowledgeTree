---
title: AbortController
order: 6
group:
  order: 5
  title: webAPI
---
# AbortController 学习

**AbortController（中断控制器）** 接口表示一个控制器对象，它允许您在需要时**中止一个或多个Web请求**。

你可以使用 `AbortController()` 构造函数创建一个新的 `AbortController` 对象。与异步操作的通信是使用 `AbortSignal` 对象完成的。

## [`AbortController.signal`](https://web.nodejs.cn/en-US/docs/Web/API/AbortController/signal) 

返回一个 AbortSignal 对象实例，该实例可用于**与异步操作通信或中止异步操作**。

## [`AbortController.abort()`](https://web.nodejs.cn/en-US/docs/Web/API/AbortController/abort)

在异步操作完成之前**中止该操作**。可以**中止获取请求、使用任何响应体和流**。

## 案例

[在下面的代码片段中，我们的目标是使用Fetch API](https://web.nodejs.cn/en-US/docs/Web/API/Fetch_API)下载视频。

我们首先使用 AbortController() 构造函数创建一个控制器，然后**使用 [`AbortController.signal`](https://web.nodejs.cn/en-US/docs/Web/API/AbortController/signal) 获取**对其关联的 **AbortSignal 对象的引用**。

当获取请求被启动时，我们将 AbortSignal 作为一个选项传入**请求的 options 对象（{signal}）**。这将**信号和控制器与获取请求关联起来**，并允许我们通过调用 **AbortController.abort() 来中止它**，如下面的第二个事件侦听器所示。

```js
let controller;
const url = "video.mp4";

const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  if (controller) {
    controller.abort();
    console.log("Download aborted");
  }
});

function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;
  fetch(url, { signal })
    .then((response) => {
      console.log("Download complete", response);
    })
    .catch((err) => {
      console.error(`Download error: ${err.message}`);
    });
}
```

> 注意:当调用 abort() 时，fetch() promise 会以 DOMException 类型的错误（名称为 AbortError）rejects。
