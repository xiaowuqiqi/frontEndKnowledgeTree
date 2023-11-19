---
title: Terser
nav: webpack
group:
  title: optimization
  order: 1
order: 3
---

# Terser

[Minify options](https://github.com/terser/terser#minify-options)

## ecma

`ecma`（默认`undefined`）- 通过`5`、`2015`、`2016`等来覆盖 `compress`和`format`的`ecma`选项。

`terser` 会按照指定的 ES 版本来输出代码，这样可以确保输出的代码与目标环境的 JavaScript 引擎兼容。

> 设置为 `ecma: 5`，`terser` 会输出 ES5 代码。
>
> 设置为 `ecma: 2015` 或 `ecma: 6`，那么输出的代码将会是 ES6/ES2015 格式。

## enclose

`enclose`（默认`false`） - pass`true`或格式为 的字符串`"args[:values]"`，其中`args`和`values`分别是逗号分隔的参数名称和值，用于将输出嵌入到具有可配置参数和值的大函数中。

## parse

配置额外的[Parse options（解析选项）](https://github.com/terser/terser#parse-options)

### bare_returns*

`bare_returns`在顶级作用域中使用 `return` 语句，而不会在解析时遇到错误。

> 这个功能在某些特定环境中是很有用的，例如在 Node.js 的 REPL 环境中或者某些嵌入式的 JavaScript 解释器中，这些环境可能允许或需要在顶级作用域中使用 `return` 语句。

```js
parse.bare_returns= false
```

### html5_comments

否应该保留以 `<!--` 开始和以 `-->` 结束的 HTML5 样式的注释。（注意他控制的不是html文件内的注释，terser主要处理js文件）

```js
parse.html5_comments= true // 默认保留注释
```

true: 保留注释，false：删除注释。

### shebang*

是否保留输入代码中的 "shebang"（`#!command`）行。在 JavaScript 或 Node.js 脚本中，这通常用于直接指定 Node.js 作为解释器。

> 对于那些要直接在命令行中运行的 Node.js 脚本，shebang 是必要的，因为它告诉操作系统使用 Node.js 来执行脚本。
>
> ```js
> #!/usr/bin/env node
> console.log("Hello, World!");
> ```

```js
parse.shebang= true // 默认保留注释
```

### spidermonkey

允许你使用 SpiderMonkey AST 格式的输入。SpiderMonkey AST 是 Mozilla 的 SpiderMonkey JavaScript 引擎使用的抽象语法树格式。

```js
parse.spidermonkey= false
```

## compress*

传递`false`以完全跳过压缩。传递一个对象来指定自定义[compress options（压缩选项）](https://github.com/terser/terser#compress-options)。

### defaults

传递`false`以禁用大多数默认启用的`compress`选项，如果只想启用几个 `compress`选项而禁用其余选项时就传入`false`。

```js
compress.defaults= true // 启用terser提供的默认配置
```

### arrows

arrows 专门用于控制箭头函数的压缩，会尝试将传统的函数表达式转换为箭头函数，如果这样做可以简化代码并保持功能不变。同时，它也可能会对现有的箭头函数进行进一步的简化。

> 例如 `m(){return x}`变为`m:()=>x`

```js
compress.arrows= true  // 默认值是 true
```

> 当ecma为5时，这个转化失效。

### arguments

用函数参数，来替换函数体内部相对应的 `arguments` 对象的访问。

> ```js
> function sum() {return arguments[0] + arguments[1];}
> ```
>
> 替换为
>
> ```js
> function sum(a, b) { return a + b; }
> ```

```js
compress.arguments= true  // 默认值是 true
```

### booleans*

此选项决定了是否应优化**布尔表达式**。

> ```js
> !!a ? b : c 
> // 替换为
> a ? b : c
> 
> true && someCondition
> // 替换为
> someCondition。
> ```

```js
compress.booleans= true  // 默认值是 true
```



### booleans_as_integers

此选项决定了是否应将**布尔值转换为整数**，从而可能进一步压缩输出代码。将布尔值转换为 0 和 1。

> 使用 `compress.booleans_as_integers` 选项可以帮助进一步压缩输出代码，但使用时要小心，确保不会破坏代码的原有逻辑。

```
compress.booleans_as_integers= false  
```

### collapse_vars*

此选项决定了是否应**合并或嵌套变量引用**（一次性变量），从而可能进一步压缩输出代码。且可以避免额外的变量赋值时。

> ```js
> var value = someFunction();
> var result = value * 10;
> // 转为
> var result = someFunction() * 10;
> ```

```
compress.collapse_vars= true  
```

### comparisons*

这个选项决定了是否尝试优化**条件比较**。（ =，>，< 等比较）

> 启用 lhs_constants 选项时效果更好。

> ```js
> if (x === true) {
>  // do something
> }
> // 转为
> if (x) {
>  // do something
> }
> ```

```js
compress.comparisons= true  
```

### computed_props

会尝试优化对象的**计算属性**（中括号）访问，尤其是当属性名为常量时。

> ```js
> const key = "myProp";
> const value = obj[key];
> // 转为
> const value = obj.myProp;
> 
> {["computed"]: 1}
> // 转为
> {computed: 1}
> ```

```js
compress.computed_props= true  
```

### conditionals*

优化 `if` **条件句**和**三元操作符**

> ```js
> if (someCondition) {
>     x = 10;
> } else {
>     x = 20;
> }
> // 转为
> x = someCondition ? 10 : 20;
> ```

```js
compress.conditionals= true  
```

### dead_code*

决定是否**移除**代码中检测到的死代码（即那些**不可能执行的代码**片段）。

> ```js
> if (false) {
>  console.log("This will never be executed.");
> }
> console.log("This will be executed.");
> // into
> console.log("This will be executed.");
> ```

```js
compress.dead_code = true
```

### directives

尝试**移除**不需要或**冗余**的**指令**。

> ```js
> "use strict";
> "use strict";
> function hello() {
>  "use strict";
>  return "Hello World!";
> }
> // into
> "use strict";
> function hello() {
>  return "Hello World!";
> }
> ```

```js
compress.directives = true
```

### drop_console*

传递`true`以**删除对 `console.*`函数**的调用。

如果你只想丢弃控制台的一部分，你可以传递一个像这样的数组`['log', 'info']`，它只会丢弃`console.log`、`console.info`。

```js
compress.drop_console = false
```

### drop_debugger*

`drop_debugger`（默认值：`true`）--**删除`debugger;`语句**

```js
compress.drop_debugger = true
```

### ecma

同上解释，默认值：`5`，建议统一设置

### evaluate*

尝试**计算常量表达式**

> ```js
> var result = 2 * 3;
> // into
> var result = 6;
> ```

```js
compress.evaluate = true
```

### expression

此选项决定了是否将**顶层返回语句**的返回值**视为单一表达式**。

> ```js
> return (function() {
>  console.log("Hello World!");
> })();
> // 转化
> console.log("Hello World!");
> ```

```
compress.expression = false
```

### global_defs*

此选项允许您为全局变量预先定义静态值。这常用于在构建过程中替换特定的全局常量，例如为不同的环境（如生产或开发）设置不同的配置值。参见[条件编译](https://github.com/terser/terser#conditional-compilation)

> ```js
> {
> compress: {
>   global_defs: {
>       DEBUG: false,
>       VERSION: "1.0.0",
>       @VERSION: '1.0.0', // 添加 @ 证明替换的标识符而不是字符串
>   }
> }
> }
> // start
> if (DEBUG) {
> console.log("Debugging mode is on.");
> }
> console.log("Version:", VERSION);
> // into
> console.log("Version:", "1.0.0"); // 没有 @
> console.log("Version:", 1.0.0); // 有 @
> ```

```js
compress.global_defs = {}
```

### hoist_funs

提升函数声明

> ```js
> console.log("Hello World!");
> function greet() {
>  return "Greetings!";
> }
> // 转为
> function greet() {
>  return "Greetings!";
> }
> console.log("Hello World!");
> ```

```js
compress.hoist_funs = false
```

### hoist_props

将常量对象和数组文字提升为常规变量，但要满足一组约束。

> ```js
> var o = {p:1, q:2}; f(o.p, o.q); 
> // 会被转换为 
> f(1, 2);
> ```

```js
compress.hoist_props = true
```

### hoist_vars

提升`var`声明（这是`false` 默认的，因为它通常会增加输出的大小）

```js
compress.hoist_vars = false
```

### if_return

优化了包含 return 语句的 if 语句（包括return 和 continue）

> ```js
> function foo(x) {
>  if (x) {
>      return true;
>  }
>  return false;
> }
> // into
> function foo(x) {
>  return !!x;
> }
> ```

```js
compress.if_return = true
```

### inline*

这个选项控制**函数内联**的行为。函数内联是一种优化技术，将**函数调用**替换为**函数体的内容**，以减少函数调用的开销并可能进一步优化代码。

> ```js
> function square(x) {
>  return x * x;
> }
> console.log(square(5));
> // into
> console.log(5 * 5);
> ```

```js
compress.inline = true // 3
```

- `0（false）`-- 禁用内联
- `1`-- 内联简单函数
- `2`-- 带参数的内联函数
- `3（true）`-- 带参数和变量的内联函数

### join_vars

连接连续的`var`, `let`和`const`语句

```js
compress.join_vars = true
```

### keep_classnames*

是否在**压缩**过程中**保留类名**。默认情况下，为了尽可能减小输出大小，`terser` 会对类名进行重命名和缩短。

另请参见：`keep_classnames` [mangle 选项](https://github.com/terser/terser#mangle-options)。

> ```js
> class ExampleClass {
>  constructor() {
>      console.log("This is an example class.");
>  }
> }
> // into
> class a {
>  constructor() {
>      console.log("This is an example class.");
>  }
> }
> ```

```js
compress.keep_classnames = false
```

传递**`true`**以防止压缩器丢弃类名。

默认**`false`**压缩所有类名。

传递**正则表达式**以仅保留与该正则表达式匹配的类名。

### keep_fargs*

防止压缩器丢弃未使用的函数参数。依赖于`Function.length`

> ```js
> function exampleFunction(arg1, arg2, unusedArg) {
>  console.log(arg1, arg2);
> }
> // into
> function exampleFunction(a, b) {
>  console.log(a, b);
> }
> ```

```js
compress.keep_fargs = true
```

- `true`：`terser` 会保留所有函数参数，即使它们没有被使用。
- `false`：`terser` 会移除未使用的函数参数。

### keep_fnames*

同上，是否在**压缩**过程中**保留函数名**。默认情况下，为了尽可能减小输出大小，`terser` 会对函数名进行重命名和缩短。依赖`Function.prototype.name`实现

另请参见：`keep_fnames` [mangle 选项](https://github.com/terser/terser#mangle-options)。

```js
compress.keep_fnames = false
```

### keep_infinity

传递`true`以防止`Infinity`被压缩为`1/0`，这可能会导致 Chrome 上的性能问题。

```js
compress.keep_infinity = false
```

### lhs_constants*

将常量值移动到二进制节点的左侧。

这有助于 comparisons 属性比较时的计算，效果更好。

> ```js
> foo == 42
> //into
> 42 == foo
> ```

```js
compress.lhs_constants = true
```

### loops

当我们可以静态地确定条件时，对do、while和for循环进行优化。

```js
compress.loops = true
```

### module*

压缩 ES6 模块时设置为true，开启更多优化。

```js
compress.module = false
```

### negate_iife*

选项控制 IIFE (Immediately Invoked Function Expression，**立即调用的函数表达式**) 的优化。

> ```js
> (function() {
>  console.log("IIFE example");
> })();
> // into
> !function() {
>  console.log("IIFE example");
> }();
> ```

```js
compress.negate_iife = true
```

### passes*

 运行压缩的最大次数。传入高数字会进行多轮压缩，会更耗费时间

```js
compress.passes = 1
```

### properties*

对象属性的访问，从方括号表示法转换为点表示法。

> ```js
> foo["bar"] 
> // into
> foo.bar
> ```

```js
compress.properties = true
```

### pure_funcs*

它主要用于指定哪些**函数**是“纯净”的，也就是**不带有任何副作用**的。当你指定某个函数为纯净的时候，`terser` 会在代码压缩过程中，如果发现该函数的**返回值没有被使用**，就会直接**删除**这个函数调用，从而达到减少代码体积的目的。

> ```js
> {
> compress: {
>  pure_funcs: ['Math.floor']
> }
> }
> // 在上述配置中，Math.floor 被指定为纯净函数。
> var q = Math.floor(a/b)
> // into
> Math.floor(a/b) // 默认，如果变量`result`没有在其他地方使用，Terser 会删除它。
> 空 // 传递`pure_funcs: [ 'Math.floor' ]`让它知道该函数不会产生任何副作用，在这种情况下，整个语句将被丢弃。
> ```

```js
compress.pure_funcs = null
```

有点类似于webpack 的 optimization.sideEffects 属性，但是pure_funcs 指定一个函数列表，而 sideEffects 是在package.json 中设置的注意处理模块。

### pure_getters*

会假定对象属性的**获取操作**（getters）是**没有副作用**的。这样，如果某个属性的获取操作的**结果没有被使用**，那么这个获取操作就会被 `terser` **删除**，从而减小代码体积。

> ```JS
> const obj = {
> get prop() {
>  console.log("Getting the property!");
>  return "value";
> }
> };
> 
> const value = obj.prop;
> ```

```JS
compress.pure_getters = 'strict'
```

### reduce_vars*

它允许 `terser` 通过**变量替换**来优化或简化表达式，减小代码体积。

> ```js
> let x = 10;
> let y = x * 2;
> console.log(y + 5);
> // into
> console.log(25);
> ```

```js
compress.reduce_vars = true
```

### reduce_funcs

（已经废弃，推荐使用inline）内联一次性函数。取决于是否`reduce_vars`启用。禁用此选项有时会提高输出代码的性能。

### sequences*

当这个选项被设置为 `true` 时，`terser` 会尝试将连续的简单语句（statements）合并成使用逗号操作符的序列表达式，从而减少代码体积。

> ```js
> let a;
> let b;
> a = 5;
> b = 10;
> console.log(a, b);
> // into
> let a, b;
> a = 5, b = 10, console.log(a, b);
> ```

可以设置为正整数以指定将生成的连续逗号序列的最大数量。如果此选项设置为。

 `true`则默认`sequences`限制为`200`。

将选项设置为`false`或`0` 禁用。

### side_effects*

`terser` 会尝试删除那些被认为是“无副作用”的代码段。这主要针对于那些返回值没有被使用、并且调用本身不产生任何预期外的效果的代码段。

```js
compress.side_effects = true
```

### switches*

去重复并删除无法访问的`switch`分支（删除 case）

```js
compress.switches = true
```

### toplevel*

它会尝试优化和**删除**那些在**全局作用域**（或模块的顶层作用域）中的**未被引用**或未被使用的**变量 (`"vars"`) 和函数(`"funcs"`) **。

> ```js
> function unusedFunction() {
> console.log("This function is never called.");
> }
> const usedVariable = 10;
> const unusedVariable = "I'm not used anywhere.";
> console.log(usedVariable);
> // into
> const usedVariable = 10;
> console.log(usedVariable);
> ```

```js
compress.toplevel = false // 默认不删除
```

### top_retain*

防止`unused`**删除**特定的**全局作用域**函数和变量。

```js
compress.top_retain = null
```

可以传出正则，数组，逗号分隔的字符串。

### typeofs

转换`typeof foo == "undefined"`为 `foo === void 0`。

```js
compress.typeofs = true
```

IE10和更早版本的此值设置为false。

### unsafe*

各种**内置变量定义时的转化**，在某些人为的情况下*可能会*破坏代码逻辑。

- `new Array(1, 2, 3)`或`Array(1, 2, 3)`→`[ 1, 2, 3 ]`
- `Array.from([1, 2, 3])`→`[1, 2, 3]`
- `new Object()`→`{}`
- `String(exp)`或`exp.toString()`→`"" + exp`
- `new Object/RegExp/Function/Error/Array (...)`→ 我们丢弃`new`
- `"foo bar".substr(4)`→`"bar"`

```js
compress.unsafe = false
```

### unsafe_arrows*

Terser 会进行更为**激进的箭头函数转换**，这种转换可能会从函数中**移除 `arguments` 对象**或 **`this` 绑定**，这有时可能会导致问题。

```js
compress.unsafe_arrows = false
```

### unsafe_comps*

这个选项决定了比较激进的优化**条件比较**。（ =，>，< 等比较）类似 comparisons 属性，反转`<`和`<=`到`>`和`>=`以允许改进压缩。

> 由于使用get或valueOf等方法，当两个操作数中至少有一个是具有计算值的对象时，这可能是不安全的。

> ```js
> !(a <= b) 
> // 转为
> a > b
> 
> a = !b && !c && !d && !e 
> // 转为
> a=!(b||c||d||e)
> ```

```js
compress.unsafe_comps = false
```

仅当`comparisons`和 `unsafe_comps`都设置为 true 时，压缩才有效。

### unsafe_Function

针对 **Function 构造函数进行优化**，使用 `Function` 构造函数并且它的参数 `args` 和 `code` 都是字符串字面量时，进行压缩和混淆操作。

> ```js
> const foo = new Function("return 'Hello, World!';");
> // into 
> const foo = function() { return 'Hello, World!'; };
> ```

```js
compress.unsafe_Function = false
```

### unsafe_math*

**优化数字表达式**，例如 `2 * x * 3`into `6 * x`，这可能会给出不精确的浮点结果。

```
compress.unsafe_math = false
```

### unsafe_symbols

尝试**删除 Symbol的key**。

> ```js
> Symbol("kDog")
> // 变为
> Symbol()
> ```

```js
compress.unsafe_symbols = false
```

### unsafe_methods*

 转换`{ m: function(){} }`为 `{ m(){} }`。 `ecma`必须设置为`6`或更大才能启用此转换。

```js
compress.unsafe_methods = false
```

### unsafe_proto*

优化表达式，转化`Array.prototype.slice.call(a)` into `[].slice.call(a)`

```js
compress.unsafe_proto = false
```

### unsafe_regexp*

`terser` 会对 `RegExp` 对象进行一些不安全的优化。

> ```js
> const pattern = new RegExp("^\\s+|\\s+$", "g");
> // into
> const pattern = /^\s+|\s+$/g;
> ```

```js
compress.unsafe_regexp = false
```

### unsafe_undefined

如果在作用域中存在名为**undefined的变量**，则替换为**void 0**(变量名将被打乱，通常减少为单个字符)。

```js
compress.unsafe_undefined = false
```

### unused*

`terser` 会删除那些定义了但从**未使用过的变量和函数**，从而帮助进一步减少代码的体积。

> ```js
> function unusedFunction() {
> console.log("This function is never called.");
> }
> const usedVariable = 10;
> const unusedVariable = "I'm not used anywhere.";
> console.log(usedVariable);
> // into
> const usedVariable = 10;
> console.log(usedVariable);
> ```

```js
compress.unused = true
```



### [Mangle](https://github.com/terser/terser#mangle-options)

重整选项，关注于通过各种代码转换和优化来减小大小。

### eval

改变那些在 `eval` 中使用的变量名。这是一个危险的操作，因为 `eval` 允许执行字符串中的代码，这可能导致代码在压缩后行为改变。

> ```js
> let longVariableName = 42;
> eval('console.log(longVariableName)');
> // into
> let a = 42;
> eval('console.log(a)');
> ```

```js
mangle.eval = false
```

### keep_classnames*

是否在**压缩**过程中**保留类名**。默认情况下，为了尽可能减小输出大小，`terser` 会对类名进行重命名和缩短。

```js
mangle.keep_classnames = false
```

### keep_fnames*

同上，是否在**压缩**过程中**保留函数名**。默认情况下，为了尽可能减小输出大小，`terser` 会对函数名进行重命名和缩短。

```js
mangle.keep_fnames = false
```

### module*

压缩 ES6 模块时设置为true，开启更多优化。

```js
mangle.module = false
```

### reserved*

用于指定一个变量名数组，这些变量名在压缩时不会被更改（或说“混淆”）。

> ```js
> {
> mangle: {
>  reserved: ['someVariableName', 'anotherVariableName']
> }
> }
> // start
> function myFunction() {
> let someVariableName = 10;
> let anotherVariableName = 20;
> let thirdVariable = 30;
> 
> return someVariableName + anotherVariableName + thirdVariable;
> }
> // into
> function myFunction() {
> let someVariableName = 10;
> let anotherVariableName = 20;
> let a = 30;
> 
> return someVariableName + anotherVariableName + a;
> }
> ```

```js
mangle.reserved = []
```



### toplevel

同上

```js
mangle.toplevel = false
```

### safari10

传递`true`以解决 Safari 10 循环迭代器[错误](https://bugs.webkit.org/show_bug.cgi?id=171041) : “无法声明 let 变量两次”

```js
mangle.safari10 = false
```

## mangle.properties

`mangle.properties`(默认`false`) — mangle 选项的子类别。传递一个对象来指定自定义[mangle 属性选项](https://github.com/terser/terser#mangle-properties-options)。

## [Format](https://github.com/terser/terser#format-options)

### ascii_only*

转义字符串和正则表达式中的 Unicode 字符（影响非 ascii 字符无效的指令）

```js
format.ascii_only = false
```

### braces*

terser 会始终为**控制结构（例如 `if`、`else`、`for`、`while` 等）**使用**花括号**，即使代码块只有一条语句。

> ```js
> if (someCondition)
> doSomething();
> // into
> if (someCondition) { doSomething(); }
> ```

```js
format.braces = false
```

### comments*

根据设置，用于控制在压缩输出中**保留哪些注释**。

> ```js
> // This is a regular comment.
> /** @preserve This comment should be preserved. */
> function myFunction() {
> // This is another regular comment.
> return "Hello, World!";
> }
> // into 
> javascriptCopy code/** @preserve This comment should be preserved. */
> function myFunction(){return "Hello, World!"}
> ```

```js
format.comments = 'some'
```

1. **`false`**：这意味着删除所有注释。

   ```js
   javascriptCopy code{
     format: {
       comments: false
     }
   }
   ```

2. **`true`**：这意味着保留所有注释。

   ```js
   javascriptCopy code{
     format: {
       comments: true
     }
   }
   ```

3. **`"all"`**：同样是保留所有注释。

4. **`"some"`**：仅保留某些特定的注释。通常，这是用来保留那些包含特定标记（例如 `@license` 或 `@preserve`）的注释。

   ```js
   javascriptCopy code{
     format: {
       comments: "some"
     }
   }
   ```

5. **函数**：你可以提供一个函数，该函数将被传入注释的内容，并根据返回的布尔值决定是否保留该注释。

   ```js
   javascriptCopy code{
     format: {
       comments: function(node, comment) {
         const text = comment.value;
         return /@preserve|@license/.test(text);
       }
     }
   }
   ```

### ecma

同上

### indent_level*

它控制在**格式化**输出代码时使用的**缩进级别**。这个选项的主要作用是帮助开发者控制代码的可读性，尤其是在需要生成更易于阅读和调试的代码版本时。

注意，semicolons 要设为false

```
format.indent_level = 4
```

### indent_start*

在所有行前添加那么多空格

```
format.indent_start = 0
```

### inline_script

当**内联脚本**中包含 **`</script>` 字符串**（即使它是一个字符串的一部分），浏览器可能会误解为这是脚本标签的结束，从而导致脚本错误。为了避免这种情况，terser 提供了 `format.inline_script` 选项，确保这样的字符串被适当地**转义**。

> ```js
> let str = "</script>";
> console.log(str);
> // into 
> let str = "<\/script>";
> console.log(str);
> ```

```js
format.inline_script = true
```

### keep_numbers*

**不启用 `format.keep_numbers` 选项时**，terser 会尝试以更短的形式表示数字。

> ```js
> let value = 1000.00;
> // into
> let value=1e3;
> ```

```js
format.keep_numbers = false // 转化数字
```

### keep_quoted_props*

用于决定是否**保持对象属性名的引号**。

> ```js
> const obj = {
> "name": "John",
> age: 25,
> "is-student": false
> };
> // into 
> const obj={name:"John",age:25,"is-student":false};
> ```

```js
format.keep_quoted_props = false // 去除引号
```

### max_line_len*

最大行长度（对于精简代码），一行字数限制。

```js
format.max_line_len = false
```

### preamble*

允许你在压缩输出的**开头插入**一个**特定的字符串或注释**。这常用于**加入版权信息、许可证信息**或其他重要的前导注释。

> ```js
> function hello() {
> console.log("Hello, World!");
> }
> // into
> /* Copyright 2023 by Company Name. All rights reserved. */
> function hello(){console.log("Hello, World!");}
> ```

```js
format.preamble = null
```

### quote_keys*

对象的 key 都**被引号括起来**。

> ```js
> const obj={validKey:"value","another-key":"another value",123:"numeric key"};
> // into
> const obj={"validKey":"value","another-key":"another value","123":"numeric key"};
> ```

```js
format.quote_keys = false // 关闭
```

### quote_style*

控制压缩输出中的**字符串和属性名**的**引号样式**。

```js
format.quote_style = 0 
```

- `0` 或 `'auto'`: 自动选择最短的引号形式。
- `1` 或 `'single'`: 使用单引号。
- `2` 或 `'double'`: 使用双引号。
- `3` 或 `'original'`: 保持原始的引号样式。

### preserve_annotations

在输出中保留[Terser 注释。](https://github.com/terser/terser#annotations)

```js
format.preserve_annotations = false
```

**[注释](https://github.com/terser/terser#annotations)**

Terser 中的注释是告诉它以不同方式对待某个函数调用的一种方式。可以使用以下注释：

- `/*@__INLINE__*/`- 强制将函数内联到某处。
- `/*@__NOINLINE__*/`- 确保被调用的函数没有内联到调用站点中。
- `/*@__PURE__*/`- 将函数调用标记为纯函数。这意味着，它可以安全地掉落。
- `/*@__KEY__*/`- 将字符串文字标记为属性，以便在修改属性时也修改它。
- `/*@__MANGLE_PROP__*/`- 当启用属性修饰器时，选择对象属性（或类字段）进行修饰。

您可以`@`在开头使用 符号，也可以使用`#`.

以下是一些有关如何使用它们的示例：

```js
/*@__INLINE__*/
function_always_inlined_here()

/*#__NOINLINE__*/
function_cant_be_inlined_into_here()

const x = /*#__PURE__*/i_am_dropped_if_x_is_not_used()

function lookup(object, key) { return object[key]; }
lookup({ i_will_be_mangled_too: "bar" }, /*@__KEY__*/ "i_will_be_mangled_too");
```

### safari10

将此选项设置为`true`解决[Safari 10/11 等待错误](https://bugs.webkit.org/show_bug.cgi?id=176685)。另请参见：`safari10` [mangle 选项](https://github.com/terser/terser#mangle-options)。

```js
format.safari10 = false
```

### semicolons*

用分号分隔语句。如果您通过`false`，那么只要有可能，我们将**使用换行符而不是分号**，从而使缩小后的代码输出更具可读性（gzip 之前的大小可能会更小；gzip 之后的大小会稍微大一些）。

```js
format.semicolons = true
```

### shebang

（默认`true`），同上。是否保留输入代码中的 "shebang"（`#!command`）行。在 JavaScript 或 Node.js 脚本中，这通常用于直接指定 Node.js 作为解释器。

### spidermonkey

(默认`false`），同上。

### webkit

启用 WebKit 错误的解决方法。PhantomJS 用户应将此选项设置为`true`。

```js
format.webkit = false
```

### wrap_iife

用于控制立即执行函数表达式（IIFE，Immediately Invoked Function Expression）**是否应该被括号包围**。

为了避免在某些情况下与其他代码产生语法冲突。

> ```js
> const result = function() {
> return "Hello, World!";
> }(); 
> // into
> const result=(function(){return"Hello, World!"})();
> ```

```js
format.wrap_iife = false
```

类似 **`negate_iife`** 属性，但它们的目的和行为是不同的。`negate_iife` 旨在**减少代码的大小**，而 `wrap_iife` 旨在**确保代码的正确性**。

### wrap_func_args

控制是否将**函数参数**括在**括号**中。

> ```js
> const func = x => x * x;
> // into
> const func=(x)=>x*x;
> ```

```
format.wrap_func_args = true
```

## sourceMap

`sourceMap`（默认`false`）- 如果您希望指定 [源映射选项，](https://github.com/terser/terser#source-map-options)则传递一个对象。

## toplevel

同上

## nameCache

`nameCache`（默认`null`） -如果您希望在多次调用中缓存损坏的变量和属性名称，请传递一个空对象`{}`或以前使用过的对象。注意：这是一个读/写属性。将读取该对象的名称缓存状态并在缩小期间更新它，以便用户可以重用或在外部保留它。`nameCache``minify()``minify()`

## ie8

`ie8`（默认`false`）- 设置`true`为支持 IE8。

## keep_classnames

`keep_classnames`（默认值`undefined`：） - 通过`true`以防止丢弃或损坏类名。传递正则表达式以仅保留与该正则表达式匹配的类名。

## keep_fnames

`keep_fnames`（默认值：`false`）-传递`true`以防止丢弃或修改函数名称。传递正则表达式以仅保留与该正则表达式匹配的函数名称。对于依赖`Function.prototype.name`. 如果顶级 minify 选项 `keep_classnames`为 ，`undefined`则它将被顶级 minify 选项的值覆盖`keep_fnames`。

## safari10

`safari10`（默认值`false`：） - 传递`true`以解决 Safari 10/11 循环范围和`await`. 有关详细信息，请参阅 和`safari10`中的选项。[`mangle`](https://github.com/terser/terser#mangle-options)[`format`](https://github.com/terser/terser#format-options)