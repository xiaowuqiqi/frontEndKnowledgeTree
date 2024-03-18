---
title: workbox 基础
order: 5
group: 6 PWA
---

# workbox 基础

## 前言

**Service Worker** 看起来可能很棘手。面对**大量复杂的互动**，很难做到这一点。**网络请求！缓存策略！缓存管理！预缓存！** 其中有很多信息需要记住。 这不会使 Service Worker 成为一种设计不合理的技术；它能够按预期运行，并可解决棘手的问题。

好的**抽象**会使复杂的 **API 更易于使用**。 这正是 Workbox 的用武之地。 **Workbox** 是一组可**简化常见 Service Worker 路由和缓存的模块**。每个可用模块都适用于 Service Worker 开发的一个具体方面。Workbox 旨在尽可能简化 Service Worker 的使用，同时根据需要灵活地满足复杂的应用要求。

在最简单的情况下，[`workbox-build`](https://developer.chrome.com/docs/workbox/reference/workbox-build?hl=zh-cn) 提供了几种方法来**生成**用于**预缓存**指定资源的 Service Worker。[`generateSW`](https://developer.chrome.com/docs/workbox/reference/workbox-build?hl=zh-cn#method-generateSW) 方法可以开箱即用地完成大部分工作，而 [`injectManifest`](https://developer.chrome.com/docs/workbox/reference/workbox-build?hl=zh-cn#method-injectManifest) 方法则可在必要时提**供更多控制**。

对于更高级的用例，其他模块可以提供帮助。其中一些模块包括：

- [`workbox-routing`](https://developer.chrome.com/docs/workbox/modules/workbox-routing?hl=zh-cn)，用于**请求匹配**。
- [`workbox-strategies`](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn)，适用于**缓存策略**。
- [`workbox-precaching`](https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=zh-cn)（用于**预缓存**）。
- [`workbox-expiration`](https://developer.chrome.com/docs/workbox/modules/workbox-expiration?hl=zh-cn)，用于**管理缓存**。
- [`workbox-window`](https://developer.chrome.com/docs/workbox/modules/workbox-window?hl=zh-cn)，用于**注册 Service Worker** 并在 **[`window context`](https://developer.mozilla.org/docs/Web/API/Window) 中处理更新**。

这些模块和[其他模块](https://developer.chrome.com/docs/workbox/modules?hl=zh-cn)有助于以声明式的方式编写 Service Worker 代码，与直接使用 **Service Worker API 相比**，更**易于读取和维护**。

## workbox-core 核心

模块之间存在重叠，例如，每个**模块**都需要**与控制台交互**、**抛出有意义的错误**以及**使用网络或缓存**。为避免每个模块实现相同的逻辑，`workbox-core` 包含**每个模块**所依赖的这些**通用代码**。

### setCacheNameDetails()

Workbox 通过 `cacheNames` 定义其缓存：

```js
import {cacheNames} from 'workbox-core';

console.log(cacheNames.precache);
console.log(cacheNames.runtime);
console.log(cacheNames.googleAnalytics);
```

这些缓存名称采用前缀、名称和后缀格式构建，其中名称会根据缓存的使用情况而变化。

```
<prefix>-<cache-id>-<suffix>
```

您可以通过更改传递给 `setCacheNameDetails()` 的所有或部分值来更改这些默认名称。

```js
import {cacheNames, setCacheNameDetails} from 'workbox-core';

setCacheNameDetails({
  prefix: 'my-app',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
  googleAnalytics: 'ga',
});

// Will print 'my-app-install-time-v1'
console.log(cacheNames.precache);

// Will print 'my-app-run-time-v1'
console.log(cacheNames.runtime);

// Will print 'my-app-ga-v1'
console.log(cacheNames.googleAnalytics);
```

### clientsClaim()

一些开发者希望能够发布新的 Service Worker，并使其在激活后立即控制已经打开的网页，而这[默认](https://web.dev/service-worker-lifecycle/?hl=zh-cn#clientsclaim)不会发生。

如果您希望这种行为，可以使用 `workbox-core` 提供的辅助方法：

```js
import {clientsClaim} from 'workbox-core';

// This clientsClaim() should be at the top level
// of your service worker, not inside of, e.g.,
// an event handler.
clientsClaim();
```

`workbox-core` 中的 `clientsClaim()` 方法会自动向 Service Worker **添加 `activate` 事件监听器**，并在其中调用 `self.clients.claim()`。在当前 Service Worker 激活之前调用 `self.clients.claim()` 将会导致[运行时异常](https://w3c.github.io/ServiceWorker/#dom-clients-claim)，而 `workbox-core` 的封装容器有助于确保您**在正确的时间调用它**。

### copyResponse()

允许开发者**复制响应并修改其 `headers`、`status` 或 `statusText` 值**（可通过构造函数中的 [`ResponseInit`]`https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax` 对象设置的值）。

如需修改这些值，请将函数作为**第二个参数传递**。该函数将通过具有响应属性 `{headers, status, statusText}` 的单个对象调用。此函数的返回值将用作新 `Response` 的 `ResponseInit`。要更改值，请修改传递的参数并返回它，或返回全新的对象。

```ts
workbox-core.copyResponse(
  response: Response,
  modifier?: function,
)

(responseInit: ResponseInit)=>ResponseInit
```

## workbox-expiration 到期时间

用于**限制**缓存应允许项目存储在**缓存中的时长**，或者缓存中应**保留多少项**。您可以限制**缓存中的条目数并 / 或移除长期缓存的条目**。

### 限制缓存条目的数量

如需限制存储在**缓存中的条目数**，您可以**使用 `maxEntries` 选项**，如下所示：

```js
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
      }),
    ],
  })
);
```

这样，[插件](https://developer.chrome.com/docs/workbox/reference/workbox-expiration?hl=zh-cn#type-ExpirationPlugin)就会添加到此路由中。使用缓存的响应或将新请求添加到缓存后，插件将查看已配置的缓存，并确保缓存的条目数不超过限制。否则，**最早的条目将被移除**。

### 限制缓存条目的存在时间

如需限制请求的缓存时长，您可以**使用 `maxAgeSeconds` 选项**定义**最长**存在**时间（以秒为单位）**，如下所示：

```js
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);
```

该插件会在每次请求或缓存**更新后**检查并**移除条目**。

> 为缓解**打开 IndexedDB 的速度很慢**此问题，插件将**检查**已缓存**响应的 `Date` 标头**（如果存在且可以解析日期）

### CacheExpiration

借助 `CacheExpiration` 类，您可以定义 [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache) 中存储的响应数量的到期时间和 / 或限制。

如需对缓存应用限制，您需要为要控制的缓存**创建 `CacheExpiration` 实例**，如下所示：

```js
import {CacheExpiration} from 'workbox-expiration';

const cacheName = 'my-cache';
const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 24 * 60 * 60,
  maxEntries: 20,
});
```

每当更新缓存条目时，您都需要**调用 `updateTimestamp()` 方法**，以便**更新**其存在**时间**。

```js
await openCache.put(request, response);

await expirationManager.updateTimestamp(request.url);
// updateTimestamp 更新指定网址的时间戳。这可确保在根据条目数上限（最近使用的条目）移除条目时，或者在过期条目到期时是最新的时间戳。
```

然后，每当您想要使一组条目过期时，您可以调用 `expireEntries()` 方法，该方法将强制执行 `maxAgeSeconds` 和 `maxEntries` 配置。

```js
await expirationManager.expireEntries();
```

## workbox-navigation-preload 导航预加载(暂不使用)

`workbox-navigation-preload` 将在运行时处理检查，以查看当前浏览器是否支持导航预加载；如果支持，它会自动创建一个 `activate` 事件处理脚本来启用导航预加载。

## workbox-recipes 工作框食谱

许多常见的模式，尤其是[路由](https://developer.chrome.com/docs/workbox/modules/workbox-routing?hl=zh-cn)和[缓存](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn)方面的常见情况，可以标准化为可重复使用的配方。`workbox-recipes` 通过一个易于使用的软件包提供这些库，使您能够快速启动并运行功能强大的 Service Worker。

总结：**预置配置**

### 请求失败展示页

在**请求有匹配的[路由](https://developer.chrome.com/docs/workbox/modules/workbox-routing?hl=zh-cn)时**，系统才会应用失败展示页。所以**使用 [`setDefaultHandler()`](https://developer.chrome.com/docs/workbox/modules/workbox-routing?hl=zh-cn#set_a_default_handler) 方法**创建一个**将 [`NetworkOnly`](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#network_only) 策略**应用于**所有请求路由的默认策略**，使得所有路由最终后备方案都要请求网址，当**请求失败时**就会触发 **offlineFallback() 方法**。

默认情况下，此方案假定后备页面为 `offline.html`，并且没有图片或字体的后备方案。

**Recipe**

```js
import {offlineFallback} from 'workbox-recipes';
import {setDefaultHandler} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';

setDefaultHandler(new NetworkOnly());

offlineFallback();
// OfflineFallbackOptions
// fontFallback
// 字符串（可选）
// imageFallback
// 字符串（可选）
// pageFallback
// 字符串（可选）
```

**模式**

```js
import {setCatchHandler, setDefaultHandler} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';

const pageFallback = 'offline.html';
const imageFallback = false;
const fontFallback = false;

setDefaultHandler(new NetworkOnly());

self.addEventListener('install', event => {
  const files = [pageFallback];
  if (imageFallback) {
    files.push(imageFallback);
  }
  if (fontFallback) {
    files.push(fontFallback);
  }

  event.waitUntil(
    self.caches
      .open('workbox-offline-fallbacks')
      .then(cache => cache.addAll(files))
  );
});

const handler = async options => {
  const dest = options.request.destination;
  const cache = await self.caches.open('workbox-offline-fallbacks');

  if (dest === 'document') {
    return (await cache.match(pageFallback)) || Response.error();
  }

  if (dest === 'image' && imageFallback !== false) {
    return (await cache.match(imageFallback)) || Response.error();
  }

  if (dest === 'font' && fontFallback !== false) {
    return (await cache.match(fontFallback)) || Response.error();
  }

  return Response.error();
};

setCatchHandler(handler);
```

### 热策略缓存

通过热策略缓存配方，您可以在 Service Worker 的 **`install` 阶段**将提供的**网址加载到缓存中**，并使用提供的[策略](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn)选项缓存这些网址。

如果您**知道要缓存的具体网址**、想要预热路线的缓存或在安装过程中缓存网址的类似位置，则可以将此方式**用作[预缓存](https://developer.chrome.com/docs/workbox/modules/workbox-precaching?hl=zh-cn)的替代方案**。

如需查看所有配置选项的列表，请参阅[温策略缓存选项](https://developer.chrome.com/docs/workbox/reference/workbox-recipes?hl=zh-cn#method-warmStrategyCache)。

**Recipe**

```js
import {warmStrategyCache} from 'workbox-recipes';
import {CacheFirst} from 'workbox-strategies';

// This can be any strategy, CacheFirst used as an example.
const strategy = new CacheFirst();
const urls = ['/offline.html'];

warmStrategyCache({urls, strategy});
```

**模式**

```js
import {CacheFirst} from 'workbox-strategies';
// 这可以是任何策略，以CacheFirst为例。
const strategy = new CacheFirst();
const urls = ['/offline.html'];

self.addEventListener('install', event => {
  // handleAll返回两个promises，第二个promises在所有项都被添加到缓存后解析。
  const done = urls.map(
    path =>
      strategy.handleAll({
        event,
        request: new Request(path),
      })[1]
  );

  event.waitUntil(Promise.all(done));
});
```

### 网页缓存

借助页面缓存方案，您的 Service Worker 可以**使用[网络优先](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#network_first_network_falling_back_to_cache)缓存策略**（通过网址导航）响应对 **HTML 页面**的请求。理想情况下，该策略经过优化，可让缓存回退足够快速到达，从而实现不到 4.0 秒的 [Largest Contentful Paint](https://web.dev/articles/vitals?hl=zh-cn)（衡量加载性能。 为了提供良好的用户体验，LCP 必须在网页首次开始加载后的 2.5 秒内发生。）。

默认情况下，此方案假定**网络超时应为 3 秒**，并且通过 `warmCache` 选项支持[缓存预热](https://developer.chrome.com/docs/workbox/modules/workbox-recipes?hl=zh-cn#warm_strategy_cache)。如需查看所有配置选项的列表，请参阅[页面缓存选项](https://developer.chrome.com/docs/workbox/reference/workbox-recipes?hl=zh-cn#method-pageCache)。

**Recipe**

```js
import {pageCache} from 'workbox-recipes';

pageCache({warmCache: ['/index.html', '/styles/main.css']});
```

**模式**

```js
import {registerRoute} from 'workbox-routing';
import {NetworkFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

const cacheName = 'pages';
const matchCallback = ({request}) => request.mode === 'navigate';
const networkTimeoutSeconds = 3;

registerRoute(
  matchCallback,
  new NetworkFirst({
    networkTimeoutSeconds,
    // 规定超时时间，单位为秒，如果超时根据策略，返回缓存里的数据或者直接认为失败。
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
```

### 静态资源缓存

借助静态资源缓存方案，您的 Service Worker 可以**使用 [stale-while-revalidate](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#stale-while-revalidate) 缓存策略**来响应静态资源请求，具体来说就**是 CSS、JavaScript 和 Web Worker 请求**，以便可以从缓存中快速提供这些资源并在后台进行更新

此配方支持通过 `warmCache` 选项进行[热策略缓存](https://developer.chrome.com/docs/workbox/modules/workbox-recipes?hl=zh-cn#warm_strategy_cache)。如需查看所有配置选项的列表，请参阅[静态资源缓存选项](https://developer.chrome.com/docs/workbox/reference/workbox-recipes?hl=zh-cn#method-staticResourceCache)。

**Recipe**

```js
import {staticResourceCache} from 'workbox-recipes';

staticResourceCache();
```

**模式**

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

const cacheName = 'static-resources';
const matchCallback = ({request}) =>
  // CSS
  request.destination === 'style' ||
  // JavaScript
  request.destination === 'script' ||
  // Web Workers
  request.destination === 'worker';

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
```

### 图片缓存

借助图片缓存配方，您的 Service Worker 可以**采用[缓存优先](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#cache_first_cache_falling_back_to_network)**缓存策略来响应图片请求，这样当图片在缓存中可用时，用户就无需再次为图片发出请求。

默认情况下，此配方最多可缓存 **60 张**图片，每张图片 **30 天**，并且通过 `Stale-While-Revalidate 重新验证时过时` 选项支持[热策略缓存](https://developer.chrome.com/docs/workbox/modules/workbox-recipes?hl=zh-cn#warm_strategy_cache)。如需查看所有配置选项的列表，请参阅[图片缓存选项](https://developer.chrome.com/docs/workbox/reference/workbox-recipes?hl=zh-cn#method-imageCache)。

**Recipe**

```js
import {imageCache} from 'workbox-recipes';

imageCache();
```

**模式**

```js
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';

const cacheName = 'images';
const matchCallback = ({request}) => request.destination === 'image';
const maxAgeSeconds = 30 * 24 * 60 * 60; // 30天
const maxEntries = 60; // 60条

registerRoute(
  matchCallback,
  new CacheFirst({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries,
        maxAgeSeconds,
      }),
    ],
  })
);
```

### Google Fonts 缓存

Google Fonts 配方会缓存 Google Fonts 请求的两个部分：

- 包含 `@font-face` 定义的样式表，链接到字体文件。
- 经过修改的静态字体文件。

由于样式表可能会经常更改，因此系统使用了 [stale-while-revalidate](https://developer.chrome.com/docs/workbox/modules/workbox-strategies?hl=zh-cn#stale-while-revalidate) 缓存策略。另一方面，字体文件本身不会改变，并且可以利用“缓存优先”策略。

默认情况下，此方案最多可以缓存 30 个字体文件，每个文件一年最多缓存 30 个。有关所有配置选项的列表，请参阅 [Google Fonts 缓存选项](https://developer.chrome.com/docs/workbox/reference/workbox-recipes?hl=zh-cn#method-googleFontsCache)。

Recipe

```js
import {googleFontsCache} from 'workbox-recipes';

googleFontsCache();
```

模式

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';

const sheetCacheName = 'google-fonts-stylesheets';
const fontCacheName = 'google-fonts-webfonts';
const maxAgeSeconds = 60 * 60 * 24 * 365;
const maxEntries = 30;

registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: sheetCacheName,
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({url}) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: fontCacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds,
        maxEntries,
      }),
    ],
  })
);
```

## Workbox-cacheable-response

`workbox-cacheable-response` 模块提供了一种标准方法来，根据以下因素确定**是否应缓存响应**：**响应的[数字状态代码](https://developer.mozilla.org/docs/Web/API/Response/status)**、**是否存在具有特定值的[标头](https://developer.mozilla.org/docs/Web/API/Response/headers)**，或者两者的组合。

总结，**Response 过滤工具，根据配置条件，确定是否缓存，通常用于策略中。**

### 基于状态代码缓存 statuses

在处理针对 `https://third-party.example.com/images/` 的请求的响应时，**仅缓存**状态代码为 `0` 或 `200` 的所有请求。

```js
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

registerRoute(
  ({url}) =>
    url.origin === 'https://third-party.example.com' &&
    url.pathname.startsWith('/images/'),
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
```

> **注意**：状态代码 `0` 用于[不透明响应](https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses)。

### 基于标头的缓存 headers

处理包含 `/path/to/api/` 的请求网址的响应时，请查看名为 **`X-Is-Cacheable`** 的标头（该标头将**由服务器添加**到**响应中**）。如果该**标头**存在且**设置为“true”**，**则可缓存响应**。

如果指**定了多个**标头，则只需**其中一个**标头与关联值匹配。

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

registerRoute(
  ({url}) => url.pathname.startsWith('/path/to/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        headers: {
          'X-Is-Cacheable': 'true',
        },
      }),
    ],
  })
);
```

### 基于标头和状态代码进行缓存

您可以**混用**状态和标头配置。**必须**同时**满足**这**两个条件**，响应才会被视为可缓存。

换言之，响应必须**具有一个配置的状态代码**，并且必须**至少包含一个所提供的标头**。

```js
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

registerRoute(
  ({url}) => url.pathname.startsWith('/path/to/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200, 404],
        headers: {
          'X-Is-Cacheable': 'true',
        },
      }),
    ],
  })
);
```

### 不在plugins中使用

如果要在 Workbox 策略之外使用相同的缓存逻辑，可以直接使用 `CacheableResponse` 类。

调用 isResponseCacheable 判断 response。

```js
import {CacheableResponse} from 'workbox-cacheable-response';

const cacheable = new CacheableResponse({
  statuses: [0, 200],
  headers: {
    'X-Is-Cacheable': 'true',
  },
});

const response = await fetch('/path/to/api');

if (cacheable.isResponseCacheable(response)) {
  const cache = await caches.open('api-cache');
  cache.put(response.url, response);
} else {
  // Do something when the response can't be cached.
}
```