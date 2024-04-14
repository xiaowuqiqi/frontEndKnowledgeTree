---
title: TS基础
order: 1
nav: TS
---
# TS基础

JavaScript 的类型分为两种：原始数据类型（[Primitive data types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)）和对象类型（Object types）。

原始数据类型包括：布尔值、数值、字符串、`null`、`undefined` 以及 [ES6 中的新类型 `Symbol`](http://es6.ruanyifeng.com/#docs/symbol)。

下面介绍，在 TypeScript 中的应用。

## 数据类型

### boolean

```typescript
let isDone: boolean = false
isDone = true;
```

### number

```typescript
let decLiteral:number = 6;
let nexLiteral:number = 0xf00d //16进制
let binaryListeral: number=0b1010 //2进制
let octalListeral:number = 0o733 //8进制
```

### string

```typescript
let name2:string = '11'
let sentence:string = `hello, ${name2}`
```

### 空值

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数

```typescript
function alertName(): void {
	alert('My name is Tom');
}
```

### 任意值

任意值（Any）用来表示允许赋值为任意类型。

在任意值上访问任何属性都是允许的，也允许调用任何方法。

```js
let anyThing: any = 'hello'; //可以赋值任意类型
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```

> 注：声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。

一般尽量避免使用Any，因为使用他会失去 ts 的意义。

 只有引用第三方库时，可能不知道方法返回值，就可以使用 any 。

**未声明类型的变量，会默认为任意值**

变量如果**在声明**的**时**候，**未指定**其**类型**，那么它会被识别为任意值类型：

```js
let something;
something = 'seven';
something = 7;
something.setName('Tom');
```

等价于

```js
let something: any;
something = 'seven';
something = 7;
something.setName('Tom');
```

### Array

最简单的方法是使用**类型 + 方括号**来表示数组。

```js
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

也可以使用**数组泛型**（Array Generic），`Array<elemType>` 来表示数组：

```js
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

接口也可以用来描述数组：

```js
interface NumberArray {    
	[index: number]: number; // 键类型假如为 number，值必须是number
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

`NumberArray` 表示：只要 `index` 的类型是 `number`，那么值的类型必须是 `number`。也就是说，数组内都必须是 number 类型。

**any 在数组中的应用**

一个比较常见的做法是，用 `any` 表示数组中允许出现任意类型：

```js
let list: any[] = [
    'Xcat Liu', 25, { website: 'http://xcatliu.com' }
];
```

**类数组**

类数组（Array-like Object）不是数组类型，比如 `arguments`，使用数组定义时会**报错**。

```js
function sum() {
    let args: number[] = arguments;
}

// index.ts(2,7): error TS2322: Type 'IArguments' is not assignable to type 'number[]'.
//   Property 'push' is missing in type 'IArguments'.
```

事实上常见的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等。这里使用了 **IArguments** 内置对象。

```js
function sum() {    
	let args: IArguments = arguments;
    //IArguments 内置的接口
}
```

### 枚举

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

```js
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
//enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
//也可以手动赋值。
console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```

事实上，上面的例子会被编译为：

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

> 枚举类型简单的说就是：用不同数字代表不同状态。

## 类型推论

以下代码虽然没有指定类型，但是会在编译的时候报错：

```js
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：

```js
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;
// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

> 这里需要和未赋值任意值做区别。
>
> 未赋值任意值：
>
> ```js
> let something; //any 类型
> something = 'seven';
> ```
>
> 类型推论：
>
> ```js
> let something = 'seven'; //string 类型
> ```
>
> 一个是默认  any 类型，一个默认 string 类型。

## 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

```js
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

上边给予类型是 string 和 number，下边赋值 boolean 类型，所以报错。

```js
let myFavoriteNumber: string | number;
myFavoriteNumber = true;
// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

联合类型使用 `|` 分隔每个类型。

这里的 let myFavoriteNumber: string | number 的含义是，允许  myFavoriteNumber 的类型是 string 或者 number ，但是不能是其他类型。

**访问联合类型的属性或方法**

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们**只能访问此联合类型的所有类型里共有的属性或方法**：

例如下边一例，length 属性只有 string 类型有，而 number类型没有，所以就报错了。

```js
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

而，他们共有 toString() 方法。所以不会报错。

```js
function getString(something: string | number): string {
    return something.toString();
}
```

## 类型断言

TypeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为**类型断言**。

类型断言，用于**手动指定一个类型**，一般用于对象的属性上。

使用方式： 

```js
<类型>值 
```

```js
值 as 类型
```

联合类型中，访问联合类型的属性或方法的案例。一下面方式写，则不会报错。

```js
// function getLength(something: string | number): number {
//     return something.length; //报错，因为如果为 nulmber类型时会没有length属性。
// }

function getLength2(something: string | number): number {
    if ((something as string).length) {
        //或者 <string>something
        //用断言，标记改变量类型是 string，这样就不会报错。
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```

**类型断言不是类型转换**，断言成一个联合类型中不存在的类型是不允许的，所以会报错。

```js
function toBoolean(something: string | number): boolean {
    return <boolean>something; 
    //something 必须是 number或string。
}

// index.ts(2,10): error TS2352: Type 'string | number' cannot be converted to type 'boolean'.
//   Type 'number' is not comparable to type 'boolean'.
```

需要切换类型时，可以先切到 any 或者 unknown。

```ts
function fn(test: number | string): boolean {
    return test as unknown as boolean
}
```

## 元组

数组合并了相同类型的对象，而元组（Tuple）合并了**不同类型**的对象。

**通常使用**

```js
let x:[string,number]
x = ['1',2]
//[1,'2'] //报错
//x[3] = 1 没有索引 3，所以报错。
```

定义并赋值

```js
let xcatliu: [string, number] = ['Xcat Liu',undefined];
```



## 其他概念

### 编译时候出错，要比运行时出错要好

注意，当我们定义了一个类型，但是使用其他类型数值为他赋值，会出现错误，这个错误会在编译时候出现，编译后的js文件没有校验类型的功能。

这也就是所说的 “ 编译时候出错，要比运行时出错要好 ” 。

