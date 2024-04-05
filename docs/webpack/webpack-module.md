---
title: module
nav: Webpack
group:
  title: loader
  order: 3
order: 2
---
# Module 配置规则

## module.generator

可以使用 `module.generator` 在一个地方配置所有生成器的选项。

```js
module.exports = {
  module: {
    generator: {
      asset: {
        // asseet 模块的 generator 选项

        // 自定义 asset 模块的 publicPath，自 webpack 5.28.0 起可用
        publicPath: 'assets/',

        // 将静态资源输出到相对于 'output.path' 的指定文件夹中，webpack 5.67.0 后可用
        outputPath: 'cdn-assets/',
      },
      'asset/inline': {
        // asset/内联模块的 generator 选项
      },
      'asset/resource': {
        // asset/资源模块的 generator 选项

        // 自定义 asset/resource 模块的 publicPath，自 webpack 5.28.0 起可用
        publicPath: 'assets/',

        // 将静态资源输出到相对于 'output.path' 的指定文件夹中，webpack 5.67.0 后可用
        outputPath: 'cdn-assets/',
      },
      javascript: {
        // 该模块类型尚不支持 generator 选项
      },
      'javascript/auto': {
        // 同上
      },
      'javascript/dynamic': {
        // 同上
      },
      'javascript/esm': {
        // 同上
      },
      // 其他...
    },
  },
};
```



## Rules

创建模块时，匹配请求的[规则](https://www.webpackjs.com/configuration/module/#rule)数组。这些规则能够修改模块的创建方式。 这些规则能够**对模块(module)应用 loader**，或者修改解析器(parser)。

每个规则可以分为三部分 - **条件(condition)，结果(result)和嵌套规则(nested rule)**。

## 条件

### 条件分类

条件有两种输入值：

#### resource

**resource**：**资源文件**的**绝对路径**。

它**已经**根据 **[`resolve` 规则](https://www.webpackjs.com/configuration/resolve)解析**，所以写条件时，需要**写解析后的条件**，例如：引入less样式文件，开发时是忽略 less 后缀名的，解析后的条件可以匹配less后缀的文件。

如果编写条件**直接写条件内容**，例如直接写 test ，**默认**是使用了 **resource的条件**。也可以说 Rule.test，Rule.include，Rule.exclude 都是Rule.resource.test，Rule.resource.include，Rule.resource.exclude 的简写

#### issuer

**issuer**: **请求者的文件的绝对路径**。是导入时的位置。

> **例如：** 从 `app.js` `导入 './style.css'`，resource 是 `/path/to/style.css`. issuer 是 `/path/to/app.js`。

**注意**

当使用多个条件时，所有条件都要匹配。也就是条件间是 & 关系。

**软连接**（符号链接）文件的地址**不能**用于上述属性，只有**真实路径**才**可以**用于上述路径。

### **条件匹配**

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件

### Condition类型

Condition可以是这些之一：

+ 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。

+ 正则表达式：test 输入值。

+ 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。

+ 条件数组：至少一个匹配条件。

+ 对象：匹配所有属性。每个属性都有一个定义行为。

**总结案例**

resource 或 issuer 不省略时简单使用

```js
resource: {
    test:/\.(jpg|png|gif|jpeg|svg)$/,
    or:[/\.(jpg|png|gif|jpeg|svg)$/],
    // 等等
},
// issuer: {
//    test:/\.(jpg|png|gif|jpeg|svg)$/,
//    or:[/\.(jpg|png|gif|jpeg|svg)$/],
//},
use: [
    {
        loader: 'url-loader',
        options: {
            limit: 1024 * 10,
        }
    }
], // 内置了file-loader
```

处理`.js` 文件，但排除 `node_modules` 和 `vendor` 目录

```js
{
  test: {
    and: [
      /\.js$/,
      { not: [/node_modules/, /vendor/] }
    ]
  },
  use: 'babel-loader'
}
// 也可以
{
  test: /\.js$/,
  exclude: [/node_modules/, /vendor/],
  use: 'babel-loader'
}
```

处理 `.scss` 文件，但仅当它们也有 `.module` 在文件名中

```js
javascriptCopy code{
  test: {
    and: [
      /\.scss$/,
      /\.module\./
    ]
  },
  use: ['style-loader', 'css-loader', 'sass-loader']
}
```

### Rule.exclude

排除所有符合条件的模块。如果你提供了 `Rule.exclude` 选项，就不能再提供 `Rule.resource`。

### Rule.include

引入符合以下任何条件的模块。如果你提供了 `Rule.include` 选项，就不能再提供 `Rule.resource`。

### Rule.issuer

**请求者的文件的绝对路径**。是导入时的位置。

### Rule.mimetype

根据模块的 MIME 类型来匹配规则，可以控制哪些类型的文件将使用特定的 loader 处理，而无需根据文件扩展名进行匹配。

> 想要对所有类型为 text/html 的文件使用一个特定的 
>
> ```js
> module.exports = {
>   // ... (其他配置)
>   module: {
>     rules: [
>       {
>         test: /\.html$/,
>         type: 'asset/source',
>         mimetype: 'text/html',
>         use: ['html-loader']
>       }
>     ]
>   },
> };
> ```

mimetype 已默认包含了 `application/json`，`text/javascript`，`application/javascript`，`application/node` 以及 `application/wasm`。

这个选项主要用于 asset 模块类型（asset/resource, asset/inline, 或 asset/source），这些类型的模块可以在 import/require 时或者通过文件加载器（如 file-loader 或 url-loader）处理时指定其 MIME 类型。



## 结果

规则结果只在规则条件匹配时使用。

规则有两种输入值：

1. 应用的 loader：应用在 resource 上的 loader 数组。
2. Parser 选项：用于为模块创建解析器的选项对象。

这些属性会影响 loader：[`loader`](https://www.webpackjs.com/configuration/module/#rule-loader), [`options`](https://www.webpackjs.com/configuration/module/#rule-options-rule-query), [`use`](https://www.webpackjs.com/configuration/module/#rule-use)。

也兼容这些属性：[`query`](https://www.webpackjs.com/configuration/module/#rule-options-rule-query), [`loaders`](https://www.webpackjs.com/configuration/module/#rule-loaders)。

[`enforce`](https://www.webpackjs.com/configuration/module/#rule-enforce) 属性会影响 loader 种类。不论是普通的，前置的，后置的 loader。

[`parser`](https://www.webpackjs.com/configuration/module/#rule-parser) 属性会影响 parser 选项。

### Rule.loader

`Rule.loader` 是 `Rule.use: [ { loader } ]` 的简写。

### Rule.use

`Rule.use` 可以是一个应**用于模块**的 [**UseEntries](https://www.webpackjs.com/configuration/module/#useentry) 数组**。或者说是 loaders 数组。

它们会**从右到左被应用**（从最后到最先配置）。

#### **`[UseEntry]`**

返回一个**`UseEntry`** 的数组。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              noIeCompat: true,
            },
          },
        ],
      },
    ],
  },
};
```

#### **`function(info)`**

`Rule.use` 也可以是一个函数，必须返回 `UseEntry` 元素的数组。

`info` 对象参数有以下的字段：

- `compiler`: 当前 webpack 的编译器（可以是 undefined 值）
- `issuer`: 模块的路径，该元素正在导入一个被加载的模块(resource)
- `realResource`: 总会是被加载模块的路径
- `resource`: 被加载的模块路径，它常常与 `realResource` 相等，只有当资源名称被 request 字符串中的 `!=!` 覆盖时才不相等

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        use: (info) => [
          {
            loader: 'custom-svg-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {
                  cleanupIDs: {
                    prefix: basename(info.resource),
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
```

### Rule.parser

**解析选项对象**。所有应用的解析选项都将合并。

解析器，用于确定 webpack 是否按照**特定维度去解析为模块**，例如关闭 amd 将不会解析文件中的 `define` 或 `require` 调用，不会认为其为一个模块。

> 不认为为模块后，摇树功能将受到影响，optimization 中 moduleIds、usedExports、sideEffects、providedExports将受到影响。

解析器(parser)可以查阅这些选项，并相应地禁用或重新配置。大多数默认插件， 会如下解释值：

- 将选项设置为 `false`，将禁用解析器。
- 将选项设置为 `true`，或不修改将其保留为 `undefined`，可以启用解析器。

解析器内部的 `NodeStuffPlugin` 插件，可以接收一个对象：

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        parser: {
          amd: false, // 禁用 AMD
          commonjs: false, // 禁用 CommonJS
          system: false, // 禁用 SystemJS
          harmony: false, // 禁用 ES2015 Harmony import/export
          requireInclude: false, // 禁用 require.include
          requireEnsure: false, // 禁用 require.ensure
          requireContext: false, // 禁用 require.context
          browserify: false, // 禁用特殊处理的 browserify bundle
          requireJs: false, // 禁用 requirejs.*
          node: false, // 禁用 __dirname, __filename, module, require.extensions, require.main, 等。
          commonjsMagicComments: false, // 禁用对 CommonJS 的  magic comments 支持
          node: {}, // 在模块级别(module level)上重新配置 node 层(layer)
          worker: ["default from web-worker", "..."] // 自定义 WebWorker 对 JavaScript 的处理，其中 "..." 为默认值。
        }
      }
    ]
  }
}
```

> 如果 `Rule.type` 的值为 `asset`，那么 `Rules.parser` 选项可能是一个对象或一个函数，其作用可能是将文件内容编码为 Base64，还可能是将其当做单独文件 emit 到输出目录。
>
> 如果 `Rule.type` 的值为 `asset` 或 `asset/inline`，那么 `Rule.generator` 选项可能是一个描述模块源编码方式的对象，还可能是一个通过自定义算法对模块源代码进行编码的函数。
>
> 更多信息及用例请查阅 [Asset 模块指南](https://www.webpackjs.com/guides/asset-modules/)。

### Rule.parser.dataUrlCondition

如果一个模块源码大小小于 `maxSize`，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中。

**webpack.config.js**

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.txt/,
        type: 'asset',
       	parser: {
         	dataUrlCondition: {
           		maxSize: 4 * 1024 // 4kb
         	}
       }
      }
    ]
  },
};
```

```js
Rule.parser.dataUrlCondition.maxSize = 8096
```

## 嵌套的 Rule

可以使用属性 [`rules`](https://www.webpackjs.com/configuration/module/#rule-rules) 和 [`oneOf`](https://www.webpackjs.com/configuration/module/#rule-oneof) 指定嵌套规则。

这些规则用于在规则条件(rule condition)匹配时进行取值。每个嵌套规则包含它自己的条件。

被解析的顺序基于以下规则：

1. 父规则
2. [`rules`](https://www.webpackjs.com/configuration/module/#rulerules)
3. [`oneOf`](https://www.webpackjs.com/configuration/module/#ruleoneof)

### Rule.oneOf

[`规则`](https://www.webpackjs.com/configuration/module/#rule)数组，当规则匹配时，只使用第一个匹配规则。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader',
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader',
          },
        ],
      },
    ],
  },
};
```

## Rule.type

`Rule.type` 用于指定**模块**应该**如何被处理**。`type` 属性决定了**模块的类型**，Webpack 根据这个类型使用内置的模块处理逻辑。

以下是一些 `Rule.type` 的可选值和它们的用途：

- `javascript/auto`: 默认类型，所有 JavaScript 模块系统都可用。

  > Webpack 不会对 `import` 或 `export` 语句做静态优化处理，模块可以使用任何符合 CommonJS 或 AMD 规范的 `require` 或 `define` 语句，以及 ES6 的 `import` 和 `export` 语句。这种类型的设置允许开发者不受新的模块类型处理限制，使用它们熟悉的模块定义和导入方式。

- `javascript/esm`: ECMAScript 模块，Webpack 会假设文件是 ECMAScript 模块。

- `javascript/dynamic`: 专门处理只含有动态导入的模块。

  > Webpack 中的动态导入功能与 ES6 模块规范的动态导入提案是一致的。当遇到 `import()` 表达式时，Webpack 将其理解为一个信号，表示接下来的导入是动态的，需要将相关模块打包到一个独立的 chunk 中。设置 `type: 'javascript/dynamic'` 告诉 Webpack，这个规则应用于那些使用动态导入的模块，而不需要额外的 loader 或插件来处理动态分割。
  >
  > 然而，需要注意的是，在 Webpack 5 和更现代的配置中，你通常不需要显式设置这个模块类型，除非你有特别的理由去覆盖默认行为。动态导入已被 Webpack 很好地内置支持，并且会自动进行代码分割。

- `javascript/module`: 用于处理 `.mjs` 文件或其他需要作为 JavaScript ES6 模块处理的文件。

- `json`: 处理 JSON 文件，可以将 JSON 导入为 JavaScript 对象。

- `webassembly/experimental`: 实验性支持 WebAssembly，允许导入 WebAssembly 模块。

- `asset/resource`: 发送一个单独的文件并导出 URL。之前通过 `file-loader` 实现。

- `asset/inline`: 导出一个资源的 data URI。之前通过 `url-loader` 实现。

- `asset/source`: 导出资源的源代码。之前通过 `raw-loader` 实现。

- `asset`: 根据文件大小自动在 `asset/resource` 和 `asset/inline` 之间选择。之前通过 `url-loader` 加上资源大小限制实现。（asset 是 webpack 5 新加）

> ```js
> module.exports = {
>   // ... (其他配置)
>   module: {
>     rules: [
>       {
>         test: /\.png$/,
>         type: 'asset/resource'
>       }
>     ]
>   },
> };
> ```
>
> 在这个例子中，.png 图片文件会被发出到输出目录，并且其路径会被导出。

配置了 `Rule.type` 后，Webpack 会根据设置的类型来决定如何处理匹配到的模块。例如，如果你设置了 `type: 'asset/resource'`，Webpack 会把匹配的文件作为文件资源来处理，并且最终输出一个文件路径而不是文件本身的内容。

`Rule.type` 直接影响到模块的解析和输出。Webpack 会内部处理各种不同类型的模块，根据 `type` 指定的类型来进行相应的处理。例如，JSON 类型的模块会被解析成 JavaScript 对象，而资源类型的模块会被处理成文件路径或者 data URI。`Rule.type` 提供了一种简便的方式来替代在 Webpack 4 以前版本中常用的文件加载器（如 `file-loader`, `url-loader`, `raw-loader` 等）。

此外，`Rule.type` 的使用也可以减少对额外 loader 的依赖，因为这些资源类型的处理是内置于 Webpack 中的，简化了配置并可能提升了构建性能。

## Rule.resolve

`Rule.resolve` 适用于**模块规则内部**，仅影响该**规则匹配的模块**。它允许对特定类型的模块使用不同的解析规则，这需要对某些模块使用特别的解析逻辑时非常有用。

`resolve` 选项可以出现在两个地方：作为配置对象的顶级属性，也可以在特定的模块规则（`Rule`）内部作为 `Rule.resolve` 使用。尽管这两者的作用相似，但适用的范围和上下文不同。

Webpack 在解析模块时，首先会查看与该模块匹配的规则中是否有 `resolve` 设置，如果有，就会使用这些设置；如果没有，就会回退到顶层的 `resolve` 配置。通过这种方式，**`Rule.resolve` 可以覆盖顶层 `resolve` 的设置**，为特定类型的文件提供更精细的控制。

> ```js
> module.exports = {
>   // ...其他配置...
>   module: {
>     rules: [
>       {
>         test: /\.jsx?$/,
>         use: 'babel-loader',
>         resolve: {
>           // 只应用于此规则匹配的 .js 和 .jsx 文件
>           extensions: ['.jsx', '.js'],
>         },
>       },
>       // ...更多规则...
>     ],
>   },
>   // ...更多配置...
> };
> ```

## Rule.resourceQuery

用于匹配导入条件。

匹配import Foo from './foo.css?inline'。

```js
{
  test: /.css$/,
  resourceQuery: /inline/,
  use: 'url-loader'
}
```

## Rule.layer

**层**（layer）是一种**逻辑分组**方式，指定模块应放置在哪个层。**一组模块**可以**统一**在一个**层**中。

可以被用在 [split chunks](https://www.webpackjs.com/plugins/split-chunks-plugin/#splitchunkslayer)、[stats](https://www.webpackjs.com/configuration/stats/#statsgroupmodulesbylayer) 或者 [entry options](https://www.webpackjs.com/configuration/entry-context/#entry-descriptor)。

## Rule.options

用于**loader的配置**。

`Rule.options` 和 `Rule.query` 是 `Rule.use: [ { options } ]` 的简写。

> ```javascript
> module.exports = {
>   //...
>   module: {
>     rules: [
>       {
>         //...
>         use: [
>           'style-loader',
>           {
>             loader: 'css-loader',
>             options: {
>               importLoaders: 1,
>             },
>           },
>           {
>             loader: 'less-loader',
>             options: {
>               noIeCompat: true,
>             },
>           },
>         ],
>       },
>     ],
>   },
> };
> ```

## Rule.generator

因为一些loader合并为选项了，例如 url-loader 等，他们 options 归为 Rule.generator 统一处理了。

### Rule.generator.dataUrl

当 `Rule.generator.dataUrl` 被用作一个对象，你可以配置两个属性：

- encoding: 当被设置为`'base64'`，模块源码会用 Baes64 算法 编码。设置 `encoding` 为 false，会禁用编码。
- mimetype: 为数据链接(data URI)设置的一个 mimetype 值。默认根据模块资源后缀设置。

**webpack.config.js**

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        generator: {
          dataUrl: {
            encoding: 'base64',
            mimetype: 'mimetype/png',
          },
        },
      },
    ],
  },
};
```

当被作为一个函数使用，它必须为每个模块执行且并须返回一个数据链接(data URI)字符串。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        generator: {
          dataUrl: (content) => {
            const svgToMiniDataURI = require('mini-svg-data-uri');
            if (typeof content !== 'string') {
              content = content.toString();
            }
            return svgToMiniDataURI(content);
          },
        },
      },
    ],
  },
};
```

### Rule.generator.emit

配置不从 [Asset Modules](https://www.webpackjs.com/guides/asset-modules/) 写入资源文件, 你可能会在 SSR 中使用它。

- 类型：`boolean = true`

- 可用版本：5.25.0+

- 示例：

  ```js
  module.exports = {
    // …
    module: {
      rules: [
        {
          test: /\.png$/i,
          type: 'asset/resource',
          generator: {
            emit: false,
          },
        },
      ],
    },
  };
  ```

### Rule.generator.filename

对某些特定的规则而言与 [`output.assetModuleFilename`](https://www.webpackjs.com/configuration/output/#outputassetmodulefilename) 相同. 覆盖了 `output.assetModuleFilename` 选项并且仅与 `asset` 和 `asset/resource` 模块类型一同起作用。

**webpack.config.js**

```js
module.exports = {
  //...
  output: {
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource',
      },
      {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext]',
        },
      },
    ],
  },
};
```

### Rule.generator.publicPath

对指定的资源模式指定 `publicPath`。

- 类型：`string | ((pathData: PathData, assetInfo?: AssetInfo) => string)`
- 可用版本：5.28.0+

```js
module.exports = {
  //...
  output: {
    publicPath: 'static/',
  },
  module: {
    rules: [
      {
        test: /\.png$/i,
        type: 'asset/resource',
        generator: {
          publicPath: 'assets/',
        },
      },
    ],
  },
};
```

### Rule.generator.outputPath

将静态资源输出到相对于 'output.path' 的指定文件夹中。只有当 'publicPath' 被用来匹配文件夹结构时才会需要设置该配置。

- 类型：`string | ((pathData: PathData, assetInfo?: AssetInfo) => string)`
- 可用：5.67.0+

```js
module.exports = {
  //...
  output: {
    publicPath: 'static/',
  },
  module: {
    rules: [
      {
        test: /\.png$/i,
        type: 'asset/resource',
        generator: {
          publicPath: 'https://cdn/assets/',
          outputPath: 'cdn-assets/',
        },
      },
    ],
  },
};
```

## Q&A

### `test` 和 `include` 区别？

在 Webpack 的 `rules` 配置中，`test` 和 `include` 都是用于匹配文件路径的条件，但它们的意图和用途是不同的。以下是这两者的主要区别：

1. **意图**:

   - `test`: 通常用来**匹配文件**的**扩展名**或文件名的特定模式，以确定文件的类型，进而决定应该用哪个 loader 来处理这个文件。
   - `include`: 用来**过滤文件的路径**，通常用于限制 Webpack 只处理特定目录下的文件。

2. **用途**:

   - `test`: 确定文件应当**被哪个 loader 处理**。例如，你可能会有一个专门处理 `.js` 或 `.css` 文件的 loader。
   - `include`: 对于大型项目，可能只想**处理**项目的**源代码目录**下的文件，而不处理 `node_modules` 或其他目录。这时，你可以使用 `include` 来明确指定这些路径。

3. **示例**:

   使用 `test` 匹配 `.js` 文件：

   ```js
   javascriptCopy code{
     test: /\.js$/,
     use: 'babel-loader'
   }
   ```

   使用 `include` 限制只处理 `src` 目录下的文件：

   ```js
   javascriptCopy code{
     test: /\.js$/,
     include: /src/,
     use: 'babel-loader'
   }
   ```

