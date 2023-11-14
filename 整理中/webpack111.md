# webpack-大纲

## 概念

Entry：入口，Webpack执行构建的第一步将从Entry开始，可抽象成输入。

Module：模块，在Webpack里以切皆是模块，一个模块对应着一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块。

Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并和分割。

Loader：代码转换器，用于把模块原有内容按照需求转换成新内容。

Plugin：扩展插件，在Webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

Output：输出结果，在Webpack经过一些列处理并得到最终想要的代码后输出结果。

## hash模式

**hash需要用到三类：**

**hash** 每次编译hash汇编（只要有一个变化）

**chunkHash** 代码块变化hash会变（只要chunk内文件变化，该hash就会变化）

**contentHash** 文件内容变化hash会变。

注，chunkHash /contentHash 不能用在output的filename上，因为output产出的是多个chunk，只能用hash。

## Mode预设

webpack 4后加入mode预设

**development开发环境**

会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`. 为模块和 chunk 启用有效的名。

**production生产环境（默认）**

会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。

为模块和 chunk 启用确定性的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin` 。

**none**

不使用任何默认优化选项

## loader

Webpack 支持使用 [loader](https://www.webpackjs.com/concepts/loaders) 对文件进行预处理。你可以构建包括 JavaScript 在内的任何静态资源。并且可以使用 Node.js 轻松编写自己的 loader。



### 条件(condition)

condition有两种属性可以选择：

1. resource：请求文件的绝对路径。匹配的文件就是最终匹配的文件。
2. issuer: 被请求资源(requested the resource)的模块文件的绝对路径。匹配的文件所有引用的子文件才是最终匹配文件。

在规则中，可选属性 [`test`](https://www.webpackjs.com/configuration/module/#rule-test), [`include`](https://www.webpackjs.com/configuration/module/#rule-include), [`exclude`](https://www.webpackjs.com/configuration/module/#rule-exclude) 和 [`resource`](https://www.webpackjs.com/configuration/module/#rule-resource)

其中Rule.test，Rule.include，Rule.exclude都是Rule.resource.test，Rule.resource.include，Rule.resource.exclude的简写。

**条件（匹配）**

`{ test: Condition }`：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

`{ include: Condition }`：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。

`{ exclude: Condition }`：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。

`{ and: [Condition] }`：必须匹配数组中的所有条件

`{ or: [Condition] }`：匹配数组中任何一个条件

`{ not: [Condition] }`：必须排除这个条件

> Condition可以是这些之一：
>
> - 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
> - 正则表达式：test 输入值。
> - 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
> - 条件数组：至少一个匹配条件。
> - 对象：匹配所有属性。每个属性都有一个定义行为。

例如

```js
resource: {
    test:/\.(jpg|png|gif|jpeg|svg)$/,
    or:[/\.(jpg|png|gif|jpeg|svg)$/],
    // 等等
},
issuer: {
    test:/\.(jpg|png|gif|jpeg|svg)$/,
    or:[/\.(jpg|png|gif|jpeg|svg)$/],
},
use: [
    {
        loader: 'url-loader',
        options: {
            limit: 1024 * 10,
        }
    }
], // 内置了file-loader
```



## Q&A

### module和chunk区别？

在 Webpack 的上下文中，"module" 和 "chunk" 是两个基本概念，但它们代表的是不同的东西。下面是它们之间的主要区别：

1. **Module (模块)**:
   - **定义**：模块是项目中的一个单独的文件或资源。这可以是一个 JavaScript 文件、CSS 文件、图片或其他任何类型的资源。在 Webpack 中，每个文件都被视为一个模块。
   - **目的**：模块化允许将大型代码库分解成更小、可管理和可重用的片段。
   - **加载**：模块通常通过诸如 `import` 或 `require` 之类的语句在其他模块中被引用或加载。
   - **示例**：考虑一个 ES6 语法的文件 `math.js`，它导出了一个函数 `add`。这个文件就是一个模块。
2. **Chunk (块)**:
   - **定义**：块是多个模块的集合，它们通过 Webpack 的打包过程被组合在一起。块是输出的结果，即最终在浏览器中加载的文件。
   - **目的**：块的目标是将模块分组，使得浏览器可以更高效地下载。Webpack 的代码拆分功能就是基于块来实现的。
   - **加载**：块可以异步加载或在页面初始化时加载。
   - **示例**：考虑一个应用程序有三个入口点（home, about, contact）。每个入口点可能对应一个块，并且可能还有其他共享的块或异步加载的块。
