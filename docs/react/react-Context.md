---
title: React-Context
group:
  title: 基本使用
  order: 1
order: 3
---

# React-Context

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。



## 题记

对于 react 当数据需要深入嵌套的组件树时，它会通过每层属性，层层传递，频繁的走私数据。首选解决方案是诸如Redux或Flux之类的状态管理库。这些库功能强大到令人难以置信，但是在设置，保持组织和了解何时需要实施这些库方面可能会遇到一些挑战。

### 历史遗留案例

一个不使用任何方式，进行数据传递的模块

```jsx | pure
import React, { Component, useReducer, useContext } from 'react';

const Main = (props) => (
  <div className={'main'}>
    {/* Main 需要添加属性传递数据 */}
    <List
      isAuthenticated={props.isAuthenticated} // 控制数据是否往深层走。
      toggleAuth={props.toggleAuth} // 走私的数据
    />
  </div>
);

const List = ({ isAuthenticated, toggleAuth, shake }) => (
  isAuthenticated
    ? (
      <div className={'title'} >
        "secure" list, check.
      </div >)
    : (
      <div className={'list-login-container'}>
        {/* 走私数据经过List组件，但是他毫无用处 */}
        <AdminForm shake={shake} toggleAuth={toggleAuth} />
      </div>)
);

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, toggleAuth) {
    event.preventDefault();
    return toggleAuth(true);
  }

  render() {
    return (
      <div className={'form-container'}>
        <form
            // 拿到“爷爷”级的数据（this.props.toggleAuth）
          onSubmit={event => this.handleSubmit(event, this.props.toggleAuth)}
          className={'center-content login-form'}
        >
          // ... form logic
        </form>
      </div>
    );
  }
}
//// 开始
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    this.toggleAuth = this.toggleAuth.bind(this);
  }

  toggleAuth(isAuthenticated) {
    return isAuthenticated
      ? this.setState({ isAuthenticated: true })
      : alert('Bad Credentials!');
  }

  render() {
    return (
      <div className={'App'}>
        <Main
          isAuthenticated={this.state.isAuthenticated}
          toggleAuth={this.toggleAuth}
        >
        </Main>
      </div>
    );
  }
}

export default App;
```

### 使用 Context API

Context API是为了解决全局的数据流向下流动过于深层时，出现属性冗余、数据不安全、使用不方便等问题而设立的。

这是使用Context API重构的相同示例。

```jsx | pure
// CONTEXT API
import React, {Component, createContext} from 'react';
// 初始数据位null
// resides in App's state.
const AuthContext = createContext(null);
// 也可以进行解构
// const { Provider, Consumer } = createContext(null)
const Main = (props) => (
  <div className={'main'}>
    <List/>
  </div>
);

const List = (props) => {
  return (
    <AuthContext.Consumer>
      {auth =>
        auth
          ? (
            <div className={'list'}>
              // ... map over some sensitive data for a beautiful secure list
            </div>
          )
          : (
            <div className={'form-container'}>
              // And List hires a Component Mule to smuggle data
              <AdminForm/>
            </div>
          )
      }
    </AuthContext.Consumer>
  )
}

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, toggleAuth) {
    event.preventDefault();
    return toggleAuth(true);
  }

  render() {
    return (
      <AuthContext.Consumer>
        {state => (
          <div>
            <form
              onSubmit={event => this.handleSubmit(event, state.toggleAuth)}
              className={'center-content login-form'}
            >
              <input type={'text'}/>
            </form>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    this.toggleAuth = this.toggleAuth.bind(this);
  }

  toggleAuth(isAuthenticated) {
    this.setState({isAuthenticated: true});
  }

  render() {
    return (
      <div>
        <AuthContext.Provider value={this.state.isAuthenticated}>
          <Main/>
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
```

## 简化·基础流程

### 创建

创建Context对象，并指定其默认值

```js
const MyContext = React.createContext(defaultValue)
```

### Provider 

给 Context 对象的 Provider 组件标签指定要传递的 value 值，并包裹子标签。

```jsx | pure
<Mycontext.Provider value={/*某个值*/}>
    子组件
</Mycontext.Provider>
```

### Consumer

在任意后代组件中读取 Context 对象中的 Value 值

方法1：

 ```jsx | pure
  <Context.Consumer>
  {value => /* 基于 context 值进行渲染 */}
  </Context.Consumer>
 ```

 方法2：


 ```js
static contextType = Mycontext;
let value = this.context
 ```

  

## 案例

### 父级组件

```jsx | pure
const MyContext = React.createContext(0)

class A extends React.Component {
  state = {
    count: 1
  }
  test1 = () => {
    this.setState(state => ({
      count: state.count + 1
    }))
  }

  render() {
    console.log('A render()')
    return (
      <div>
        <h1>a组件：{this.state.count}</h1>
        <button onClick={this.test1}>A 测试1</button>
        <hr/>
        <MyContext.Provider value={this.state.count}>
          {/* 数据变化， context.Provider 的 value 值会实时变化 */}
          <B></B>
        </MyContext.Provider>
      </div>
    )
  }
}
```

### 子集组件

```jsx | pure


function B() {
  return (
    <div>
      <h1>b组件</h1>
      <C></C>
      <D />
    </div>
  )
}

function C() {
  return (
    <MyContext.Consumer>
      {count => <h1>C组件：{count}</h1>}
    </MyContext.Consumer>
  )
}

class D extends React.Component {
  static contextType = MyContext;
  render(){
    return <h1>D组件：count={this.context}</h1>
  }
}
export default connect()(A);

```

