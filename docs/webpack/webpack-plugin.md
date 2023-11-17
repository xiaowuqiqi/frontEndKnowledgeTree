---
title: 常见插件
nav: webpack
group:
  title: plugin
  order: 4
order: 4
---
# plugin

## image-minimizer-webpack-plugin

Webpack 的插件和加载器，用于**使用 imagemin 优化（压缩）所有图片**。不用担心图片的大小，现在它们**总是**被优化/压缩了。

**文档详情**：https://github.com/webpack-contrib/image-minimizer-webpack-plugin

### 使用

**安装 plugin**

```bash
npm install image-minimizer-webpack-plugin imagemin
```

**推荐用于无损优化的 imagemin 插件**

```bash
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
```

**推荐用于有损优化的 imagemin 插件**

```bash
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
```

> 报错：C:\WINDOWS\system32\cmd.exe /s /c“autoreconf -ivf”，解决方案使用淘宝镜像 `--registry=https://registry.npm.taobao.org  `。

**无损优化常用案例**

```js
optimization: {
  minimize: true,
  minimizer: [
    …… // 注意，设置 TerserPlugin 等其他插件，放于 ImageMinimizerPlugin 前边位置。
    new ImageMinimizerPlugin({
      minimizer:{
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
		  //带有自定义选项的无损优化
		  //您可以随意尝试各种选项，以获得更好的结果
          plugins: [
            ["gifsicle", { interlaced: true }],
            // ["jpegtran", { progressive: true }],
            ["mozjpeg", { progressive: true, quality: 65 }],
            ["optipng", { optimizationLevel: 5 }],
            // Svgo configuration here https://github.com/svg/svgo#configuration
            [
              "svgo",
              {
                plugins: extendDefaultPlugins([
                  {
                    name: "removeViewBox",
                    active: false,
                  },
                  {
                    name: "addAttributesToSVGElement",
                    params: {
                      attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                    },
                  },
                ]),
              },
            ],
          ],
        },
      }
    })
  ],
},
```

**打包结果**

默认图片大小

![image-20231107211950224](./webpack-loader.assets/image-20231107211950224.png)

打包后图片大小

![image-20231106225122613](./webpack-loader.assets/image-20231106225122613.png)

由 imagemin-jpegtran 换为 imagemin-mozjpeg 后，由无损压缩变为有损压缩。jpg进一步减小。

![image-20231106225027314](./webpack-loader.assets/image-20231106225027314.png)

### 策略

`imageminGenerate` 和 `imageminMinify`，它们在处理图片时采取不同的策略。

`imageminMinify` 方法是用来**压缩**图片的。插件会使用 `imagemin` 和其相关的插件来压缩图像。

`imageminGenerate` 方法用于**生成新的图像格式**，例如，它可以将标准的 JPEG 或 PNG 图像转换为 WebP 格式。

> 使用 imageminGenerate 案例：[优化并生成`webp`图像](https://github.com/webpack-contrib/image-minimizer-webpack-plugin#optimize-and-generate-webp-images)
>
> ```js
> const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
> 
> module.exports = {
> optimization: {
>  minimizer: [
>    "...",
>    new ImageMinimizerPlugin({
>      minimizer: {
>        implementation: ImageMinimizerPlugin.imageminMinify,
>        options: {
>          plugins: [
>            "imagemin-gifsicle",
>            "imagemin-mozjpeg",
>            "imagemin-pngquant",
>            "imagemin-svgo",
>          ],
>        },
>      },
>      generator: [
>        {
>          // You can apply generator using `?as=webp`, you can use any name and provide more options
>          preset: "webp",
>          implementation: ImageMinimizerPlugin.imageminGenerate,
>          options: {
>            plugins: ["imagemin-webp"],
>          },
>        },
>      ],
>    }),
>  ],
> },
> };
> ```

### **api**

#### [`filter`](https://github.com/webpack-contrib/image-minimizer-webpack-plugin#filter)

允许过滤图像以进行优化/生成。返回`true`优化图像。

例子：[根据尺寸优化图像](https://github.com/webpack-contrib/image-minimizer-webpack-plugin#optimize-images-based-on-size)，根据图像大小使用差异选项（例如`progressive`/ `interlaced`/ 等）（例如 - 不要对小图像进行渐进变换）。

> 什么是`progressive`形象？[`Answer here`](https://jmperezperez.com/medium-image-progressive-loading-placeholder/)。

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [["jpegtran", { progressive: true }]],
          },
          // Only apply this one to files equal to or over 8192 bytes
          filter: (source) => {
            if (source.byteLength >= 8192) {
              return true;
            }

            return false;
          },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [["jpegtran", { progressive: false }]],
          },
          // Only apply this one to files under 8192
          filter: (source) => {
            if (source.byteLength < 8192) {
              return true;
            }

            return false;
          },
        },
      }),
    ],
  },
};
```

#### [`filename`](https://github.com/webpack-contrib/image-minimizer-webpack-plugin#filename)

允许设置文件名。例如

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          filename: "optimized-[name][ext]", // ext 为扩展名，例如：.jpg
          implementation: ImageMinimizerPlugin.squooshMinify,
          // Options
          options: {
            encodeOptions: {
              mozjpeg: {
                quality: 90,
              },
            },
          },
        },
      }),
    ],
  },
};
```

#### type

 `ImageMinimizerPlugin` 的 `type` 属性允许你指定优化器（generator）应该在何种情况下被应用。默认情况下，当使用 `import` 或 `require` 语句引入图片时，优化器就会被触发。但在某些情况下，可能需要对由其他插件引入的图片进行优化，例如使用 `copy-webpack-plugin` 插件复制到输出目录的图片。

在这种情况下，如果你希望 `ImageMinimizerPlugin` 对这些被复制的图片也进行优化，你需要将 `type` 选项设置为 `asset`。这样配置后，`ImageMinimizerPlugin` 就会对编译过程中的所有资产（包括那些被复制的资产）应用图片生成器，生成新的优化过的图片版本。

通常用于 imageminGenerate。

```js
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        generator: [
          {
            // Apply generator for copied assets
            type: "asset",
            // You can use `ImageMinimizerPlugin.squooshGenerate`
            // You can use `ImageMinimizerPlugin.sharpGenerate`
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
  plugins: [new CopyPlugin({ patterns: ["images/**/*.png"] })],
};
```

#### [`preset`](https://github.com/webpack-contrib/image-minimizer-webpack-plugin#preset)

配置预设的名称，允许后缀名添加 `?as=name`。

例如添加 as=webp 后缀名，允许该文件（`image.png`）转化为 webp

```js
const myImage4 = new URL("image.png?as=webp&w=150&h=120", import.meta.url);
```

```js
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "webp",
            // Implementation
            implementation: ImageMinimizerPlugin.squooshMinify,
          },
        ],
      }),
    ],
  },
};
```

## mini-css-extract-plugin

本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

> 本插件基于 webpack v5 的新特性构建，并且需要 webpack 5 才能正常工作。
>
> 与 extract-text-webpack-plugin 相比：
>
> - 异步加载
> - 没有重复的编译（性能）
> - 更容易使用
> - 特别针对 CSS 开发

### plugin API

#### `filename`

此选项决定了输出的每个 CSS 文件的名称。

机制类似于 [`output.filename`](https://webpack.docschina.org/configuration/output/#outputfilename)。

#### `chunkFilename`

> 将 `chunkFilename` 设置为 `function`，仅在 webpack@5 下可用。

此选项决定了非入口的 chunk 文件名称

机制类似于 [`output.chunkFilename`](https://webpack.docschina.org/configuration/output/#outputchunkfilename)

#### `ignoreOrder`

**移除 Order 警告**，Webpack 和 `mini-css-extract-plugin` 会检测 css import 时的导入顺序，不同模块使用的不同的导入顺序时，就会出现警告。

> ```css
> /* styleA.css */
> .example {
>   color: blue;
> }
> /* styleB.css */
> .example {
>   color: red;
> }
> ```
>
> ```js
> // index.js
> import './styleA.css';
> import './styleB.css';
> // 在另一个 JavaScript 模块中
> import './styleB.css';
> import './styleA.css';
> ```
>
> 不同模块顺序不同 .example 类最终的 color 会不同，就会出现警告。

#### `insert`

默认情况下，`mini-css-extract-plugin` 会将 styles（`<link>` 元素）附加到当前 `window` 的 `document.head` 中。类似 style-loader 的 inster 属性，只不过 mini-css-extract-plugin 插入的时 link 标签

**string**

允许设置自定义的 [query selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)。 新的 `<link>` 元素将被插入到找到的 item 之后。

```js
new MiniCssExtractPlugin({
  insert: "#some-element",
});
```

**Function**

允许覆盖默认行为，并在任意位置插入样式。

```js
new MiniCssExtractPlugin({
  insert: function (linkTag) {
    var reference = document.querySelector("#some-element");
    if (reference) {
      reference.parentNode.insertBefore(linkTag, reference);
    }
  },
});
```

#### `attributes`

把**指定的属性**和值附加到 **`<link>` 元素**上。

> ```js
> new MiniCssExtractPlugin({
>   attributes: {
>     id: "target",
>     "data-target": "example",
>   },
> }),
> ```

#### `linkType`

此选项运行使用自定义**链接类型**加载异步 chunk，例如 `<link type="text/css" ...>`。

```js
linkType = "text/css"
```

#### `runtime`

允许开启/禁用 runtime 生成。 CSS 仍将被提取，禁用时，可以自定义加载方法。

> 例如，你可以使用 [assets-webpack-plugin](https://github.com/ztoben/assets-webpack-plugin) 来检索它们，然后当需要时使用你自己的 runtime 代码下载静态资源。

```js
runtime = true
```

### loader API

#### `publicPath`

为 CSS 内的图片、文件等外部资源指定一个自定义的公共路径。 机制类似于 [`output.publicPath`](https://webpack.docschina.org/configuration/output/#outputpublicpath)。

> ```js
> const MiniCssExtractPlugin = require("mini-css-extract-plugin");
> 
> module.exports = {
>   plugins: [
>     new MiniCssExtractPlugin({
>       // 类似于 webpackOptions.output 中的选项
>       // 所有选项都是可选的
>       filename: '[name].css',
>       chunkFilename: '[id].css',
>     }),
>   ],
>   module: {
>     rules: [
>       {
>         test: /\.css$/,
>         use: [
>           {
>             loader: MiniCssExtractPlugin.loader,
>             options: {
>               publicPath: "/public/path/to/",
>             },
>           },
>           "css-loader",
>         ],
>       },
>     ],
>   },
> };
> ```

```js
// webpackOptions.output 选项中的 publicPath
publicPath = ……
```

#### `emit`

如果设置为 true，会发送一个文件（向文件系统中写入一个文件）。如果设置为 false，该插件将会提取 CSS 但是 **不会** 发送文件。 禁用该配置对服务侧的包比较有用。

```js
emit = true
```

#### `esModule`

默认情况下 `mini-css-extract-plugin` 将会生成使用 ES 模块语法的 JS 模块。在某些情况下，使用 ES 模块是有益的，比如：[module concatenation](https://webpack.docschina.org/plugins/module-concatenation-plugin/) 和 [tree shaking](https://webpack.docschina.org/guides/tree-shaking/)。



### 注意问题

#### 不会自动将 CSS 加载到页面中

当你在 webpack 的入口文件中直接导入 CSS，或者在初始（initial）chunk 中包含样式时，`mini-css-extract-plugin` 不会自动将这些 CSS 加载到页面中。

**解决方案**: 使用 `html-webpack-plugin`。这个插件可以帮助自动生成包含正确链接（`link` 标签）的 HTML 文件。**当你使用 `mini-css-extract-plugin` 从 JavaScript 文件中提取 CSS 后，`html-webpack-plugin` 会自动在生成的 HTML 文件中插入对应的 `link` 标签**，从而确保 CSS 被正确加载。

**示例**:

```js
javascriptCopy codeconst HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack 配置
module.exports = {
  // ...其他配置...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html' // 使用一个模板
    })
    // ...其他插件...
  ]
};
```

这样配置后，生成的 HTML 文件会包含对提取出来的 CSS 文件的引用。

Source Map 的配置

在使用 `mini-css-extract-plugin` 时，源码映射（source map）**只有在特定的 `devtool` 配置下才有效**。这是因为 CSS 只支持带有 `sourceMappingURL` 注释的 source map。

**解决方案**: 如果你的 `devtool` 配置**不是** `source-map`、`nosources-source-map`、`hidden-nosources-source-map` 或 `hidden-source-map`，

但你仍然需要生成 CSS 的 source map，可以在 `css-loader` 中设置 `sourceMap: true`。

**示例**:

```js
javascriptCopy code// webpack 配置
module.exports = {
  // ...其他配置...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 其他选项...
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 启用 sourceMap
            }
          }
        ]
      }
    ]
  },
  // 设置 devtool
  devtool: 'cheap-module-eval-source-map' // 一个不在上述列表中的 devtool 值
};
```

### 案例

#### 提取所有的 CSS 到一个文件中

用过使用 `optimization.splitChunks.cacheGroups` 选项，所有的 CSS 可以被提取到一个 CSS 文件中。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

请注意在 webpack 5 中应该使用 `type` 而不是 `test`，否则将会生成 `.js` 文件而不是 `.css`。

这是因为 `test` 不知道应该去掉哪个模块（在这种情况下，它不会检测到 `.js` 应该被删除）。

## CssMinimizerWebpackPlugin

这个插件使用 [cssnano](https://cssnano.co/) 优化和压缩 CSS。

> ```js
> const MiniCssExtractPlugin = require("mini-css-extract-plugin");
> const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
> 
> module.exports = {
>   module: {
>     rules: [
>       {
>         test: /.s?css$/,
>         use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
>       },
>     ],
>   },
>   optimization: {
>     minimizer: [
>       // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
>       // `...`, // 使用扩展运算符保留 webpack 默认的 minimizer
>       new CssMinimizerPlugin(),
>     ],
>   },
>   plugins: [new MiniCssExtractPlugin()],
> };
> ```

### API

#### `test`

用来匹配文件。

```js
test = /\.css(\?.*)?$/i
```

#### `include`

要包含的文件。详情参考 module 中的 include 属性

> ```js
> module.exports = {
>   optimization: {
>     minimize: true,
>     minimizer: [
>       new CssMinimizerPlugin({
>         include: /\/includes/,
>       }),
>     ],
>   },
> };
> ```

#### `exclude`

要排除的文件。

#### `parallel`

使用多进程并发执行，提升构建速度。 运行时默认的并发数：`os.cpus().length - 1`。

```js
parallel = true
```

#### `minify`

允许自定义压缩函数。

默认情况下，插件使用  [cssnano](https://github.com/cssnano/cssnano) 包。

可选配置：

- CssMinimizerPlugin.cssnanoMinify
- CssMinimizerPlugin.cssoMinify
- CssMinimizerPlugin.cleanCssMinify
- CssMinimizerPlugin.esbuildMinify
- `async (data, inputMap, minimizerOptions) => {return {code: "a{color: red}", map: "...", warnings: [], errors: []}}`

> ⚠️ **启用 `parallel` 选项时，始终在 `minify` 函数中使用 `require`**。

#### `minimizerOptions`

Cssnano 优化 [选项](https://cssnano.co/docs/optimisations).

```js
minimizerOptions = { preset: 'default' }
```

| 优化                                                         | 默认 | **advanced** | **lite** | 属性名                   |
| :----------------------------------------------------------- | :--- | :----------- | :------- | ------------------------ |
| [自动前缀器](https://cssnano.co/docs/optimisations/autoprefixer) | ❌    | ✅            | ❌        | autoprefixer             |
| [css声明排序器](https://cssnano.co/docs/optimisations/cssdeclarationsorter) | ✅    | ✅            | ❌        | cssDeclarationSorter     |
| [计算](https://cssnano.co/docs/optimisations/calc)           | ✅    | ✅            | ❌        | calc                     |
| [色度](https://cssnano.co/docs/optimisations/colormin)       | ✅    | ✅            | ❌        | colormin                 |
| [转换值](https://cssnano.co/docs/optimisations/convertvalues) | ✅    | ✅            | ❌        | convertValues            |
| [丢弃评论](https://cssnano.co/docs/optimisations/discardcomments) | ✅    | ✅            | ✅        | discardComments          |
| [丢弃重复项](https://cssnano.co/docs/optimisations/discardduplicates) | ✅    | ✅            | ❌        | discardDuplicates        |
| [丢弃空](https://cssnano.co/docs/optimisations/discardempty) | ✅    | ✅            | ✅        | discardEmpty             |
| [丢弃覆盖](https://cssnano.co/docs/optimisations/discardoverridden) | ✅    | ✅            | ❌        | discardOverridden        |
| [丢弃未使用的](https://cssnano.co/docs/optimisations/discardunused) | ❌    | ✅            | ❌        | discardUnused            |
| [合并标识](https://cssnano.co/docs/optimisations/mergeidents) | ❌    | ✅            | ❌        | mergeIdents              |
| [合并手写](https://cssnano.co/docs/optimisations/mergelonghand) | ✅    | ✅            | ❌        | mergeLonghand            |
| [合并规则](https://cssnano.co/docs/optimisations/mergerules) | ✅    | ✅            | ❌        | mergeRules               |
| [缩小字体值](https://cssnano.co/docs/optimisations/minifyfontvalues) | ✅    | ✅            | ❌        | minifyFontValues         |
| [缩小梯度](https://cssnano.co/docs/optimisations/minifygradients) | ✅    | ✅            | ❌        | minifyGradients          |
| [缩小参数](https://cssnano.co/docs/optimisations/minifyparams) | ✅    | ✅            | ❌        | minifyParams             |
| [缩小选择器](https://cssnano.co/docs/optimisations/minifyselectors) | ✅    | ✅            | ❌        | minifySelectors          |
| [规范化字符集](https://cssnano.co/docs/optimisations/normalizecharset) | ✅    | ✅            | ❌        | normalizeCharset         |
| [规范化显示值](https://cssnano.co/docs/optimisations/normalizedisplayvalues) | ✅    | ✅            | ❌        | normalizeDisplayValues   |
| [标准化位置](https://cssnano.co/docs/optimisations/normalizepositions) | ✅    | ✅            | ❌        | normalizePositions       |
| [标准化重复样式](https://cssnano.co/docs/optimisations/normalizerepeatstyle) | ✅    | ✅            | ❌        | normalizeRepeatStyle     |
| [规范化字符串](https://cssnano.co/docs/optimisations/normalizestring) | ✅    | ✅            | ❌        | normalizeString          |
| [规范化定时函数](https://cssnano.co/docs/optimisations/normalizetimingfunctions) | ✅    | ✅            | ❌        | normalizeTimingFunctions |
| [规范化Unicode](https://cssnano.co/docs/optimisations/normalizeunicode) | ✅    | ✅            | ❌        | normalizeUnicode         |
| [规范化网址](https://cssnano.co/docs/optimisations/normalizeurl) | ✅    | ✅            | ❌        | normalizeUrl             |
| [归一化空白](https://cssnano.co/docs/optimisations/normalizewhitespace) | ✅    | ✅            | ✅        | normalizeWhitespace      |
| [有序值](https://cssnano.co/docs/optimisations/orderedvalues) | ✅    | ✅            | ❌        | orderedValues            |
| [减少标识](https://cssnano.co/docs/optimisations/reduceidents) | ❌    | ✅            | ❌        | reduceIdents             |
| [减少初始值](https://cssnano.co/docs/optimisations/reduceinitial) | ✅    | ✅            | ❌        | reduceInitial            |
| [减少变换](https://cssnano.co/docs/optimisations/reducetransforms) | ✅    | ✅            | ❌        | reduceTransforms         |
| [svgo](https://cssnano.co/docs/optimisations/svgo)           | ✅    | ✅            | ❌        | svgo                     |
| [独特的选择器](https://cssnano.co/docs/optimisations/uniqueselectors) | ✅    | ✅            | ❌        | uniqueSelectors          |
| [z指数](https://cssnano.co/docs/optimisations/zindex)        | ❌    | ✅            | ❌        | zindex                   |

### 案例

#### 移除所有注释

移除所有注释（包括以 `/*!` 开头的注释）。

```js
module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: true,
            },
          ],
        },
      }),
    ],
  },
};
```

### 注意问题

#### 关于 source maps 的提示

**仅对 [`devtool`](https://webpack.docschina.org/configuration/devtool/) 配置项的 `source-map`、`inline-source-map`、`hidden-source-map` 与 `nosources-source-map` 值生效。**

# Q&A

## mini-css-extract-plugin 和 css-minimizer-webpack-plugin 区别是什么

`mini-css-extract-plugin` 和 `css-minimizer-webpack-plugin` 都是在使用 Webpack 构建项目时常用的插件，但它们的功能和作用有所不同。

**mini-css-extract-plugin**

1. **功能**: 这个插件主要用于将 CSS 从 JavaScript 捆绑包中提取出来，创建独立的 CSS 文件。这对于使用诸如 CSS Modules 这样的技术时尤其有用。
2. 作用
   - **性能优化**: 通过创建独立的 CSS 文件，可以让浏览器并行下载 CSS 和 JavaScript，提高页面加载速度。
   - **缓存优化**: 独立的 CSS 文件可以被浏览器缓存，有助于减少未来请求的加载时间。
   - **代码组织**: 有助于代码分离和组织，使得结构更清晰。

**css-minimizer-webpack-plugin**

1. **功能**: 该插件用于压缩和优化最终生成的 CSS 文件。它利用了如 `cssnano` 这样的工具来减少 CSS 文件的大小。
2. 作用
   - **文件大小减少**: 通过移除空白、注释、重复的 CSS 规则等，减小文件体积。
   - **性能优化**: 缩小的文件大小可以加快页面加载速度。
   - **代码优化**: 有时还可以通过合并规则等方式进行代码优化。

**相互关系和使用场景**

- **配合使用**: 一般情况下，这两个插件会一起使用。首先使用 `mini-css-extract-plugin` 从 JavaScript 中提取 CSS，然后使用 `css-minimizer-webpack-plugin` 对提取出的 CSS 文件进行压缩和优化。
- **压缩与优化**: `mini-css-extract-plugin` 负责提取操作，而不进行压缩。`css-minimizer-webpack-plugin` 则专注于压缩和优化已提取的 CSS。

总的来说，这两个插件在现代前端开发中扮演着重要的角色，共同助力于代码分离、文件管理及性能优化。 
