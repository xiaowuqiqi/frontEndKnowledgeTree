---
title: Redux-项目使用
group:
  title: redux
  order: 5
order: 3
---

# Redux-项目使用

![image-20240204160713503](./redux_2.assets/image-20240204160713503.png)

## 组件

React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）。

### UI 组件

UI 组件有以下几个特征。

> - 只负责 UI 的呈现，不带有任何业务逻辑
> - 没有状态（即不使用`this.state`这个变量）
> - 所有数据都由参数（`this.props`）提供
> - 不使用任何 Redux 的 API

下面就是一个 UI 组件的例子。

```jsx | pure
const Title =
  value => <h1>{value}</h1>;
```

因为不含有状态，UI 组件又称为"纯组件"，即它纯函数一样，纯粹由参数决定它的值。

### 容器组件

容器组件的特征恰恰相反。

> - 负责管理数据和业务逻辑，不负责 UI 的呈现
> - 带有内部状态
> - 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。

你可能会问，如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：外面是一个容器组件，里面包了一个UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。

React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

## connect()

React-Redux 提供`connect`方法，用于从 UI 组件生成容器组件。

`connect`的意思，就是将这两种组件连起来。

```js
import { connect } from 'react-redux'
const VisibleTodoList = connect()(TodoList);
```

**connect接收参数**

`connect`方法接受两个参数：`mapStateToProps`和`mapDispatchToProps`。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将`state`映射到 UI 组件的参数（`props`），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。

```js

import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps, // 输入逻辑
  mapDispatchToProps // 输出逻辑
)(TodoList)
```

### mapStateToProps()

作为函数，`mapStateToProps`执行后应该**返回一个对象**，里面的每一个键值对就是一个映射。请看下面的例子。

```js
const mapStateToProps = (state) => {
  return {
    return {example: state.example}
  }
}
```

`mapStateToProps`的第一个参数总是`state`对象，还可以使用第二个参数，代表容器组件的`props`对象。

```js
// 容器组件的代码
//    <FilterLink filter="SHOW_ALL">
//      All
//    </FilterLink>

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
```

使用`ownProps`作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。

`connect`方法可以省略`mapStateToProps`参数，也就是不放入该参数，Store 的更新不会引起 UI 组件的更新。

### mapDispatchToProps()

`mapDispatchToProps`是`connect`函数的第二个参数，用来建立 UI 组件的参数到`store.dispatch`方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

```js
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}
```

定义了 UI 组件的参数怎样发出 Action。

如果`mapDispatchToProps`是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出。举例来说，上面的`mapDispatchToProps`写成对象就是下面这样。

```js
const mapDispatchToProps = {
  onClick: (filter) => {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
}
```

## Provider 组件

`connect`方法生成容器组件以后，需要让容器组件拿到`state`对象，才能生成 UI 组件的参数。

一种解决方法是将`state`对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将`state`传下去就很麻烦。

React-Redux 提供`Provider`组件，可以让容器组件拿到`state`。

```jsx | pure
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

上面代码中，`Provider`在根组件外面包了一层，这样一来，`App`的所有子组件就默认都可以拿到`state`了。

## 计数器案例

我们来看一个实例。下面是一个计数器组件，它是一个纯的 UI 组件。

> ```javascript
> class Counter extends Component {
>   render() {
>     const { value, onIncreaseClick } = this.props
>     return (
>       <div>
>         <span>{value}</span>
>         <button onClick={onIncreaseClick}>Increase</button>
>       </div>
>     )
>   }
> }
> ```

上面代码中，这个 UI 组件有两个参数：`value`和`onIncreaseClick`。前者需要从`state`计算得到，后者需要向外发出 Action。

接着，定义`value`到`state`的映射，以及`onIncreaseClick`到`dispatch`的映射。

> ```javascript
> function mapStateToProps(state) {
>   return {
>     value: state.count
>   }
> }
> 
> function mapDispatchToProps(dispatch) {
>   return {
>     onIncreaseClick: () => dispatch(increaseAction)
>   }
> }
> 
> // Action Creator
> const increaseAction = { type: 'increase' }
> ```

然后，使用`connect`方法生成容器组件。

> ```javascript
> const App = connect(
>   mapStateToProps,
>   mapDispatchToProps
> )(Counter)
> ```

然后，定义这个组件的 Reducer。

> ```javascript
> // Reducer
> function counter(state = { count: 0 }, action) {
>   const count = state.count
>   switch (action.type) {
>     case 'increase':
>       return { count: count + 1 }
>     default:
>       return state
>   }
> }
> ```

最后，生成`store`对象，并使用`Provider`在根组件外面包一层。

> ```jsx | pure
> import { loadState, saveState } from './localStorage';
> 
> const persistedState = loadState();
> const store = createStore(
>   todoApp,
>   persistedState
> );
> 
> store.subscribe(throttle(() => {
>   saveState({
>     todos: store.getState().todos,
>   })
> }, 1000))
> 
> ReactDOM.render(
>   <Provider store={store}>
>     <App />
>   </Provider>,
>   document.getElementById('root')
> );
> ```

完整的代码看[这里](https://github.com/jackielii/simplest-redux-example/blob/master/index.js)。

## React-Router 路由库

使用`React-Router`的项目，与其他项目没有不同之处，也是使用`Provider`在`Router`外面包一层，毕竟`Provider`的唯一功能就是传入`store`对象。

```jsx | pure
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);
```

## dva使用案例

+ 使用 dva-logger 发送 dispatch 时可以打印状态树

  ```bash
  cnpm install dva-logger --save-dev
  ```

  ```js
  import createLogger from 'dva-logger';
  // 2. Plugins
  app.use(createLogger({}));
  ```

+ 当然也可以 dvaApp._store.getState() 手动打印状态树

### routes/IndexPage

```jsx | pure
import React, {Component, createContext} from 'react';
import {connect} from 'dva';

@connect(({example}) => ({example})) // 注入 Models 内数据。
class App extends Component {
  constructor(props) {
    super(props);
  }

  query = () => {
    const {dispatch} = this.props
    dispatch({
      type: 'example/fetch',
      payload: 'this.form.data'
    })
  }

  render() {
    const {exampleData = []} = this.props.example
    return (
      <div>
        <button onClick={this.query}></button>
        <ul>
          {exampleData.length > 0 ? exampleData.map(item => {
            return (
              <li> {`id:${item.id} - name:${item.name}`} </li>
            )
          }) : (
            <li> 数据为空 </li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;

```

### models

```jsx | pure
import {query} from '../services/example'

export default {

  namespace: 'example',

  state: {
    exampleData: []
  },

  effects: {
    * fetch({payload}, {call, put}) {  // eslint-disable-line
      const src = yield call(query, payload)
      yield put({
        type: 'save',
        payload: {
          exampleData: src.data.content
        }
      });
    },
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

};

```

### sercices

```js
import request from '../utils/request';

export function query() {
  return request('/api/queryProducts');
}

```

### mock使用

dva中使用mock

安装 mock

```bash
cnpm install mockjs --save
```

打开.roadhogrc.mock.js 设置如下

> 用于循环读取文件名。然后使用 require 引入文件。

```js
const fs=require('fs');
const path=require('path');
const mockPath=path.join(__dirname+'/mock');

const mock={};
fs.readdirSync(mockPath).forEach(file=>{
  Object.assign(mock,require('./mock/'+file));
});

module.exports=mock;

```

mock文件夹下创建mock文件即可

```js
const Mock = require('mockjs');

let db = Mock.mock({
  content: [
    { name: 'dva', id: 1 },
    { name: 'antd', id: 2 },
  ],
});

module.exports = {
  [`GET /api/queryProducts`](req, res) {
    res.status(200).json(db);
  },
}

```

请求 /api/queryProducts 即可。



参考文档：[Redux 入门教程（三）：React-Redux 的用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)