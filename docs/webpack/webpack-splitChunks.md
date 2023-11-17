---
title: splitChunks chunks分割
nav: webpack
group:
  title: optimization
  order: 1
order: 2
---
# splitChunks

最初，chunks（以及内部导入的模块）是通过内部 **webpack 图谱**中的**父子关系关联**的。`CommonsChunkPlugin` 曾被用来避免他们之间的**重复依赖**，但是不再做进一步的优化。

从 webpack v4 开始，移除了 `CommonsChunkPlugin`，取而代之的是 `optimization.splitChunks`。

```js
// 下面这个配置对象代表 SplitChunksPlugin 的默认行为。
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

**默认**情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动**拆分 chunks**：

- 新的 chunk 可以被共享，或者模块来自于 `node_modules` 文件夹
- 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
- 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
- 当加载初始化页面时，并发请求的最大数量小于或等于 30

当尝试满足最后两个条件时，最好使用较大的 chunks。

## **共有的配置项**

设置 production 和 development 配置项时都会设置的属性。

### defaultSizeTypes

大小（通常是文件的大小）是一个关键的度量标准，用于决定如何分割代码和创建代码块。

通过调整 `splitChunks.defaultSizeTypes`，控制 `splitChunks ` 属性作用在特定的文件类型上。

```js
A(splitChunks, "defaultSizeTypes", () =>
			css ? ["javascript", "css", "unknown"] : ["javascript", "unknown"]
);
// 这里的 css 是 experiments.css
```

> - `'javascript'`：这是指的 JavaScript 模块或文件的大小。
> - `'unknown'`：针对不能明确识别其类型的模块或文件。

### chunks

用于控制哪些模块应该被优化或分割成独立的 chunks。

`chunks` 配置的核心逻辑是告诉 webpack **如何选择模块进行分割**。webpack 在遍历模块时，会根据这个配置项**决定**是否将模块**分割到一个新的 chunk 中**或**保留在现有的 chunk 中**。

> 例如，选择 `async` 时，只有异步模块会被分割，可能会产生较少的 chunk 文件。而选择 `all` 时，可能会产生更多的 chunk 文件。

```js
optimization.splitChunks.chunks = 'async'
```

1. `all`: 这意味着所有的模块都可以被优化，无论它们是从哪里导入的（例如，无论它们是从 entry chunks、async chunks，或其他 chunks 导入的）。
2. `async`: 只有那些异步加载的模块会被优化。例如，使用 `import()` 语法动态导入的模块。
3. `initial`: 只有那些初始加载时引入的模块会被优化，异步加载的模块不会被分割。
4. 函数: 你还可以提供一个函数，它接受一个描述正在处理的 chunk 的对象，并返回一个布尔值，确定该 chunk 是否应该被分割。

### usedExports

 `splitChunks.usedExports` 控制在 splitChunks 设置的条件基础上**拆分 chunks 时**，是否应该**考虑未被使用的导出**。如果为 true 时则是删除未被使用的导出然后拆分chunks。

> `optimization.usedExports` 中也有同样名字的配置，它在全局范围内启用了 tree shaking，删除未被使用的导出可以被

```js
optimization.splitChunks.usedExports = optimization.usedExports === true
// 默认跟随 optimization.usedExports 相同设置
```

### minChunks

决定一个模块被分割前应该在项目中被**引入（或说加载）的最小次数**。

为了避免非常少被使用的模块被分割成单独的 chunks。那么将它分割为一个单独的 chunk 可能并不是一个优化，反而可能增加了请求数。

> ```js
> module.exports = {
>   // ... 其他配置
>   optimization: {
>     splitChunks: {
>       minChunks: 2,
>       // ... 其他 splitChunks 配置
>     },
>   },
> };
> ```
>
> 在上述配置中，只有被引入两次或更多次的模块才会被分割成新的 chunks。

```js
optimization.splitChunks.minChunks = 1
```

### automaticNameDelimiter

用于定义在自动生成 chunk 名称时使用的分隔符。

> 如果有一个 chunk 包含了两个模块，名为 `moduleA` 和 `moduleB`，那么自动生成的 chunk 名称可能是 `moduleA-moduleB`。

```js
optimization.splitChunks.automaticNameDelimiter = '-'
```

### maxSize

告诉 webpack 尝试将**大于** `maxSize` 个字节的 chunk **分割成较小**的部分。 这些较小的部分在体积上至少为 `minSize`（仅次于 `maxSize`）。

```js
optimization.splitChunks.maxSize = undefined
```

### maxAsyncSize

`maxAsyncSize` 和 `maxSize` 的区别在于 `maxAsyncSize` 仅会影响**按需加载 chunk**。

### maxInitialSize

`maxInitialSize` 和 `maxSize` 的区别在于 `maxInitialSize` 仅会影响**初始加载 chunks**。

### cacheGroups

cacheGroups（缓存组）

使用 `splitChunks` 进行代码分割时，希望对**不同类型的模块**应用**不同的分割策略**，这就是 `cacheGroups` 的用途。它允许你为不同类型的模块（例如**第三方库**、**特定的文件类型**或**满足特定条件**的**模块**）定义不同的缓存组，并为每个缓存组指定特定的分割行为。

> ```js
> module.exports = {
>   // ... 其他配置
>   optimization: {
>     splitChunks: {
>       cacheGroups: {
>         // 将所有的 node_modules 中的模块打包到一个名为 "vendors" 的 chunk 中
>         vendors: {
>           test: /[\\/]node_modules[\\/]/,
>           name: 'vendors',
>           chunks: 'all'
>         },
>         // 将所有的 CSS 文件打包到一个名为 "styles" 的 chunk 中
>         styles: {
>           test: /\.css$/,
>           name: 'styles',
>           chunks: 'all',
>           enforce: true
>         }
>       }
>       // ... 其他 splitChunks 配置
>     },
>   },
> };
> ```

```js
F(cacheGroups, "default", () => ({
    idHint: "",
    reuseExistingChunk: true,
    minChunks: 2,
    priority: -20
}));
F(cacheGroups, "defaultVendors", () => ({
    idHint: "vendors",
    reuseExistingChunk: true,
    // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。
    test:  /[\\/]node_modules[\\/]/,
    priority: -10
    // 一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的缓存组。默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0）。
}));
```

#### **enforce**

设置为true，告诉 webpack 忽略 [`splitChunks.minSize`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksminsize)、[`splitChunks.minChunks`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksminchunks)、[`splitChunks.maxAsyncRequests`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksmaxasyncrequests) 和 [`splitChunks.maxInitialRequests`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksmaxinitialrequests) 选项，并始终为此缓存组创建 chunk。

> enforce 为 true，禁用外部的属性，采用 cacheGroups 内部设置的属性。

## prduction

### hidePathInfo

为由 maxSize 分割的 chunk 创建名称时， chunk 名称中是否包含模块路径信息。

> 在开启后，生成的 chunk 名称可能从 `vendors~../node_modules/lodash/lodash.js` 变为 `vendors~lodash`。

```js
optimization.splitChunks.hidePathInfo = true
```

### minSize

当一个块的大小**超过** minSize 设置的阈值时，它才**可能被拆分**成更小的块。这个预置也是生成 chunk 的**最小体积**（以 bytes 为单位）。

解释同 minChunks 差不多，如果小于设置的体积，则没必要拆分为单独 chunks

```js
optimization.splitChunks.minSize = 20000
```

### minRemainingSize

webpack5 新加属性，设置拆分一个块后**剩余块**如果**小于**这个阈值，就没必要拆分。

> 例如，如果一个块有 50kB 大小，你的 `minSize` 是 30kB，但你的 `minRemainingSize` 也是 30kB，那么块可能不会被拆分，因为剩下的部分会小于 `minRemainingSize` 的值。

```js
optimization.splitChunks.minRemainingSize = undefined
```

### enforceSizeThreshold

是 webpack 5 中引入的一个配置项。只有**超过特定大小**的 chunks 才被**考虑拆分**。当某个 chunk 超出这个阈值时，webpack 会尝试将其进一步拆分以满足大小要求。（**minRemainingSize，maxAsyncRequests，maxInitialRequests**）**将被忽略**。

```js
optimization.splitChunks.enforceSizeThreshold = 50000
```

### maxAsyncRequests

一个**入口点** ( **一个页面或 chunk** ) 而产生的**异步请求**的**最大数量**。当超出这个数量时，不会创建更多的 chunks，**这意味着一些模块将被合并到已有的 chunks 中**。

```js
optimization.splitChunks.maxAsyncRequests = 30
```

### maxInitialRequests

限制加载一个**入口点**时所产生的**初始化请求**的**最大数量**。也就是说，它关心的是那些在**页面首次加载**时需要**加载的 chunks**（通常称为初始 chunks 或入口 chunks）。

```js
optimization.splitChunks.maxInitialRequests = 30
```





## development

### minSize

```js
optimization.splitChunks.minSize = 10000
```

### minRemainingSize

```js
optimization.splitChunks.minRemainingSize = 0
```

### enforceSizeThreshold

```js
optimization.splitChunks.enforceSizeThreshold = 30000
```

### maxAsyncRequests

```js
optimization.splitChunks.maxAsyncRequests = Infinity
```

### maxInitialRequests

```js
optimization.splitChunks.maxInitialRequests = Infinity
```

