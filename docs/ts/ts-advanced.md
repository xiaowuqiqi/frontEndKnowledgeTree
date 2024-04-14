---
title: TS接口技巧
order: 3
nav: TS
---
# TS类型技巧

参考：https://zhuanlan.zhihu.com/p/40311981

## 合并 &

**合并两个类型**

案例：如合并两个接口

```ts
type Ia = {
  a: string;
}
type Ib = {
  b: string;
}

const d: Ia & Ib = {
  a: '1',
  b: '1',
};
```

案例：如把一个接口扩展为多余属性不进行检查。

```ts
type Ia = {
  a: string;
}

type Ic = Ia & Record<string, any>;

const d: Ic= {
  a: '1', // 这里，如果使用数字1报错，因为Ia的校验生效
  d: '1',
};
```

案例：如果有属性类型冲突，则需要两个都要实现，下例中将一直报错。a 会成为 never 类型。

```ts
type Ia = {
    a: string;
}
type Ib = {
    a: number;
}
type Id = Ia & Ib;
const c: Ib = {
    a: 1 // 错误，不管是数字还是字符串都报错。因为都不满足。
}
```

## 联合类型 |

**扩展**一个**属性的类型**，校验变松了。

案例：a 的属性类型为 string | number 。

```ts
type Ia = {
  a: string;
}
type Ib = {
  a: number;
}

const d: Ia | Ib = {
  a: 1,
};
```

## 顶级类型

unknown和any都是**顶级类型**。顶级类型定义上包含所有类型的父级类型，当其放入 extends 表达式后边参数时，永远返回 true。

TypeScript 3.0 引入了新的`unknown` 类型，它是 `any` 类型对应的安全类型。

### **any**

它**代表**所有**可能**的 JavaScript 值—**基本类型**，对象，数组，函数，Error，Symbol，以及**任何你可能定义的值**。

```ts
let value: any;
 
value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = null;             // OK
value = undefined;        // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK

let value: any;
 
value.foo.bar;  // OK
value.trim();   // OK
value();        // OK
new value();    // OK
value[0][1];    // OK

```

### **unknown**

unknown 可以存储任何类型的值，但是它**类型独立**，在**使用其方法或属性**和**给其他类型赋值**时有严格**限制**。

```ts
let value: unknown;
 
value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = null;             // OK
value = undefined;        // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK

let value: unknown;
 
let value1: unknown = value;   // OK
let value2: any = value;       // OK
let value3: boolean = value;   // Error
let value4: number = value;    // Error
let value5: string = value;    // Error
let value6: object = value;    // Error
let value7: any[] = value;     // Error
let value8: Function = value;  // Error

let value: unknown;
 
value.foo.bar;  // Error
value.trim();   // Error
value();        // Error
new value();    // Error
value[0][1];    // Error

```

## 底层类型

never与void 是 [TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020) 中的底层类型。

### never

never 类型表示永远不存在的值的类型，不能使用。

通常用于一个从来不会有返回值的函数，即死循环（如：如果函数内含有 `while(true) {}`）或者总是抛出错误的函数

```ts
type b1 = number
type c1 = string
type v1 = never extends b1&c1 // true
type v2 = never extends number // true
type v3 = never extends unknown ? // true
```

### void

JavaScript 没有空值（void）的概念，在 `TypeScript` 中，表示没有任何返回值的函数。

```ts
// 没有返回值的函数，其返回值类型为 void
function alertName(): void { alert('My name is Tom'); } 
```

当然你也可以声明一个变量为 `void` ，但你只能将它赋值为 undefined 和  null:

```ts
let unusable: void = undefined; 
```

### never与void的区别

void 表示没有任何类型，never 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。

void 类型可以被赋值（在 strictNullChecking 为 false 时），但是除了never 本身以外，其他任何类型不能赋值给 never。

> unknown 和 never 都不允许执行变量的方法以及访问内部属性，never是所有类型的子类型。



## 获取接口的单独项

使用中括号，获取结构中的一项的类型。

```ts
export interface IPluginParam<V = string | number | undefined | common.ObjectAny> {
  store: view.basicComponent.IBaseComStore,
  text: React.ReactNode,
  currentValue: V,
  setCurrentValue: (value: V) => void,
  pageDesignerStore: IPageDesignerStore,
  sideBarItem: InSideBarItem,
  pluginProps: common.ObjectAny,
}

IPluginParam['setCurrentValue']
```

## extends 条件类型

extends 条件类型通常用于两个**类型间的比较**，比较**前者**是否**可分配**给**后者**。

### 直接使用

例如：

```ts
type v1 = unknown extends number // false unknown 不可赋值给number
```

另一个例子，用于兼容值转类型。

```ts
type TypeName<T> =
	T extends string    ? string :
	T extends number    ? number :
	T extends boolean   ? boolean :
	T extends undefined ? undefined :
	T extends Function  ? Function :
	object;

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;     // "string"
type T2 = TypeName<true>;    // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;    // "object"
```

下例中，如果是**接口**，可以理解为比较两者存在**包含关系**，同时**前者**是否**比后者**更**精确**。

```ts
interface a {
  name: string
  age: number
}

interface b {
  name: string
}

type c = a extends b?number:string // 返回 number
// 表达式正确，
// a的比b更精确，a可以看做继承过b
let T1:t1 = {name:'1',age:2}
let T2:t2 = {name:'1'}
T2 = T1 // 可赋值
```

案例，存在交叉关系。

```ts
// 例子2
interface a {
  name: number
  age: number
}

interface b {
  name: number
  age1: number
}

type c = a extends b ? number : string
// 返回 string 
// 说明有交集，或者交集都没有。a extends b 判定为 false
const t: c = '1';
```

案例，如果是 type 定义的常量，也可以对比精确度。

```ts
type a = 'age'
type b = 'name' | 'age'

type c = a extends b ? number : string
// 表达式正确，
// a比b更精确，a可以看做继承过b
const aObj: c = 1;
```

案例，**never**

当 a 为 never 时，返回永远为 true；当 b 为 never 时，返回永远为 false。

```ts
a extends b
```

### 泛型中使用

泛型中定义时使用 E extends T，表示 E 必须可分配给 T，否则报错。

```ts
interface T {
  name: number
}

interface K1<E extends T> {
  obj: E
}

type k1T = {
  name: number 
    // k1T 需要可分配给 T
    // 如果这里name替换成name1，则就报错
    // 替换成name1后，因为缺少 name，E extends T 返回 false
  age:number
}
const o: K1<k1T> = {
  obj: {
    name: 1,
    age: 1
  },
};
console.log(o);
```

##  is 类型判断函数

`is` 关键字经常用来封装"**类型判断函数**"，通过和函数返回值的比较，从而**缩小**参数的**类型范围**，所以类型谓词 is 也是一种类型保护。

首先 props is type 是一个**布尔**类型，其次它通常用于函数**返回值**，用了它表明这个函数是一个**类型判断函数**，经过这个函数**判断后**，**类型**会**变为**其**判断后类型**。

```js
function isString(value:unknown):boolean{
    return typeof value === "string"
}
function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase() // Error, Object is of type 'unknown'
  }
}
// 这时的x依然是unknown类型，不是string。
// 所以我们需要 is 关键字进行转化
function isString1(value:unknown):value is string{
    return typeof value ==="string"
}
function toUpperCase(x: unknown) {
  if(isString1(x)) {
    x.toUpperCase() // 这里的 x 由 unknown 变为 string 类型了
  }
}
```

另一个例子

```ts
interface IAProps {
  name: string
  js: any
}
let isAProps = (props: any): props is IAProps =>
  typeof (props as IAProps)['js'] !== 'undefined'
// 经过 isAProps 判断，类型变为 IAProps 类型
```

总结，非常类似断言（as），用于类型缩减转化。

## \- 删除类型功能标识

\- 删除类型功能标识，以删除 ? 为例，让该类型必须定义。

```ts
type Required<T> = {
    [P in keyof T]-?: T[P];
};
// 去除T接口的所有可选属性的问号，让可选属性为必须定义。
```

## [_:string] 键选择符

在 interface（接口）中，用**中括号**可以**选择其余键**，也就是**剩余属性**。

案例，比较**宽泛**的**对象定义**

```ts
interface ObjAny extends Object{
	[_:string]:any
}
// 或者
interface Id extends Record<string, any> {
  data: any
}
```

比较宽泛的函数定义

```ts
type fnAny = (...args: any) => any
```

## infer 类型推断

`infer` 最早出现在此 [PR](https://github.com/Microsoft/TypeScript/pull/21496) 中，表示**在 `extends` 条件语句**中**待推断**的**类型**变量。

```ts
type ParamType<T> = T extends (arg: infer P) => any ? P : any;
// 传入一个函数到泛型，返回类型为函数参数的类型（例如：number[]）
```

过程是，这里 extends 依旧是条件类型判断，用于判断 T 是否可分配给后者，而后者中一切出现的 **infer P 都以 any 代替**。

这时 `T extends (arg: infer P) => any ? P : any;` 可以理解为：传入一个函数类型可分配给 `(arg: any) => any` 则返回 P。infer P 则获取 arg 所在函数的类型。

案例

```ts
type InferArray<T> = T extends (infer U)[] ? U : never;

type I0 = InferArray<[number, string]>; // string | number
type I1 = InferArray<string[]>; // string
type I2 = InferArray<number[]>; // number
```

元组案例

```tsx
type InferFirst<T extends unknown[]> = T extends [infer P, ... infer _] ? P : never

type I3 = InferFirst<[3, 2, 1]>; // 3 不是 nubmer
```

推断函数类型的返回值

```tsx
    function test1Fn() {
        return {
            name:1,
            age:'2',
        }
    }

type ReturnType1<T extends Function> = T extends (...age: any) => infer P ? P : never;
type i1 = ReturnType1<typeof test1Fn>
const d2: i1 = {name:2,age:'33'}
```

推断Promise成功值的类型

```tsx
type InferPromise<T> =  T extends Promise<infer U> ? U : never;
type I7 = InferPromise<Promise<string>>; // string
```

推断字符串字面量类型的第一个字符对应的字面量类型

```tsx
type InferString<T extends string> = T extends `${infer First}${infer _}` ? First : [];

type I8 = InferString<"Johnny">; // J
```

## keyof 类型属性名称

TypeScript 允许我们遍历某种类型的属性，并通过 keyof 操作符提取其**类型属性的名称**。

`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

用于 **interface（接口）**中：

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string | number
```

除了接口外，keyof 也可以用于 **class（类）**，比如：

```ts
class Person {
  name: string = "Semlinker";
}

let sname: keyof Person;
sname = "name";
```

keyof 操作符除了支持接口和类之外，它也支持**基本数据类型**：

```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "toString" | "toFixed" | "toExponential" | ...
let K3: keyof symbol; // let K1: "valueOf"
```

案例，传入一个对象与其key值，ts自动校验k是否在 obj 内

```ts
function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

prop({name: 1}, 'name') // T 根据 {name:1} 自动推断，同时 K 根据 'name'自动推断。
```

## typeof 返回变量类型

typeof 返回变量类型，传入一个变量，返回基础类型，如果是对象返回其属性的基础类型。

```ts
// 案例1
let s = "hello";
let n: typeof s; // string

// 案例2
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
// type P = {
//   x: number;
//   y: number;
// }
```

比较复杂的例子，可以观察到，如果属性值是**基础类型**，则用**基础类型表示**。

不是基础类型，是**数组**，则数**组内有的元素**用**联合类型基础类型**表示；

如果是**方法**，方法**参数**和**返回值**用**基础类型**表示；

如果是**对象**，对象**属性值**用**基础类型**表示。

这个过程**递归**深度遍历。

```ts
    const obj1 = {
        a1: [1, 2, () => 2],
        b3: () => 22,
        c4: {
            a: ['2', 2],
            c: 2
        }
    }
    type objT = typeof obj1
    const obj2: objT = {
        a1: [1],
        b3: () => 3,
        c4: {
            a: ['s'],
            c: 55
        }
    }
/**
{ 
    a1: (number | (() => number))[]; 
    b3: () => number; 
    c4: { 
        a: (string | number)[]; 
        c: number; 
    };
}
*/
```

## 特殊类型总结 *

### 宽泛的 class 类型

```ts
new (...args: any) => any
```

例如 `<T extends new (...args: any) => any>` 表示泛型 T 必须是一个构造函数。

### **宽泛**的 object 类型

```ts
interface ObjAny extends Object{
	[_:string]:any
}
// 或者
interface Id extends Record<string, any> {
  data: any
}
```

### 宽泛的 function 定义

```ts
type fnAny = (...args: any) => any
```

