---
title: TS-tsconfig
order: 10
nav: TS
---
# TS-tsconfig

如果一个目录下存在一个`tsconfig.json`文件，那么它意味着这个目录是TypeScript项目的根目录。`tsconfig.json`文件中指定了用来编译这个项目的根文件和编译选项。

> 不带任何输入文件的情况下调用`tsc`，编译器会从当前目录开始去查找`tsconfig.json`文件，逐级向上搜索父目录。

> 不带任何输入文件的情况下调用`tsc`，且使用命令行参数`--project`（或`-p`）指定一个包含`tsconfig.json`文件的目录。

## 编译选项

### **compilerOptions**

详情：https://ts.nodejs.cn/tsconfig#lib

你可以通过 `compilerOptions` 来定制你的编译选项：

```js
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许在项目中导入 JavaScript 文件，而不仅仅是.ts文件.tsx。
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

**lib**

TypeScript 包含内置 JS API 的一组默认类型定义（如`Math`），以及**浏览器环境**中找到的内容的类型定义（如`document`）。

| 姓名         | 内容                                                         |
| :----------- | :----------------------------------------------------------- |
| `ES5`        | 所有 ES3 和 ES5 功能的核心定义                               |
| `ES2015`     | ES2015（也称为 ES6）中提供的其他 API - `array.find`、`Promise`、`Proxy`、`Symbol`、`Map`、`Set`、`Reflect`等。 |
| `ES6`        | “ES2015”的别名                                               |
| `ES2016`     | ES2016 中提供的其他 API -`array.include`等。                 |
| `ES7`        | “ES2016”的别名                                               |
| `ES2017`     | ES2017 中提供了其他 API - `Object.entries`、`Object.values`、`Atomics`、`SharedArrayBuffer`、`date.formatToParts`、 类型化数组等。 |
| `ES2018`     | ES2018 中提供了其他 API - `async`iterables、`promise.finally`、`Intl.PluralRules`、`regexp.groups`等。 |
| `ES2019`     | ES2019 中提供了其他 API - `array.flat`、`array.flatMap`、`Object.fromEntries`、`string.trimStart`、`string.trimEnd`等。 |
| `ES2020`     | ES2020 中提供的其他 API -`string.matchAll`等。               |
| `ES2021`     | ES2021 中提供的其他 API -`promise.any`等`string.replaceAll`。 |
| `ES2022`     | ES2022 中提供的其他 API - `array.at`、`RegExp.hasIndices`等。 |
| `ESNext`     | ESNext 中提供了其他 API - 这会随着 JavaScript 规范的发展而变化 |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM)定义 - `window`、`document`等 |
| `WebWorker`  | [WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)上下文中可用的 API |
| `ScriptHost` | [Windows 脚本托管系统](https://wikipedia.org/wiki/Windows_Script_Host)的 API |

**jsx**

控制如何在 JavaScript 文件中发出 JSX 构造。这只影响以`.tsx` 开头的 JS 文件的输出。

- `react`：生成 .js 文件，将 JSX 更改为等效的 React。createElement 调用。
- `react-jsx`：发出 .js 文件，JSX 改为 _jsx 调用。
- `react-jsxdev`：发出 .js 文件，JSX 改为 _jsx 调用。
- `preserve`：生成 .jsx 文件，JSX 保持不变。
- `react-native`：生成 JSX 不变的 .js 文件。

> 这个示例代码：
>
> ```tsx | pure
> export const HelloWorld = () => <h1>Hello world</h1>;
> ```
>
> Default：`"react"`
>
> ```tsx | pure
> import React from 'react';
> export const HelloWorld = () => React.createElement("h1", null, "Hello world");
> ```
>
> Preserve：`"preserve"`
>
> ```tsx | pure
> import React from 'react';
> export const HelloWorld = () => <h1>Hello world</h1>;
> ```
>
> React Native：`"react-native"`
>
> ```tsx | pure
> import React from 'react';
> export const HelloWorld = () => <h1>Hello world</h1>;
> ```
>
> React 17 transform：`"react-jsx"`[[1\]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
>
> ```tsx | pure
> import { jsx as _jsx } from "react/jsx-runtime";
> import React from 'react';
> export const HelloWorld = () => _jsx("h1", { children: "Hello world" });
> ```
>
> React 17 dev transform：`"react-jsxdev"`[[1\]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
>
> ```tsx | pure
> import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
> const _jsxFileName = "/Users/q/code/nodejscn/typescript/src/index.tsx";
> import React from 'react';
> export const HelloWorld = () => _jsxDEV("h1", { children: "Hello world" }, void 0, false, { fileName: _jsxFileName, lineNumber: 9, columnNumber: 32 }, this);
> ```

### **files**

使用`"files"`属性。指定要包含在程序中的**文件的允许列表**。如果找不到任何文件，则会发生错误。

> 当您只有少量文件并且不需要使用 glob 来引用许多文件时，这非常有用。如果您需要的话，请使用[`include`](https://ts.nodejs.cn/tsconfig#include).

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "noImplicitAny": true,
        "removeComments": true,
        "preserveConstEnums": true,
        "sourceMap": true
    },
    "files": [
        "core.ts",
        "sys.ts",
        "types.ts",
        "scanner.ts",
        "parser.ts",
        "utilities.ts",
        "binder.ts",
        "checker.ts",
        "emitter.ts",
        "program.ts",
        "commandLineParser.ts",
        "tsc.ts",
        "diagnosticInformationMap.generated.ts"
    ]
}
```

### **include & exclude**

include 指定要包含在程序中的文件名或模式的数组。这些文件名是相对于包含该文件的目录进行解析的`tsconfig.json`。

> - `*`匹配零个或多个字符（不包括目录分隔符）
> - `?`匹配任意一个字符（不包括目录分隔符）
> - `**/`匹配嵌套到任何级别的任何目录
>
> 如果模式中的最后一个路径段不包含文件扩展名或通配符，则将其视为目录，并包含该目录内具有受支持扩展名的文件（例如`.ts`、`.tsx`、 和`.d.ts`默认情况下，`.js`并且`.jsx`if[`allowJs`](https://ts.nodejs.cn/tsconfig#allowJs)设置为真的）。

exclude 指定解析时应**跳过**的文件名或模式数组[`include`](https://ts.nodejs.cn/tsconfig#include)。

> 它不是一种**阻止**文件包含在代码库中的机制 - 它只是更改[`include`](https://ts.nodejs.cn/tsconfig#include)设置找到的内容。

使用`"include"`和`"exclude"`属性

```json
{
    "compilerOptions": {
        "module": "system",
        "noImplicitAny": true,
        "removeComments": true,
        "preserveConstEnums": true,
        "outFile": "../../built/local/tsc.js",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ]
}
```

## 备注

### 为什么把一个文件放入「exclude」选项中，它仍然会被编译器选中？

`tsconfig.json` 将会把一个文件夹转换为「项目」，如果不指定任何 `exclude` 或者 `files`，则包含在 `tsconfig.json` 中的所有文件夹中的所有文件都会被包含在编译中。

如果你想忽略一些文件，使用 `exclude`。如果希望指定所有文件，而不是让编译器查找它们，请使用 `files`。

这些行为，`tsconfig.json` 将会自动确认。但是这有一个不同的问题，即是解析模块。模块解析：编译器将尝试去理解 `ns` 在模块语法中表示什么，即 `import * as ns from 'mod'`。为了理解它，编译器需要定义一个模块，它可能是包含你自己代码的 .ts 文件，或者是导入的一个 .d.ts 文件。如果一个文件被找到，则无论它是否在 `excludes` 中，它都将会被编译。

因此，如果你想从编译中排除一个文件，你需要排除所有具有 `import` 或者 `<reference path="...">` 指令的文件。

使用 `tsc --listFiles` 来列出在编译时包含了哪些文件，`tsc --traceResolution` 来看看它们为什么会被包含在编译中。

### 我怎么指定一个 `include`？

现在无法在 `tsconfig.json` 的 `include` 选项外指定所需要包含的文件。你可以通过以下任意一种方式获得相同的结果：1 使用 `files` 列表，2 在目录中添加 `///<reference path="">` 指令。

### 当我使用 JavaScript 文件时，为什么我会得到 `error TS5055: Cannot write file 'xxx.js' because it would overwrite input file` 错误？

对于 TypeScript 文件来说，在默认情况下，编译器将在同一目录中生成与 JavaScript 相同文件名的文件。因为 TypeScript 文件与编译后的文件总是拥有不同的后缀，这么做是安全的。然而，如果你设置 `allowJs` 编译选项为 `true` 和没有设置任何的编译输出属性（`outFile` 和 `outDir`），编译器将会尝试使用相同的规则来编译文件，这将导致发出的 JavaScript 文件与源文件具有相同的文件名。为了避免意外覆盖源文件，编译器将会发出此警告，并跳过编写输出文件。

有多种方法可以解决此问题，但所有这些方法都涉及配置编译器选项，因此建议你在项目根目录中的 tsconfig.json 文件来启用此功能。如果你不想编译 JavaScript 文件，你只需要将 `allowJs` 选项设置为 `false`；如果你确实想要包含和编译这些 JavaScript 文件，你应该设置 `outDir` 或者 `outFile` 选项，定向到其他位置，这样他们就不会与源文件冲突。如果你仅仅是想包含这些 JavaScript 文件，但是不需要编译，设置 `noEmit` 选项为 `true` 可以跳过编译检查。
