---
title: workbox 预缓存
order: 6
group: 6 PWA
---

# workbox 预缓存

## workbox-precaching 预缓存**简介**

Service Worker 的一个功能是能够在**安装 Service Worker 时将一组文件保存到缓存**。这通常**称为“预缓存”**，因为您是在使用的 Service Worker 之前缓存内容。

> 这样做的主要原因是，它使开发者能够控制缓存，这意味着他们可以**确定文件的缓存时间和时长**，并且可以在不连接网络的情况下将文件提供给浏览器，这意味着可用于创建离线工作的 Web 应用。

## **工作原理**

`workbox-precaching` 会在 Service Worker 的 **[`install` 事件](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers#Install_and_activate_populating_your_cache)**期间**执行所有这些操作**。

**首次加载** Web 应用时，`workbox-precaching` 将查看您要**下载**的所有**资源**，**移除**所有**重复项**。

**再次访问**您的 Web 应用时，并且您有一个具有**不同预缓存资源**的**新 Service Worker** 时，**`workbox-precaching` 将查看新列表**，并根据**修订版本**的修订确定哪些资源是全新的，哪些现有**资源需要更新**。在新 Service Worker 的 **`install` 事件期间，任何新资源或更新修订版本都将添加到缓存中。**

在**触发其 `activate` 事件之前**，系统不会使用以下新的 Service Worker 响应请求。在 `activate` 事件中，**`workbox-precaching` 将检查**当前**网址[列表](https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=zh-cn#explanation_of_the_precache_list)**中已**不存在**的任何已**缓存资源**，并从缓存中**移除**这些资源。

每次安装并激活 Service Worker 时，`workbox-precaching` 都会执行这些步骤，以确保用户拥有最新的资源，并且仅下载已更改的文件。

## revision 

通过**增加 revision 参数**来标识文件是**否发生变化**的方法，我们可以利用这个**参数**将 **URL** 改造成**不重名**的形式。最简单的做法是，将 **revision** 以 Search 参数的方式**拼接**到 **URL 当中**。

### 代码实现

```js
let resource = {
  url: '/index.js',
  revision: 'abc'
}
let cacheKey = location.origin +
  resource.url +
  '?precache_url_revision=' +
  resource.revision

console.log(cacheKey)// 打印 http://127.0.0.1:8080/index.js?precache_url_revision=abc
```

我们可以通过实例化 URL 类对象来简化上述拼接过程：

```js
let cacheKeyURL = new URL(resource.url, location)
cacheKeyURL.searchParams.set('precache_url_revision', resource.revision)
let cacheKey = cacheKeyURL.href
```

当读取时，源码实现如下，先用 URL 构建，然后使用 match 方法读取对应换成。

```js
// 读取
if (requestURL === new URL(resource.url, location).href) {
  // 给资源请求 URL 拼接 precache_url_revision 参数，并作为键值查询
  let cacheKeyURL = new URL(requestURL, location)
  cacheKeyURL.searchParams.set('precache_url_revision', resource.revision)
  // 查找缓存资源
  cache.match(cacheKeyURL.href).then(response => {
    if (response != null) {
      // 资源匹配成功
    }
  })
}
```

## precache & precacheAndRoute & addRoute

调用 [`precacheAndRoute()`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#method-precacheAndRoute) 或 [`addRoute()`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#method-addRoute) 将**创建**与对预缓存网址的**请求匹配的[路由](https://developer.chrome.com/docs/workbox/modules/workbox-routing?hl=zh-cn)。**此路由中**使用[缓存优先](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#cache_first_cache_falling_back_to_network)策略**

### addRoute()

```ts
workbox-precaching.addRoute(options?: PrecacheRouteOptions,)
```

向 Service Worker **添加 `fetch` 监听器**，该监听器监听预缓存的资源对应的响应，然后选择**缓存优先的策略**。

### precache()

```ts
workbox-precaching.precache(entries: (string|PrecacheEntry)[],)
```

在 Service Worker **安装时**，将项**添加**到**预缓存列表**中，**移除**所有**重复项**并将文件存储在缓存中。此方法可多次调用。

> 请注意： 它只能预缓存文件。如需拦截响应网络请求，请调用 [`workbox-precaching.addRoute`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#method-addRoute)。

### precacheAndRoute()

此方法会将条目添加到预缓存列表中，并添加一个路由来响应提取事件。

### **详细代码实现**

参考：https://lavas-project.github.io/pwa-book/chapter05/4-precache.html

#### **存储（precache()）：**

**预缓存**功能封装成一个 **Precacher 类**，然后可以通过 **`precache()`** 方法**传入预缓存资源信息**。

```js
class Precacher {
  constructor ({
    cacheName = 'precache',
    searchKey = 'precache_url_revision'
  } = {}) {
    this.cacheName = cacheName
    this.searchKey = searchKey
    // 存储资源信息的列表
    this.resources = []
    // 初始化事件监听
    this.initEventListener()
  }

  initEventListener () {
    // 在 `install` 事件回调执行预缓存资源加载
    self.addEventListener('install', event => {
      event.waitUntil(
        // 缓存新增/变化的资源
        cacheResources(this.cacheName, this.resources)
      )
    })
  }

  precache (resources) {
    for (let resource of resources) {
      // 格式化资源信息
      let res = formatResource(this.searchKey, resource)
      this.resources.push(res)
    }
  }
}
```

其中 install 事件中所使用的 **`cacheResources()`** 方法会首先找出**新增或内容**发**生变化的资源**，然后**重新请求并缓存**。

```js
async function cacheResources (cacheName, resources) {
  let urls = resources.map(resource => resource.cacheKey)
  // 首先打开并缓存 CacheStorage 对象
  let cache = await caches.open(cacheName)
  // 获取已存储的所有资源键值信息
  let requests = await cache.keys()
  // 获取已存储的资源 URL
  let cachedURLs = requests.map(request => request.url)
  // 找出新增资源里面未存储过的资源 URL
  let updateURLs = urls.filter(url => !cachedURLs.includes(url))
  // 最后调用 cache.addAll() 缓存新增资源
  await cache.addAll(updateURLs)
}
```

调用 `precache()` 时，传入的资源信息可能是字符串或者对象，因此需要 **`formatResource()`** 方法将**资源信息格式化**，格式化过程包括 **URL 信息补全**以及**类型统一**。经过格式化后的资源信息对象将包含**两个属性**：**url** 为补全后的资源**原始 URL**，**cacheKey** 为资源存入缓存中的**键值**。

```js
function formatResource (searchKey, resource) {
  let originURL
  let cacheKeyURL
  // 当资源信息为字符串时，说明资源 URL 已经具有唯一性
  // 因此可以直接拿 URL 作为资源的存储键值
  if (typeof resource === 'string') {
    originURL = new URL(resource, location)
    cacheKeyURL = new URL(resource, location)
  }
  // 当资源信息为对象时，需要使用 revision 来生成资源存储键值
  else {
    originURL = new URL(resource.url, location)
    cacheKeyURL = new URL(resource.url, location)
    cacheKeyURL.searchParams.set(searchKey, resource.revision)
  }

  return {
    url: originURL.href,
    cacheKey: cacheKeyURL.href
  }
}
```

通过 Precacher 简单实现了**预缓存资源的加载**。

```js
let precacher = new Precacher()
precacher.precache([
  {
    url: '/index.html',
    revision: 'abc'
  },
  {
    url: '/index.js',
    revision: '1.0.1'
  },
  '/index.abc.css'
])
```

#### **清理（clearOldResources()）：**

我们一般**选择 `activate` 事件**回调来执行旧资源的**清理工作**，此时 Service Worker 已经安装完成，并且已经**进入激活阶段**，激活完成之后**新 Service Worker** 就已经**正式接管**并开始工作了，因此在这个阶段**清理旧缓存不会对旧 Service Worker 造成影响**，并且在 `activate` 事件的回调当中，**清理**过程**导致的**任何**出错**都**不会影响**到 **Service Worker 的激活**。

```js
class Precacher {
  // ...
  initEventListener () {
    // install ...

    // 添加 activate 事件监听清理旧资源
    self.addEventListener('activate', event => {
      event.waitUntil(
        // 清理旧缓存
        clearOldResources(this.cacheName, this.resources)
      )
    })
  }
}
```

其中 **`clearOldResources()`** 方法实现了对**旧预缓存**资源的**清理**，在实现思路上与前面的 `cacheResources()` 方法类似

```js
async function clearOldResources (cacheName, resources) {
  let urls = resources.map(resource => resource.cacheKey)
  // 首先打开并缓存 CacheStorage 对象
  let cache = await caches.open(cacheName)
  // 获取已存储的所有资源键值信息
  let requests = await cache.keys()
  // 找出新增的 URL
  // 获取已存储的资源 URL
  let cachedURLs = requests.map(request => request.url)
  // 找出不在资源列表信息当中的 URL
  let oldURLs = cachedURLs.filter(url => !urls.includes(url))
  // 最后调用 cache.delete() 删除旧资源
  await Promise.all(oldURLs.map(url => cache.delete(url)))
}
```

#### **请求响应策略（addRoute()）：**

预缓存资源的请求响应**采用 Cache First** 的策略。由于在预缓存资源加载阶段当中，为了**避免新旧资源重名**而**使用修改过的 URL 作为存储键值**，因此在**拦截**到的**预缓存请求**，也同样**需要**经过**修改**才能够**查找**到缓存的**资源**。

接下来给 Precacher 添加 **`addRoute()`** 方法实现**对资源的拦截与响应**：

```js
class Precacher {
  // ...

  addRoute () {
    // addRoute() 方法只需执行一次
    if (this.hasAdded) {
      return
    }
    this.hasAdded = true

    const cacheFirstHandler = cacheFirst({
      cacheName: this.cacheName
    })

    const router = new Router()
    router.registerRoute(
      request => {
        return this.resources.some(
          resource => resource.url === request.url
        )
      },
      request => {
        for (let resource of this.resources) {
          if (resource.url === request.url) {
            return cacheFirstHandler(new Request(resource.cacheKey))
          }
        }
      }
    )
  }
  // 将 precache() 和 addRoute() 合成一个方法
  precacheAndRoute (resources) {
    this.precache(resources)
    this.addRoute()
  }
}
```

## __WB_MANIFEST

**self.__WB_MANIFEST** 是 workbox 提供的一个**占位符**，防止工程随着开发变大，预缓存列表日益增多，同时避免维护一个硬编码的列表。所以通过**打包工具**自动**生成预缓存列表**，也就是 **__WB_MANIFEST**。

```js
const manifest = self.__WB_MANIFEST;
if (manifest) {
  // self.__WB_MANIFEST 只应该出现一次，因为编译问题。如果需要多次引用，self.__WB_MANIFEST请先分配给变量
  console.log('precached', manifest);
  precacheAndRoute(manifest);
}
```

## precacheAndRoute 参数

### 使用预缓存清单

此列表引用了一组网址，每个网址都有自己的 revision 信息。

第二个和第三个对象，`revision` 属性设置为 `null`。这是因为修改信息**位于网址本身中**（例如 app.0c9a31.css 中的 0c9a31）

第一个对象 (`/index.html`) 会明确设置 revision 属性，该属性是**自动生成**的文件内容的**哈希值**。与 JavaScript 和 CSS 资源不同，HTML 文件通常**不能**在网址中包含哈希值，否则，网址就会变化。

```js
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute([
  {url: '/index.html', revision: '383676'},
  {url: '/styles/app.0c9a31.css', revision: null},
  {url: '/scripts/app.0d5770.js', revision: null},
  // ... other entries ...
]);
```

### 忽略网址参数 ignoreURLParametersMatching

包含搜索参数的请求可被更改以移除特定值或移除所有值。

默认情况下，系统会移除以 `utm_` 开头或与 `fbclid` 完全匹配的搜索参数，这意味着针对 `/about.html?utm_campaign=abcd` 的请求将通过 `/about.html` 的预缓存条目执行。

您可以使用 `ignoreURLParametersMatching` 忽略一组不同的搜索参数（也就是不移除）：

```js
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(
  [
    {url: '/index.html', revision: '383676'},
    {url: '/styles/app.0c9a31.css', revision: null},
    {url: '/scripts/app.0d5770.js', revision: null},
  ],
  {
    // 忽略所有URL参数（也就是不移除）。
    ignoreURLParametersMatching: [/.*/],
  }
);
```

**区分  `/about.html?utm_campaign=abcd` 和 `/about.html`  请求，使用：ignoreURLParametersMatching: [/.*/]。**

### 目录索引 directoryIndex

默认情况下，以 `/` 结尾的请求将与末尾附加了 `index.html` 的条目进行匹配。这意味着，可以使用预缓存条目 `/index.html` 自动处理对 `/` 的传入请求。

您可将其更改为其他内容，也可以通过设置 `directoryIndex` 将其完全停用：

```js
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(
  [
    {url: '/index.html', revision: '383676'},
    {url: '/styles/app.0c9a31.css', revision: null},
    {url: '/scripts/app.0d5770.js', revision: null},
  ],
  {
    directoryIndex: null,
  }
);
```

**如果要区分 `/` 和 `/index.html` 请求，就是用 directoryIndex: null。**

### 简洁网址 cleanUrls

如果请求与预缓存不匹配，我们会在末尾添加 `.html`，以支持“干净”网址（也称为“漂亮”网址）。这意味着，像 `/about` 这样的请求将由 `/about.html` 的预缓存条目处理。

您可以通过设置 `cleanUrls` 来禁止此行为：

```js
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute([{url: '/about.html', revision: 'b79cd4'}], {
  cleanUrls: false,
});
```

**区分 `/about` 和 `/about.html` 请求，使用：cleanUrls: false。**

### 自定义匹配 urlManipulation

如果要定义从传入请求到**预缓存资产**的**自定义匹配**，您可以使用 `urlManipulation` 选项来实现。这应该是一个返回可能匹配项数组的回调。

```js
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(
  [
    {url: '/index.html', revision: '383676'},
    {url: '/styles/app.0c9a31.css', revision: null},
    {url: '/scripts/app.0d5770.js', revision: null},
  ],
  {
    urlManipulation: ({url}) => {
      // Your logic goes here...
      return [alteredUrlOption1, alteredUrlOption2];
    },
  }
);
```

### 自定义事件拆分 PrecacheController

默认情况下，`workbox-precaching` 会为您设置 `install` 和 `activate` 监听器。如果需要控制 `install` 和 `activate` 监听器。

可以直接使用 [`PrecacheController`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#type-PrecacheController) 它负责**加到预缓存**中、确定**何时安装**这些资源以及**何时应执行清理**。

```js
import {PrecacheController} from 'workbox-precaching';

const precacheController = new PrecacheController();
precacheController.addToCacheList([
  {url: '/styles/example-1.abcd.css', revision: null},
  {url: '/styles/example-2.1234.css', revision: null},
  {url: '/scripts/example-1.abcd.js', revision: null},
  {url: '/scripts/example-2.1234.js', revision: null},
]);

precacheController.addToCacheList([{
  url: '/index.html',
  revision: 'abcd',
}, {
  url: '/about.html',
  revision: '1234',
}]);

self.addEventListener('install', (event) => {
  //在Workbox v6+中需要传入事件
  event.waitUntil(precacheController.install(event));
});

self.addEventListener('activate', (event) => {
  // 在Workbox v6+中需要传入事件
  event.waitUntil(precacheController.activate(event));
});

self.addEventListener('fetch', (event) => {
  const cacheKey = precacheController.getCacheKeyForURL(event.request.url);
  event.respondWith(caches.match(cacheKey).then(...));
});
```

这样可以自己控制各个事件。

## 读取预缓存的资源

您可以使用 [Cache Storage API](https://developer.mozilla.org/docs/Web/API/CacheStorage) 获取预缓存的 `Response` 对象，但**存在一个问题**：调用 [`cache.match()`](https://developer.mozilla.org/docs/Web/API/Cache/match) 时需要使用的**网址**缓存键**可能包含** `workbox-precaching` 自动创建和维护的 **revision 参数**。

###  getCacheKeyForURL

如需**获取正确的缓存键**，您可以调用 **[`getCacheKeyForURL()`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#method-getCacheKeyForURL)** 并**传入原始网址**，然后使用结果对相应的缓存执行 `cache.match()`。

```js
import {cacheNames} from 'workbox-core';
import {getCacheKeyForURL} from 'workbox-precaching';

const cache = await caches.open(cacheNames.precache);
const response = await cache.match(getCacheKeyForURL('/precached-file.html'));
```

### matchPrecache

或者，如果您只需要预缓存的 `Response` 对象，则可以调用 **[`matchPrecache()`](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#method-matchPrecache)** ，它会自动使用正确的缓存键并在正确的缓存中搜索：

```js
import {matchPrecache} from 'workbox-precaching';

const response = await matchPrecache('/precached-file.html');
```

> **注意**：如果您[使用自己的 `PrecacheController` 实例](https://developer.chrome.com/docs/workbox/reference/workbox-precaching?hl=zh-cn#using_precachecontroller_directly)，而不是通过 `precacheAndRoute` 使用默认实例，您应直接在该实例上调用 [`matchPrecache()`](https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=zh-cn#method-matchPrecache) 或 [`getCacheKeyForURL()`](https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=zh-cn#method-getCacheKeyForURL) 方法。

## createHandlerBoundToURL

返回一个函数，该函数在预缓存中查找 `url`（考虑修订信息），并返回相应的 `Response`。

案例，如果是 html 的请求，直接从缓存中查找数据并返回。

```js
registerRoute(
// Return false to exempt requests from being fulfilled by index.html.
// 返回false以免除通过index.html来满足请求。
({ request, url }) => {
  // If this isn't a navigation, skip.
  // 如果这不是一个导航请求，则跳过。
    if (request.mode !== 'navigate') {
      return false;
    } // 如果URL以/_开头，跳过。

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.
      // 如果这看起来像资源的URL，因为它包含//文件扩展名，请跳过。
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.
      // 返回true以表示我们想要使用该处理程序。

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);
```
