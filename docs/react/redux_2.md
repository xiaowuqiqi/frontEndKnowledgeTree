---
title: Redux-异步
group:
  title: redux
  order: 5
order: 2
---

# redux-异步

![image-20240204160713503](./redux_2.assets/image-20240204160713503.png)



## 中间件

为了理解中间件，让我们站在框架作者的角度思考问题：如果要添加功能，你会在哪个环节添加？

只有发送 Action 的这个步骤，即`store.dispatch()`方法，可以添加功能。举例来说，要添加日志功能，把 Action 和 State 打印出来，可以对`store.dispatch`进行如下改造。

```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```

上面代码中，对`store.dispatch`进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形。

**定义**

中间件就是一个函数，对`store.dispatch`方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。

### 用法

**案例**

这是一个简单的案例

`redux-logger`提供一个生成器`createLogger`，可以生成日志中间件`logger`。然后，将它放在`applyMiddleware`方法之中，传入`createStore`方法，就完成了`store.dispatch()`的功能增强。

```js
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```

**注意**

（1）`createStore`方法可以接受整个应用的初始状态作为参数，那样的话，`applyMiddleware`就是第三个参数了。

```js
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(logger) // 变为第三个参数
);
```

（2）中间件的次序有讲究。

```js
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)//次序
);
```

上面代码中，`applyMiddleware`方法的三个参数，就是三个中间件。有的中间件有次序要求，使用前要查一下文档。比如，`logger`就一定要放在最后，否则输出结果会不正确。

### applyMiddlewares()

它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。下面是它的源码。

```js
export default function applyMiddleware(...middlewares) {
    // middlewares 获取的中间件
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
      // 这里 chain 的子元素 已经是一个一个的dispatch函数了，并且他们的参数和返回值类型一样。下面将他嵌套起来。
    dispatch = compose(...chain)(store.dispatch); // compose 嵌套执行 chain 里的函数。compose 类似剥洋葱一层套一层。
    return {...store, dispatch}
  }
}
```

上面代码中，所有中间件被放进了一个数组`chain`，然后嵌套执行，最后执行`store.dispatch`。可以看到，中间件内部（`middlewareAPI`）可以拿到`getState`和`dispatch`这两个方法。

> 对于compose的简介
>
> 类似Array.prototype.reduce累加器，嵌套执行函数
>
> console.log(compose(f,g,h)('a', 'b', 'c')) *//函数f(函数g(函数h(a_b_c)))*
>
> 源码
>
> ```js
> export default function compose(...funcs) {
>   if (funcs.length === 0) {
>     return arg => arg // 
>   }
> 
>   if (funcs.length === 1) {
>     return funcs[0]
>   }
> 	// a上次累加结果。b每次元素。
>   return funcs.reduce((a, b) => (...args) => a(b(...args)))
>     //返回一个嵌套好，没有执行的函数（从右向左层层嵌套）
> }
> ```
>
> 参考：https://blog.csdn.net/astonishqft/article/details/82791622



## 异步请求

理解了中间件以后，就可以处理异步操作了。

同步操作只要发出一种 Action 即可，异步操作的差别是它要发出三种 Action。

+ 操作发起时的 Action

+ 操作成功时的 Action

+ 操作失败时的 Action

以向服务器取出数据为例，三种 Action 可以有两种不同的写法。

 ```javascript
 // 写法一：名称相同，参数不同
 { type: 'FETCH_POSTS' }
 { type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
 { type: 'FETCH_POSTS', status: 'success', response: { ... } }
 
 // 写法二：名称不同
 { type: 'FETCH_POSTS_REQUEST' }
 { type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
 { type: 'FETCH_POSTS_SUCCESS', response: { ... } }
 ```

除了 Action 种类不同，异步操作的 State 也要进行改造，反映不同的操作状态。下面是 State 的一个例子。

```js
let state = {
  // ... 
  isFetching: true, // 是否在抓取数据
  didInvalidate: true, // 数据是否过时
  lastUpdated: 'xxxxxxx'
};
```

上面代码中，State 的属性`isFetching`表示是否在抓取数据。`didInvalidate`表示数据是否过时，`lastUpdated`表示上一次更新时间。

**思路**

- 操作开始时，送出一个 Action，触发 State 更新为"正在操作"状态，View 重新渲染
- 操作结束后，再送出一个 Action，触发 State 更新为"操作结束"状态，View 再一次重新渲染

## redux-thunk 中间件

可以将 `thunk` 看做 store 的 `dispatch()` 方法的封装器；我们可以**使用 `thunk` action creator 派遣函数或 Promise**，而不是返回 action 对象。

**Action Creator**

异步操作至少要送出两个 Action：用户触发第一个 Action，这个跟同步操作一样，没有问题；如何才能在操作结束时，系统自动送出第二个 Action 呢？

奥妙就在 Action Creator 之中。

```js
class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch, selectedPost } = this.props
    dispatch(fetchPosts(selectedPost)) // 这里的 fetchPosts 就是 Action Creator。
  }

// ...
```

**fetchPosts源码**

`fetchPosts`是一个Action Creator（动作生成器），返回一个函数。

```js
// fetchPosts执行后返回一个函数 (dispatch, getState) => {}
const fetchPosts = postTitle => (dispatch, getState) => {
  dispatch(requestPosts(postTitle)); // 发送一个action表示开始发起请求
  return fetch(`/some/API/${postTitle}.json`) // 发起请求
    .then(response => response.json())
    .then(json => dispatch(receivePosts(postTitle, json)));
  };
};
```

先发出一个Action（`requestPosts(postTitle)`），然后进行异步操作。拿到结果后，先将结果转成 JSON 格式，然后再发出一个 Action（ `receivePosts(postTitle, json)`）。

异步操作结束之后，再发出一个 Action（`receivePosts(postTitle, json)`），表示操作结束。

**使用中间件 redux-thunk**

Action 是由`store.dispatch`方法发送的。而`store.dispatch`方法正常情况下，参数只能是对象，不能是函数。

这时，就要使用中间件[`redux-thunk`](https://github.com/gaearon/redux-thunk)。

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);
```

上面代码使用`redux-thunk`中间件，改造`store.dispatch`，使得后者可以接受函数作为参数。

因此，**异步操作的第一种解决方案**就是：写出一个返回函数的 Action Creator，然后使用`redux-thunk`中间件改造`store.dispatch`。

## redux-promise 中间件

既然 Action Creator 可以返回函数，当然也可以返回其他值。另一种异步操作的解决方案，就是让 Action Creator 返回一个 Promise 对象。

这就需要使用`redux-promise`中间件。

> ```javascript
> import { createStore, applyMiddleware } from 'redux';
> import promiseMiddleware from 'redux-promise';
> import reducer from './reducers';
> 
> const store = createStore(
>   reducer,
>   applyMiddleware(promiseMiddleware)
> ); 
> ```

这个中间件使得`store.dispatch`方法可以接受 Promise 对象作为参数。这时，Action Creator 有两种写法。写法一，返回值是一个 Promise 对象。

> ```javascript
> const fetchPosts = 
>   (dispatch, postTitle) => new Promise(function (resolve, reject) {
>      dispatch(requestPosts(postTitle));
>      return fetch(`/some/API/${postTitle}.json`)
>        .then(response => {
>          type: 'FETCH_POSTS',
>          payload: response.json()
>        });
> });
> ```

写法二，Action 对象的`payload`属性是一个 Promise 对象。这需要从[`redux-actions`](https://github.com/acdlite/redux-actions)模块引入`createAction`方法，并且写法也要变成下面这样。

> ```javascript
> import { createAction } from 'redux-actions';
> 
> class AsyncApp extends Component {
>   componentDidMount() {
>     const { dispatch, selectedPost } = this.props
>     // 发出同步 Action
>     dispatch(requestPosts(selectedPost));
>     // 发出异步 Action
>     dispatch(createAction(
>       'FETCH_POSTS', 
>       fetch(`/some/API/${postTitle}.json`)
>         .then(response => response.json())
>     ));
>   }
> ```

上面代码中，第二个`dispatch`方法发出的是异步 Action，只有等到操作结束，这个 Action 才会实际发出。注意，`createAction`的第二个参数必须是一个 Promise 对象。



参考文档：[Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)