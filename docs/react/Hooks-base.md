---
title: Hooks-基础
nav: React
group:
  title: Hooks相关
  order: 2
order: 1
---

# Hooks-基础

## 简介

*Hooks*是React v16.7.0-alpha中加入的新特性。它可以让你在class以外使用state和其他React特性。

> Hooks解决了我们在React发布至今的五年来遇到的一系列看似不相关的问题。
>

**目的**
使用 Hook 其中一个[目的](https://react.docschina.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。

## 解决的问题

### 跨组件复用stateful logic(包含状态的逻辑)十分困难

React没有提供一种将可复用的行为“附加”到组件上的方式，比如 redux 的 connect 方法，它的出现为了解决逻辑问题，但是这些模式都要求重新构建原有组件，非常麻烦。

原先的组件被深层的抽象层包裹，如providers，consumers，高阶组件，render，props等。这种现象也指出了一些更深层次问题。

**Hooks可以帮助你在不重写组件结构的情况下复用这些逻辑**

### 复杂的组件难以理解

大项目组件混乱，生命周期钩子中容易包含不相干逻辑，造成：强相关的代码被分离，不相关的代码被组合。（如：`componentDidMount` 和 `componentDidUpdate` 中拉取数据同时又有逻辑操作）

**Hooks允许您根据相关部分(例如设置订阅或获取数据)将一个组件分割成更小的函数**

### 不止是用户，机器也对Classes难以理解

作为用户，必须了解`this`如何在JavaScript中工作。必须记住绑定事件处理程序。没有稳定的语法提案，代码非常冗长。

作为机器，class组件可能会导致一些优化白费。classes不能很好的被minify。同时他们也造成了太多不必要的组件更新。

为了解决这些问题，**Hooks让你可以在classes之外使用更多React的新特性。**



**渐进策略**

> **我们完全没有把classes从React中移除的打算。**

## 概览

### useState

计数器案例

```jsx | pure | pure
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

useState，我们在函数组件内部调用它以向其中添加一些局部状态。React将在重新渲染之间保留此状态。

### useEffect

它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

例如，下面这个组件在 React 更新 DOM 后会设置一个页面标题：

**在 useEffect 内传入函数 相当于 componentDidMount 和 componentDidUpdate 钩子，用于更新数据或加载数据。**

```jsx | pure | pure
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**通过返回一个函数来指定如何“清除”。类似于 componentWillUnmount 卸载删除一些资源。**

```jsx | pure | pure
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里。

### Hook 是什么？

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。



### 什么时候我会用 Hook？

如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以在现有的函数组件中使用 Hook。

## State Hook详细

Hook 在 class 内部是**不**起作用的。但可以使用它们来取代 class 。

### **参数/返回值**

上边简单介绍了一个简单案例，下面详细介绍其参数返回值。

```jsx | pure | pure
const [count, setCount] = useState()
```

useState 返回一对当前状态值和一个用于更新它的函数。

useState 唯一的参数就是初始 state，不同于 class 它可以传入非对象的值。

```jsx | pure | pure
 const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

### **读取/更新**

在函数中，我们可以直接用 `count`:

```jsx | pure | pure
  <p>You clicked {count} times</p>
```

在函数中，我们已经有了 `setCount` 和 `count` 变量，所以我们不需要 `this`:

```jsx | pure | pure
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

### **刷新（更新）**

以上面案例为例，当用户点击按钮后，我们传递一个新的值给 `setCount`。React 会重新渲染 `Example` 组件，并把最新的 `count` 传给它。

```jsx | pure | pure
import React, { useState } from 'react';
function Example() {
const [count, setCount] = useState(0);

console.log(1); // 第一次挂载不执行，其他时候，只要点击button 都会执行。
    
return (
<div>
	<p>You clicked {count} times</p>
		<button onClick={() => setCount(count + 1)}>
			Click me
		</button>
	</div>
	);
}
```

也就是说触发 setCount 函数 function Example() 会重新执行，而第二次执行拿到的 count 则是 setCount 获取的参数。

## Effect Hook详细

### 使用

**useEffect 做了什么？** 

通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。

React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。

在这个 effect 中，我们设置了 document 的 title 属性，不过我们也可以执行数据获取或调用其他命令式的 API。

```jsx | pure | pure
function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  console.log('刷新前执行')

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    console.log('挂载后执行，刷新后执行')
  });

  return (
    <div>
      <p>You clicked {count} times </p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**为什么在组件内部调用 useEffect？** 

将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。

我们不需要特殊的 API 来读取它（定义的函数） —— 它已经保存在函数作用域中。（Hook 使用了 JavaScript 的闭包机制。）

**useEffect 会在每次渲染后都执行吗？** 

是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。

不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，**DOM 都已经更新完毕**



### **清除操作**

你可能认为需要单独的 effect 来执行清除操作。但由于添加和删除订阅的代码的紧密性，所以 `useEffect` 的设计是在同一个地方执行。

> 对比 class 内 `componentDidMount` 和 `componentWillUnmount` 之间相互对应。
>
> 例如：当我们添加监听事件后，组件卸载时需要删除监听事件。当然这需要控制useEffect只执行一次。

```jsx | pure | pure
useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() { ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

使用方法就是在 useEffect 第一个参数（该参数是函数）内返回一个函数，函数中就可以编写删除逻辑。

**React 何时清除 effect？** 

effect 在每次渲染的时候都会执行。执行当前 effect 之前对上一个 effect 进行清除。

**运行规则**

初次执行只执行是 Text --> useEffect start

当点击button后，执行是 Text -->useEffect close(上次的函数) --> useEffect start

```jsx | pure
export default function Text() {
  const [cont, setCont] = useState(0);
  console.log('Text')
  useEffect((param) => { // param没有值
    console.log('useEffect start', cont)
    return (param) => { // param没有值
      console.log('useEffect close', cont)
    }
  })
  return (
    <div>
      {console.log('render')}
      <button onClick={()=>setCont(cont+1)}></button>
      <p>11</p>
    </div>
  );
}
```

执行结果是：

第一次执行 //

Text
render
useEffect start 0

点击后 //

Text
render
useEffect close 0// 可以看到卸载函数是在**渲染后执行的，并且数据是上次的数据**。
useEffect start 1

### 按条件执行

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。

> 在 class 组件中，我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决

这就需要传入第二个参数，一个数组。

```jsx | pure
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); 
// 仅在 count 更改时更新
// 当数组中有多个元素，一个元素变动都会认为需要重新渲染。
```

传入 `[count]` 作为第二个参数。这个参数是什么作用呢？如果 `count` 的值是 `5`，而且我们的组件重渲染的时候 `count` 还是等于 `5`，React 将对前一次渲染的 `[5]` 和后一次渲染的 `[5]` 进行比较。因为数组中的所有元素都是相等的(`5 === 5`)，React 会跳过这个 effect，这就实现了性能的优化。

当渲染时，如果 `count` 的值更新成了 `6`，React 将会把前一次渲染时的数组 `[5]` 和这次渲染的数组 `[6]` 中的元素进行对比。这次因为 `5 !== 6`，React 就会再次调用 effect。如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect。

**执行一次**

第二个参数传入空数组

```jsx | pure
  useEffect(() => {
    console.log(1)
    // setCount(count+1)
  },[]);
```

他会在dom挂载完后执行一次

## useRef Hook

useRef

```jsx | pure
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。

```jsx | pure
function A (){
  const h1ref = useRef()

  function test2(){
    alert(h1ref.current.innerHTML)
  }

  return (
    <div>
      <h1 ref={h1ref}>这是数据</h1>
      <button onClick={test2}>显示</button>
    </div>
  )
}
```



useRef不是每次刷新都获取新值，他会缓存一个数据，但是`useRef` 并*不会*通知你。变更 `.current` 属性**不会引发组件重新渲染**。

利于这个特性我们可以缓存上次‘刷新的值

```jsx | pure
export default function Text() {
  const [cont, setCont] = useState(1);
  const hidCont = useRef(cont)
  useEffect(() => {
    hidCont.current = cont
  })
  return (
    <div>
      <button onClick={()=>setCont(cont+1)}></button>
      <p>{cont}</p>
      <p>{hidCont.current}</p>
    </div>
  );
}
```

当然，我们使用 setRefresh 触发一下重新渲染也是可以的。

> 当我们每次点击“记录一个时间”按钮时，触发 setTime 方法，然后 time.current 赋值新值。打印 “setTime”。
>
> setRefresh 会触发，然后刷新组件，打印“A”，但是 time 不会重新赋值默认值。

```jsx | pure
function A() {
  console.log('A')
  const [refresh ,setRefresh] = useState(0)
  const time = useRef(1)
  function getTime(){
    console.log(time.current)
  }
  function setTime(){
    time.current = Date().toString()
    console.log('setTime')
    setRefresh(refresh+1)
    
  }
  return (
    <div>
      <h1>{time.current}</h1>
      <button onClick={setTime}>记录一个时间</button>
      <button onClick={getTime}>显示</button>
    </div>
  )
}
```





## useContext

在深入研究上下文挂钩之前，让我们看一下[Context](https://reactjs.org/docs/context.html) API 的概述以及在[Hooks](https://reactjs.org/docs/hooks-reference.html) API 之前如何实现它。这将使人们对`useContext`钩子有更多的了解，并且可以更深入地了解何时应该使用上下文。

### 简介

React中一个众所周知的陷阱是访问全局状态对象。当数据需要深入嵌套的组件树（主题，UI样式或用户授权）中时，它会通过道具，通过可能需要或可能不需要该数据的多个组件来获取相当繁琐的走私数据。组件变成数据mu子。首选解决方案是诸如Redux或Flux之类的状态管理库。这些库功能强大到令人难以置信，但是在设置，保持组织和了解何时需要实施这些库方面可能会遇到一些挑战。

这是一个上下文关联API的示例，其中的道具被走私到子组件的生活中。

```jsx | pure
// NO CONTEXT YET - just prop smuggling
import React, { Component, useReducer, useContext } from 'react';

const Main = (props) => (
  <div className={'main'}>
    {/* // Main hires a Component Mule (ListContainer) to smuggle data */}
    <List
      isAuthenticated={props.isAuthenticated}
      toggleAuth={props.toggleAuth}
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
        {/* // And List hires a Component Mule (AdminForm) to smuggle data */}
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
          onSubmit={event => this.handleSubmit(event, this.props.toggleAuth)}
          className={'center-content login-form'}
        >
          // ... form logic
        </form>
      </div>
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

### Context API 使用

创建Context API是为了解决此全球数据危机并阻止数据走私，滥用无辜儿童组件的道具-如果您愿意的话，这是全国性的紧急情况。太好了，让我们看看吧。

这是使用Context API重构的相同示例。

```jsx | pure
// CONTEXT API
import React, { Component, createContext } from 'react';
// We used 'null' because the data we need
// resides in App's state.
const AuthContext = createContext(null);
// You can also destructure above
// const { Provider, Consumer } = createContext(null)
const Main = (props) => (
  <div className={'main'}>
    <List />
  </div>
);

const List = (props) => (
  <AuthContext.Consumer>
    auth => {
      auth
        ? (
            <div className={'list'}>
              // ... map over some sensitive data for a beautiful secure list
            </div>
          )
        : (
            <div className={'form-container'}>
               // And List hires a Component Mule to smuggle data
              <AdminForm />
            </div>
          )
    }
  </AuthContext.Consumer>);

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
      <AdminContext.Consumer>
        {state => (
          <div>
            <form
              onSubmit={event => this.handleSubmit(event, state.toggleAuth)}
              className={'center-content login-form'}
            >
              // ... form logic
            </form>
          </div>
        )}
      </AdminContext.Consumer>
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
    this.setState({ isAuthenticated: true });
  }

  render() {
    return (
      <div>
        <AuthContext.Provider value={this.state.isAuthenticated}>
          <Main />
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
```

> 引入钩子后，这种使用Context API的方法仍然有效。

### 考虑context的问题

实现context时，还需要考虑其他一些事项。context API将重新渲染作为提供程序后代的所有组件。如果您不小心，可能会在每次单击或击键时重新渲染整个应用程序。解决方案？你打赌！

在提供程序中包装组件时要慎重。控制台日志从未杀死过猫。

创建一个仅接受子道具的新组件。将提供程序及其必需的数据移到该组件中。这样可以使提供者的子道具在渲染之间保持相等。

```jsx | pure
// Navigate.js
import React, { useReducer, useContext } from 'react';

const AppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PATH': return {
      ...state,
      pathname: action.pathname,
    };
    default: return state;
  }
};


export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    pathname: window.location.pathname,
    navigate: (pathname) => {
      window.history.pushState(null, null, pathname);
      return dispatch({ type: 'UPDATE_PATH', pathname });
    },
  });

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
};

export const LinkItem = ({ activeStyle, ...props }) => {
  const context = useContext(AppContext);
  console.log(context, 'CONTEXT WTF?@');

  return (
    <div>
      <a
        {...props}
        style={{
          ...props.style,
          ...(context.pathname === props.href ? activeStyle : {}),
        }}
        onClick={(e) => {
          e.preventDefault();
          context.navigate(props.href);
        }}
      />
    </div>
  );
};

export const Route = ({ children, href }) => {
  const context = useContext(AppContext);
  return (
    <div>
      {context.pathname === href ? children : null}
    </div>
  );
};
```

如果您在以下模式中使用上述方法，则不会有不必要的重新渲染（所有内部渲染道具`<AppProvider>`）。

```jsx | pure
// App.js
import React, { useContext } from 'react';
import { AppProvider, LinkItem, Route } from './Navigate.js';

export const AppLayout = ({ children }) => (
  <div>
    <LinkItem href="/participants/" activeStyle={{ color: 'red' }}>
      Participants
    </LinkItem>
    <LinkItem href="/races/" activeStyle={{ color: 'red' }}>
      Races
    </LinkItem>
    <main>
      {children}
    </main>
  </div>
);

export const App = () => {
  return (
    <AppProvider>
      <AppLayout>
        <Route href="/races/">
          <h1>Off to the Races</h1>
        </Route>
        <Route href="/participants/">
          <h1>Off with their Heads!</h1>
        </Route>
      </AppLayout>
    </AppProvider>
  );
};
```

将消耗元素包装在高阶组件中。

```jsx | pure
const withAuth = (Component) => (props) => {
  const context = useContext(AppContext)
  return (
    <div>
      {<Component {...props} {...context} />}
    </div>
  );
}

class AdminForm extends Component {
  // ...
}

export withAuth(AdminForm);
```

上下文永远不会完全取代Redux之类的状态管理库。例如，Redux使得调试变得毫不费力，使用中间件授予自定义，保持单一状态并遵循遵循纯函数实践`connect`。上下文非常有能力；它可以保持状态，并且具有惊人的通用性，但是它最适合作为组件*使用*的数据*提供者*。

> 渲染道具是传递数据的绝佳解决方案，但它可以为您的组件树创建有趣的层次结构外观。考虑一下回调地狱，但带有HTML标记。如果数据需要深入一棵组件树内部，请考虑使用上下文。由于数据更改时父组件不会重新渲染，因此这也可以提高性能。

### 实现useContext

该`useContext`钩使得容易消耗上下文数据的实现，它可以帮助使组件可重复使用的。为了弄清楚上下文API可能带来的困难，我们将展示一个消耗多个上下文的组件。预先挂钩，使用多个上下文的组件变得难以重用和理解。这就是为什么应该谨慎使用上下文的原因之一。

这是上面的示例，但还有其他需要使用的上下文。

```jsx | pure
const AuthContext = createContext(null);
const ShakeContext = createContext(null);

class AdminForm extends Component {
  // ...
  render() {
    return (
      // this multiple context consumption is not a good look.
      <ShakeContext.Consumer>
        {shake => (
          <AdminContext.Consumer>
            {state => (
              // ... consume!
            )}
          </AdminContext.Consumer>
        )}
      </ShakeContext.Consumer>
    );
  }
}

class App extends Component {
  //  ...
  <ShakeContext.Provider value={() => this.shake()}>
    <AuthContext.Provider value={this.state}>
      <Main />
    </AuthContext.Provider>
  </ShakeContext.Provider>
}

export default App;
```

现在想象要消耗三个或更多个上下文... [爆炸：结束场景]

在背景海洋中畅游之后，喘口气，陶醉于新知识的便利性中。这是一段漫长的旅程，如果您回顾我们的努力，仍然可以看到它们。但是随着时间的流逝，水域平静下来，进入重力。

上下文也做同样的事情，并引入了JavaScript。输入`useContext`。

消费上下文的新钩子不会更改围绕上下文的概念，因此会出现上述情况。此上下文挂钩仅为我们提供了一种额外的，更漂亮的方式来使用上下文。将其应用于消耗多个上下文的组件时，它非常有用。

在这里，我们有了上述组件的重构版本，使用了多个带有钩子的上下文！

```
const AdminForm = () => {
  const shake = useContext(ShakeContext);
  const auth = useContext(AuthContext);
  // you have access to the data within each context
  // the context still needs be in scope of the consuming component
  return (
    <div className={
      shake ? 'shake' : 'form-container'
    }>
      {
        auth.isAuthenticated
          ? user.name
          : auth.errorMessage
      }
    </div>
  );
};
```

而已！无论上下文是什么，无论是对象，数组还是函数，都可以通过进行访问`useContext`。惊人。接下来，让我们深入研究reducer，讨论其优点，然后实现该`useReducer`挂钩。

## useReducer

为了使决策更容易实现，我们将介绍相关概念，实际用例，然后进行实现。我们将使用从类到功能组件`useState`。接下来，我们将实现`useReducer`。

### 围绕useReducer的概念

如果您至少熟悉以下三个概念中的两个，则可以跳到下一部分。

- [useState](https://reactjs.org/docs/hooks-state.html)
- [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
- [Redux减速器](https://redux.js.org/basics/reducers)

如果您不满意上述任何一项，请仔细阅读以下几点，以更深入地了解一下：

**useReducer和useState：**该`useState`钩子允许您使用一种方法来更新功能组件内的一个状态变量，即更新它`setCount`。`useReducer`使更新状态更加灵活和隐式。就像`Array.prototype.map`并且`Array.prototype.reduce`可以解决类似的问题一样，`Array.prototype.reduce`它的用途更加广泛。

> `useState``useReducer`在引擎盖下使用。

下面的示例将任意演示使用不止一种`useState`方法的不便之处。

```jsx | pure
const App = () => {
  const [ isAdminLoading, setIsAdminLoading] = useState(false);
  const [ isAdmin, setIsAdmin] = useState(false);
  const [ isAdminErr, setIsAdminErr] = useState({ error: false, msg: null });

  // there's a lot more overhead with this approach, more variables to deal with
  const adminStatus = (loading, success, error) => {
    // you must have your individual state on hand
    // it would be easier to pass your intent
    // and have your pre-concluded outcome initialized, typed with intent
    if (error) {
      setIsAdminLoading(false); // could be set with intent in reducer
      setIsAdmin(false);
      setIsAdminErr({
        error: true,
        msg: error.msg,
      });
      throw error;
    } else if (loading && !error && !success) {
      setIsAdminLoading(loading);
    } else if (success && !error && !loading) {
      setIsAdminLoading(false); // .. these intents are convoluted
      setIsAdmin(true);
    }
  };
};
```

**useReducer和Array.prototype.reduce：** `useReducer`行为与十分相似`Array.protoType.reduce`。它们都采用非常相似的参数。回调和初始值。在我们的情况下，我们将其称为`reducer`和`initialState`。它们都接受两个参数并返回一个值。主要区别在于，`useReducer`随着分派的返回增加了更多功能。

**useReducer和Redux Reducer：** Redux是用于应用程序状态管理的更为复杂的工具。Redux减速器通常通过调度，道具，连接的类组件，操作和（可能）服务进行访问，并在Redux存储中进行维护。`useReducer`不过，实施将所有复杂性留在了后面。

> 我相信许多流行的React软件包将会有令人难以置信的更新，这将使我们在没有Redux的情况下进行React开发变得更加有趣。了解这些新做法将有助于轻松过渡到即将到来的最新更新。

### 使用机会

Hooks API简化了组件逻辑，并为`class`关键字提供了替代。可以在您的组件中根据需要进行多次初始化。与上下文类似，最困难的部分是知道何时使用它。

**商机**

您可能想看看在以下情况下的实现`useReducer`：

- 组件需要一个复杂的状态对象
- 组件的道具将用于计算组件状态的下一个值
- 特定的`useState`更新方法取决于另一个`useState`值

`useReducer`在这些情况下应用将减轻视觉和心理上的复杂性，这些模式会变幻，并随着您的应用程序的增长提供连续的呼吸空间。简而言之：您将使散布在整个组件中的状态相关逻辑的数量最小化，并增加了表达*意图*的能力，而不是更新状态时的*结果*。

**好处**

- 没有*必要*的组件和容器分离
- 在我们组件的范围内`dispatch`可以*轻松*访问该功能
- 使用*第三个参数*来操纵初始渲染状态的能力，`initialAction`

现在让我们开始编写代码！

### 实现useReducer

让我们看一下上面第一个上下文示例的一小部分。

```jsx | pure
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
    this.toggleAuth = this.toggleAuth.bind(this);
  }

  toggleAuth(success) {
    success
      ? this.setState({ isAuthenticated: true })
      : 'Potential errorists threat. Alert level: Magenta?';
  }

  render() {
    // ...
  }
}
```

这是上面使用重构的示例`useState`。

```jsx | pure
const App = () => {
  const [isAuthenticated, setAuth] = useState(false);

  const toggleAuth = (success) =>
    success
      ? setAuth(true)
      : 'Potential errorists threat. Alert level: Magenta?';

  return (
    // ...
  );
};
```

看起来如此漂亮和熟悉，真是令人惊讶。现在，随着我们向该应用程序添加更多逻辑，`useReducer`它将变得很有用。让我们从开始其他逻辑`useState`。

```jsx | pure
const App = () => {
  const [isAuthenticated, setAuth] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [categories, setCategories] = useState(['Participants', 'Races']);
  const [categoryView, setCategoryView] = useState(null);

  const toggleAuth = () => setAuth(true);

  const toggleShakeForm = () =>
    setTimeout(() =>
      setShakeForm(false), 500);

  const handleShakeForm = () =>
    setShakeForm(shakeState =>
      !shakeFormState
        ? toggleShakeForm()
        : null);

  return (
    // ...
  );
};
```

这要复杂得多。这看起来像`useReducer`什么？

```jsx | pure
// Here's our reducer and initialState
// outside of the App component
const reducer = (state, action) => {
  switch (action.type) {
    case 'IS_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
      };
    // ... you can image the other cases
    default: return state;
  }
};

const initialState = {
  isAuthenticated: false,
  shake: false,
  categories: ['Participants', 'Races'],
};
```

我们将在App组件的顶级使用这些变量`useReducer`。

```jsx | pure
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleAuth = (success) =>
    success
      ? dispatch({ type: 'IS_AUTHENTICATED' }) // BAM!
      : alert('Potential errorists threat. Alert level: Magenta?');

  return (
    // ...
  );
};
```

该代码很好地表达了我们的意图。一切都很好，但是我们需要将此逻辑纳入上下文，以便可以在树上使用它。让我们看看我们的身份验证提供程序，看看如何提供逻辑。

```jsx | pure
const App = () => {
  // ...
  <AdminContext.Provider value={{
    isAuthenticated: state.isAuthenticated,
    toggle: toggleAuth,
  }}>
    <Main />
  </AdminContext.Provider>
  // ...
};
```

有很多方法可以做到这一点，但是我们的想法是我们有一个状态和一个函数，该函数将一个操作分派给提供程序。除了区别在于逻辑的位置和组织以外，这与前面的步骤非常相似。大吼...对吗？

如果您传递`value={{ state, dispatch }}`给提供商的价值支持该怎么办？如果我们将提供程序提取到包装函数中怎么办？您可以摆脱逻辑上与其他组件紧密耦合的组件。此外，传递您的意图（行动）比您打算如何进行（逻辑）要好得多。

## useMemo

useMemo 用于缓存一段代码执行后的结果，只有第一次和需要监听的数据变动时才执行该代码。并且返回代码段内执行结果。

```jsx | pure
    const _chip = useMemo(() => {
        // 第一次和clickKey变动才执行下面操作
        console.log(clickKey)
        chipArr.current = [...chipArr.current, {
            startPositive,
            chipMoney,
            chipOpen
        }]
        return chipArr.current
    }, [clickKey])
    console.log(_chip)
```

他与useEffect不同点在于，他是在dom挂载前执行。而useEffect是在dom挂载后执行。

useMemo可以返回代码段执行结果，下面代码可以获取该结果并使用。类似同步代码。

**注意**

useMemo缓存的代码段，会把 useState 数据固定住，使用 useState数据时总是拿到其初始值，要想其发挥作用，要把该值放入 [] (监听数组中)

```jsx | pure
const [text,setText] = useState(0)
const getText(){
	console.log(text)
}
useMemo(()=>{
 	getText()
},[text]) // 注意text需要登记在数组中。
//否则 getText 总是使用 0 这个初始值，拿不到 setText 后的值
```



## Hook 规则

### 只在最顶层使用 Hook

**不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。(如果你对此感到好奇，我们在[下面](https://react.docschina.org/docs/hooks-rules.html#explanation)会有更深入的解释。)

> 这个是不对的，因为 setDNAMatch 写在 if 内。可能会出现顺序错误。

```jsx | pure
const [DNAMatch, setDNAMatch] = useState(false)

if (name) {
  setDNAMatch(true)
  const [name, setName] = useState(name)

  useEffect(function persistFamily() {
    localStorage.setItem('dad', name);
  }, []);
}
```

> 正确做法

```jsx | pure
const [DNAMatch, setDNAMatch] = useState(false)
const [name, setName] = useState(null)

useEffect(() => {
  if (name) {
    setDNAMatch(true)
    setName(name)
    localStorage.setItem('dad', name);
  }
}, []);
```

### 只在 React 函数中调用 Hook

**不要在普通的 JavaScript 函数中调用 Hook**

### ESLint 插件

使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 的 ESLint 插件，来强制执行这两条规则。

```jsx | pure
npm install eslint-plugin-react-hooks --save-dev
// 你的 ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```

## Hooks自定义

需要在组件之间共享逻辑时，最好使用自定义钩子。

在JavaScript中，当您要在两个单独的函数之间共享逻辑时，可以创建另一个函数来支持该逻辑。就像组件一样，钩子也是函数。您可以提取挂钩逻辑，以在整个应用程序的各个组件之间共享。在编写自定义钩子时，您要为其命名（再次以单词开头`use`），设置参数并告诉它们应返回什么（如果有的话）。

### 请求数据Hooks [ 案例 ]

```jsx | pure
import { useEffect, useState } from 'react';

const useFetch = ({ url, defaultData = null }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const fetchResults = {
    data,
    loading,
    error,
  };

  return fetchResults;
};

export default useFetch;
```

### 刷新组件

```jsx | pure
// 1
const forceUpdate = () => useState(0)[1];
// 或者 
// 2
import React, {useState} from 'react';
export default function useForceUpdate() {
    const [t,_up] = useState(0);
    return ()=>_up(t>5?0:t+1)
}
```

或者

```jsx | pure
/**
 * @email WY <yang.wang06@hand-china.com>
 * @creationDate 2020/2/18
 * @copyright HAND ® 2019
 */
import { useState, useCallback, useMemo } from 'react';

/**
 * 自己内部维护一个 int 值 State, 每次调用返回方法会自增1
 * 会维护一个 useMemo(存储类全局变量), useState(存储改变的值), useCallback(存储方法)
 * @return {function(): void} - 返回一个不会变的方法
 */
const useForceUpdate = () => {
  const globalState = useMemo(() => ({ forceUpdateCount: 0 }), []);
  const [, setForceUpdateCount] = useState(0);
  return useCallback(() => {
    globalState.forceUpdateCount += 1;
    setForceUpdateCount(globalState.forceUpdateCount);
  }, []);
};

export { useForceUpdate };
```

**使用**

```jsx | pure
const forceUpdate = useForceUpdate();
  useEffect(() => {
      forceUpdate(); // 刷新
  }, []);
```

## 技巧

参考https://www.v2ex.com/t/570176

### 清空window烦扰

window.console.warn = () => {};

### 构建小的子组件

```jsx | pure
class AddChildButton extends React.Component {
  render() {
    const { dataSet, ...otherProps } = this.props;
    const { current } = dataSet;
    // {...otherProps} 可以拿到chilren（添加子节点），直接放入即可
    return <Button {...otherProps} disabled={!current || !current.get('id')} />;
  }
}

export default () => {
……
  const buttons = [
    <AddChildButton 
        key="add-child" 
        dataSet={leftSecondPartsDS} 
        onClick={handleCreateChild}
    >
      添加子节点
    </AddChildButton>,
  ];
}
```

