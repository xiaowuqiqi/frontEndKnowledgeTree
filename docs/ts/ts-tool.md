---
title: TS工具函数
order: 10
nav: TS
---
# TS工具函数

参考地址：https://ts.nodejs.cn/docs/handbook/utility-types.html

> 包路径：D:\work\hzero-front-feida\node_modules\typescript\lib\lib.es5.d.ts

## Partial

使T中的所有属性都是可选的

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

## Required

使T中的所有属性都是必须定义

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

## Readonly *

使T中的所有属性都只读

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

## Pick *

从T中，选择多个（K集）属性，产生新的接口。

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

案例

```ts
type Person = {
  name: string;
  age: number;
}

type Human = Pick<Person, 'age'>

const obj: Human = {
  age: 1,
};
console.log(obj);
```

案例

```ts
interface a {
  name: number
  age: number
}

type c = Pick<a, never>
// 等同于
type c = any
```



## Record *

输入多个属性名字（k集），这些属性类型统一为T，生成接口。

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

例子

```ts
type Human = Record<'name'|'age', string>

const obj: Human = {
  name: 'name',
  age: 'age',
};
console.log(obj);
```

例子

接口设计后都要求属性一一对应，不能有多余属性，这种要求是比较紧的。

如果要求比较松，允许存在多余属性

```ts
type ObjectAny = Record<string, any>;
// 等同于
interface ObjectAny {
   [propName: string]: any;
}
// useLocalStore的例子
useLocalStore<IMobileFormComStore>
useLocalStore<TStore extends Record<string, any>,……> // 允许store可以有多余属性
```



## Exclude *

T 比 U 更精确（T继承自U），则never，U 比 T 更精确，则返回T

> 继承判断逻辑参考 extends 表达式

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

## Extract

同Exclude，但是参数相反

```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

## Omit *

在T接口内，剔除（忽略）一些属性的校验

```ts
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

例子

```ts
interface a {
  name: number
  age: number
  class: string
}
type c = Omit<a, 'name' | 'age'> // 剔除 name 和 age 的限制
const A: c = {
  class: '2',
};

```

列子

```ts
interface a {
  name: number
  age: number
}
type c = Omit<a, 'name' | 'age'> // 都剔完了，则成了any
const A: c = 123;
```

## NonNullable

从T中排除null和未定义

```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;
```

## ReturnType *

获取一个函数类型的**返回值**类型。

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

例子

```ts
function test1Fn() {
    return {
        name: 1,
        age: '2',
    }
}
type t = ReturnType<typeof test1Fn>
/**
type t = {
	name: number,
	age: string
}
*/
const d2: t = {name: 2, age: '33'}
```

## Parameters *

获取一个函数类型的**参数**的类型，用**元组**返回。

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

案例

```ts
declare function f1(arg: { a: number; b: string }): void;
type T0 = Parameters<() => string>; // []

type T1 = Parameters<(s: string) => void>; //  [s: string]

type T2 = Parameters<<T>(arg: T) => T>; // [arg: unknown]

type T3 = Parameters<typeof f1>;
/**
[arg: {
    a: number;
    b: string;
}]
*/
```

## ConstructorParameters *

获取 **class** 的**入参的类型**，用**元组**输出。

```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
```

案例

```ts
class Parent {
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age
    }
}
let obj: ConstructorParameters<typeof Parent> = ['tstst', 2344] // [string,number]
```

## InstanceType

返回构造函数的**实例类型**。

```ts
/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```

案例

```ts
class C {
  x = 0;
  y = 0;
}
type T0 = InstanceType<typeof C>;
// type T0 = C
```



