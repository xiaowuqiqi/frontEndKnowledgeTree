---
title: Iterator
order: 7
group:
  order: 2
  title: js基础与案例
nav: JS
---

# 迭代器

## iterator

数据类型中 Map 和 Set、Array、Object 都实现了迭代器接口。

实现迭代器后可以使用**扩展运算符**（三个点）进行解构，也可以使用 **for of** 进行遍历。

> 其他一些场合：
>
> - yield *
> - Array.from()
> - Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
> - Promise.all()
> - Promise.race()

实现 **iterator** 接口，需要**实现 next 方法**，其返回 `{done:false,value:val}` （表示继续遍历）或者 `{done:true}`（表示遍历完成）。

遍历时，每次遍历都会执行 next 方法。

```js
[Symbol.iterator](){return{next(){return{done:false,value:val}}}}
```



### **自定义实现**

#### **直接在对象中使用**

```js
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
```

#### 使用 class 创建

下边一个案例，**使用 class 创建**自定义的可迭代对象。

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

### 自定义实现一个链表

下边一个案例，使用迭代器**实现一个链表**

```js
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return { done: false, value: value };
    }
    return { done: true };
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i); // 1, 2, 3
}
```

### 对于 Array-like 使用迭代器

例如 arguments 或者 dom 元素都是伪数组（Array-like），下边给 dom 元素添加迭代器。

element 继承自 NodeList。所以在原型链上添加 Array 的迭代器即可

```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
[...document.querySelectorAll('div')] // 可以执行了
```

### **yield\***

`yield*`后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

## for of

for of 用于遍历具有 iterator 接口的数据。

### 常用方法

有些数据结构是在现有数据结构的基础上，计算生成的。

**数组、Set、Map** 都部署了以下三个方法，调用后都返回遍历器对象。

> 注意，**对象本身是没有实现 iterator 的**。

- `entries()` 返回一个遍历器对象，用来**遍历`[键名, 键值]`组成**的数组。

  > 对于数组，键名就是索引值。
  >
  > 对于 Set，键名与键值相同。
  >
  > Map 结构的 Iterator 接口，**默认**就是调用`entries`方法。

- `keys()` 返回一个遍历器对象，用来遍历所有的键名。

- `values()` 返回一个遍历器对象，用来遍历所有的键值。

```js
for (let [key, value] of map.entries()) {
  console.log(key + ' : ' + value);
}
for (let [key, value] of map) { //map 的 entries() 也可以省略
  console.log(key + ' : ' + value);
}
```

### return()

在 **for of** 循环中，通常会有 **break 关键字**，或者**报错**导致提前退出。他们都会触发**`return()`方法**。

```js
/**
 下面的两种情况，都会触发执行return()方法。
 * */
 function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}

 // 情况一 break
 for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;  
}

 // 情况二 直接报错
 for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}

```

## asyncIterator

异步迭代器，实现**异步串行功能**。

接口简单实现

```js
const {promisify} = require('node:util')

const delayFn = promisify((...arg) => {
  let callback = arg[arg.length - 1];
  const [time = 2000] = arg.slice(0, -1);
  setTimeout(() => {
    callback(null, 'data')
  }, time)
})

class AsyncIteratorArray {
  constructor(asyncArray = []) {
    this.asyncArray = asyncArray;
    this.i = 0;
  }

  next = async () => {
    const fn = this.asyncArray[this.i++]
    // 这里可以添加处理逻辑。
    // ……  await fn() …… 
    return {
      done: !fn,
      value: fn ? await fn() : null
    }
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  static form(asyncArray) {
    return new AsyncIteratorArray(asyncArray)
  }
}

(async () => {
  const asyncFnArr = [
    () => Promise.resolve('0'),
    () => delayFn(1000).then(() => '1'),
    () => delayFn(1000).then(() => '2'),
    () => delayFn(1000).then(() => '3')
  ]
  for await(let val of AsyncIteratorArray.form(asyncFnArr)) {
    console.log(val)
  }
})()

```

当然，仅仅实现顺序**异步串行功能**的话，可以直接这样写：

```js
(async () => {
  const asyncFnArr = [
    () => Promise.resolve('0'),
    () => delayFn(1000).then(() => '1'),
    () => delayFn(1000).then(() => '2'),
    () => delayFn(1000).then(() => '3')
  ]
  for await(let p of asyncFnArr) {
    const a = await p()
    console.log(a)
  }
})()
// 或者
function forEachAsync(tasks, fn) {
  var result = Promise.resolve();
  tasks.forEach((task) => {
    if (task) { // 注意，这里 task 是一个 async 方法，then 参数也是接受一个方法，所以放入正好。
      result = result.then ? result.then(task).then(fn) : Promise.resolve();
    }
  });
  return result;
}
const asyncFnArr = [
  () => Promise.resolve('0'),
  () => delayFn(1000).then(() => '1'),
  () => delayFn(1000).then(() => '2'),
  () => delayFn(1000).then(() => '3')
]
forEachAsync(asyncFnArr, (data) => {
  console.log(data)
})
```



