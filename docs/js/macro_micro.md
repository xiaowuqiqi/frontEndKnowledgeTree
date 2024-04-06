---
title: 宏任务&微任务
order: 3
group: 
  order: 1
  title: 前端概念与杂项
nav: JS
---

# 宏任务&微任务

异步同步执行序列，如何执行。

一般顺序：同步->微任务->宏任务

> - macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
> - micro-task(微任务)：Promise，process.nextTick

然后，出队一个任务，并执行。

## 任务入队规则

**异步任务队列**分为**宏任务队列**，**微任务队列**。

代码顺序执行，碰到异步代码后放入对应队列内。第一遍代码执行完毕后，会取出**微任务队列**内的代码继续执行，**执行完**后再取出**宏任务队列**内的代码继续执行。以此反复执行直到最后执行完所有任务。

运用递归思想描述

```js
function 代码执行(任务){
	任务执行，异步的代码入队
	代码执行(微任务出队)
	代码执行(宏任务出队)
}
```

> 这里说明一下：由于node环境下的事件监听依赖libuv与浏览器环境不完全相同，不同 node 版本，输出会有差异。下边用 node v18.16.1测试，与浏览器输出相同。

## 实例演示

结合实例：

```js
console.log('1');
setTimeout(function() { // timeout1
    console.log('2');
    new Promise(function(resolve) {
        console.log('4');
        setTimeout(function(){ // timeout2
            console.log('5');
            resolve() // promise1
        })
    }).then(function() {
        console.log('6');
    })
})
new Promise(function(resolve) {
    console.log('8');
    resolve(); // promise2
}).then(function() {
    console.log('9');
})
setTimeout(function() { // timeout3
    console.log('10');
    new Promise(function(resolve) {
        console.log('12');
        resolve(); // promise3
    }).then(function() {
        console.log('13');
    })
    setTimeout(function(){ // timeout4
        console.log('14')
        new Promise(function(resolve){
            console.log('15')
            resolve() // promise4
        }).then(function() {
            console.log('16');
        })
    })
})
```

结果：

第一次执行代码：输出1，timeout1压入宏队列，输出8，promise2压入微队列，timeout3压入宏任务队列。

//在浏览器端，边执行代码，边把异步代码加入对应队列，这一次执行都是同步代码。

//宏任务队列内[timeout1,timeout3]，微任务队列[promise2]

第二次执行代码（promise2出队）：输出9

//微任务队列优先级高，先执行微任务，浏览器端只有一个任务出队并执行。

//宏任务队列内[timeout1,timeout3]，微任务队列[]

第三次执行代码（timeout1出队）：输出2，输出4，timeout2压入宏队。

//宏任务队列内[timeout3,timeout2]，微任务队列[]

第四次执行代码（timeout3出队）：输出10，输出12，promise3压入微队列，timeout4压入宏队列。

//宏任务队列内[timeout2,timeout4]，微任务队列[promise3]

第五次执行代码（promise3出队）：输出13。

//宏任务队列内[timeout2,timeout4]，微任务队列[]

第六次执行代码（timeout2出队）：输出5，promise1压入微队列。

//宏任务队列内[timeout4]，微任务队列[promise1]

第七次执行代码（promise1出队）：输出6。

//宏任务队列内[timeout4]，微任务队列[]

第八次执行代码（timeout4出队）：输出14，输出15，promise4压入微队列。

//宏任务队列内[]，微任务队列[promise4]

第九次执行代码（promise4出队）：输出16。

//宏任务队列内[]，微任务队列[]

**顺序为：1，8，9，2，4，10，12，13，5，6，14，15，16**

> 低版本 node 环境与浏览器环境区别：node环境中，任务全部出队，并执行。浏览器环境，出队一个任务，并执行。
>
> 所以 node 低版本环境，上边代码输出为：1，8，9，2，4，10，12，13，5，14，15，6，16

## 总结

简单结构的代码，一般执行顺序：同步->微任务->宏任务。复杂结构代码，微任务优先级大于宏任务优先级。同步代码边执行，边把异步任务入队，然后系统选择出队的任务再一次新一轮执行。

## 备注1

```js
console.log("11")
new Promise(function(resolve) {
        console.log('12');//这里代码属于同步代码，只有then内代码才是异步代码,同上面“console.log("11")”代码段一起顺序执行。
        resolve();
    }).then(function() {
        console.log('13');
    })
```

## 备注2

在node环境中process.nextTick()比Promise()（即使 promise 里边全是同步代码）优先级高，所以优先执行

```js
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})
process.nextTick(function() {
    console.log('6');
})
//7,6,8
```





