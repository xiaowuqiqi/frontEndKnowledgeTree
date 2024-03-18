---
title: React-Router
nav: React
group:
  title: 基本使用
  order: 1
order: 8
---

# React-Router

![image-20240207175118391](./react-router.assets/image-20240207175118391.png)

React Router 实现了“客户端路由”。

在传统的网站中，浏览器从 Web 服务器请求文档，下载并评估 CSS 和 JavaScript 资源，然后呈现服务器发送的 HTML。当用户点击链接时，它会为新页面重新开始这个过程。

客户端路由允许您的应用程序在用户点击链接时更新 URL，而无需再次从服务器请求另一个文档。相反，您的应用程序可以立即呈现一些新的 UI，并使用 fetch 进行数据请求，以更新页面上的新信息。

这样可以实现更快的用户体验，因为浏览器无需请求完全新的文档或重新评估下一页的 CSS 和 JavaScript 资源。它还可以实现更动态的用户体验，比如动画效果。

## 安装

安装 react-router-dom (单纯开发，仅安装 router-dom 即可)

```bash
npm i react-router-dom
```

安装 react-router

```bash
npm i react-router
```

## v5升级v6

参考：https://reactrouter.com/en/main/upgrading/v5

### 数据路由

#### 使用v6.4版数据API

在6.4版本中，引入了新的路由器，**支持**新的**数据API**:

- [`createBrowserRouter`](https://books.sangniao.com/manual/2512864574/1148968338)
- [`createMemoryRouter`](https://books.sangniao.com/manual/2512864574/24821632)
- [`createHashRouter`](https://books.sangniao.com/manual/2512864574/3887735606)

下列路由器**不支持数据API**:

- [`BrowserRouter组件`](https://books.sangniao.com/manual/2512864574/2102861146)
- [`MemoryRouter组件`](https://books.sangniao.com/manual/2512864574/1507385601)
- [`HashRouter组件`](https://books.sangniao.com/manual/2512864574/1274640981)
- [`NativeRouter组件`](https://books.sangniao.com/manual/2512864574/484016566)
- [`StaticRouter组件`](https://books.sangniao.com/manual/2512864574/274077574)

我们建议更新你的应用程序，以使用6.4版中的一个新的路由器。数据API目前在React Native中不被支持，但最终应该被支持。

快速更新到6.4版本的最简单方法是获得[`createRoutesFromElements`](https://books.sangniao.com/manual/2512864574/1534300038)的帮助，这样你就不需要把你的`<Route>`元素转换成路由对象。

```jsx | pure
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="dashboard" element={<Dashboard />} />
      {/* ... etc. */}
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

#### **数据API**

React Router 6.4 中引入了以下 API，并且仅在使用数据路由器时才有效：

- [`route.action`](https://reactrouter.com/en/main/route/action)
- [`route.errorElement`](https://reactrouter.com/en/main/route/error-element)
- [`route.lazy`](https://reactrouter.com/en/main/route/lazy)
- [`route.loader`](https://reactrouter.com/en/main/route/loader)
- [`route.shouldRevalidate`](https://reactrouter.com/en/main/route/should-revalidate)
- [`route.handle`](https://reactrouter.com/en/main/route/route#handle)
- [`Await组件`](https://reactrouter.com/en/main/components/await)
- [`Form组件`](https://reactrouter.com/en/main/components/form)
- [`ScrollRestoration组件`](https://reactrouter.com/en/main/components/scroll-restoration)
- [`useActionData`](https://reactrouter.com/en/main/hooks/use-action-data)
- [`useAsyncError`](https://reactrouter.com/en/main/hooks/use-async-error)
- [`useAsyncValue`](https://reactrouter.com/en/main/hooks/use-async-value)
- [`useFetcher`](https://reactrouter.com/en/main/hooks/use-fetcher)
- [`useFetchers`](https://reactrouter.com/en/main/hooks/use-fetchers)
- [`useLoaderData`](https://reactrouter.com/en/main/hooks/use-loader-data)
- [`useMatches`](https://reactrouter.com/en/main/hooks/use-matches)
- [`useNavigation`](https://reactrouter.com/en/main/hooks/use-navigation)
- [`useRevalidator`](https://reactrouter.com/en/main/hooks/use-revalidator)
- [`useRouteError`](https://reactrouter.com/en/main/hooks/use-route-error)
- [`useRouteLoaderData`](https://reactrouter.com/en/main/hooks/use-route-loader-data)
- [`useSubmit`](https://reactrouter.com/en/main/hooks/use-submit)
- `startViewTransition`支持[Link](https://reactrouter.com/en/main/components/link#unstable_viewtransition)和[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate#optionsunstable_viewtransition)

### Switch to Routes

将所有 `<Switch>` 元素升级为 `<Routes>` React Router v6 引入了一个 Routes 组件，类似于 Switch，但功能更强大。Routes 相对于 Switch 的主要优势是：

- 所有 `<Route>` 和 `<Link>` 元素都是相对于 `<Routes>` 内部的。这导致在 `<Route path>` 和 `<Link to>` 中的代码更精简和可预测。
- 根据最佳匹配选择路由，而不是按顺序遍历路由。这避免了由于定义在 `<Switch>` 中的路由较晚而导致的不可达路由引发的错误。
- 路由可以在一个地方进行嵌套，而不是分散在不同的组件中。在小到中型的应用程序中，这使您可以轻松地一次性查看所有路由。在大型应用程序中，您仍然可以通过 React.lazy 动态加载的捆绑包中嵌套路由。

为了使用 v6，您需要将所有的 `<Switch>` 元素转换为 `<Routes>`。

**案例**

```jsx | pure
// This is a React Router v5 app
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function Users() {
  // 在v5中，嵌套路由由子组件呈现，所以
  // 你在整个应用中都有<Switch>元素用于嵌套UI。
  // 使用match构建嵌套的路由和链接。Url和match.path。
  let match = useRouteMatch();

  return (
    <div>
      <nav>
        <Link to={`${match.url}/me`}>My Profile</Link>
      </nav>
          
      <Switch>
        <Route path={`${match.path}/me`}>
          <OwnUserProfile />
        </Route>
        <Route path={`${match.path}/:id`}>
          <UserProfile />
        </Route>
      </Switch>
    </div>
  );
}
```

这是一个React Router v6应用：

```jsx | pure
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users/*" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

function Users() {
  return (
    <div>
      <nav>
        <Link to="me">My Profile</Link>
      </nav>
          
      <Routes>
        <Route path=":id" element={<UserProfile />} />
        <Route path="me" element={<OwnUserProfile />} />
      </Routes>
    </div>
  );
}
```

> 注意：path 属性中，**添加 ‘/*’** 。表示其子组件（children）中可以继续使用 Route 组件，如果没有  ‘/*’ ，其子组件中无法使用 Route 组件。

结合上边例子，关于 v6 的一些重要事项：

- `<Route path>` 和 `<Link to>` 是**相对的**。这意味着它们会自动构建在父路由的路径和 URL 的基础上，因此您无需手动插入 match.url 或 match.path。
- 您可以根据需要以任何顺序放置您的路由，路由器将**自动检测**到**最适合当前 URL 的路由**。这可以防止由于手动将路由**错误地放置**在 `<Switch>` 中的**错误顺序**而**导致的 bug**。

### strict & exact 

#### **exact v5 中作用**

当为 `true` 时，仅当路径与`location.pathname` 完全匹配时才匹配。

|  path  | location.pathname |  exact  | 匹配? |
| :----: | :---------------: | :-----: | :---: |
| `/one` |    `/one/two`     | `true`  |  no   |
| `/one` |    `/one/two`     | `false` |  yes  |

#### **exact v6**

在 **v6** 中，`<Route exact>` **已经移除**。相反，具有后代路由（在其他组件中定义的）的路由在其路径中使用**尾部 *** 来表示它们**深度匹配**。

```jsx | pure
<Route path="/" element={<Home />} /> 
// 没有 /* 相当于设置了 exact
<Route path="users/*" element={<Users />} />
// 有 /* 可以继续深度匹配
```

#### **strict v5 中作用**

当设置为 true 时，具有**尾部斜杠**的**路径**只会与**具有尾部斜杠**的 **location.pathname** 匹配。当 location.pathname 中存在其他 URL 段时，这不会产生任何影响。

|  path   | location.pathname | matches? |
| :-----: | :---------------: | :------: |
| `/one/` |      `/one`       |    no    |
| `/one/` |      `/one/`      |   yes    |
| `/one/` |    `/one/two`     |   yes    |

**如果两个都设置：**

```jsx | pure
<Route exact strict path="/one">
  <About />
</Route>
```

|  path  | location.pathname | matches? |
| :----: | :---------------: | :------: |
| `/one` |      `/one`       |   yes    |
| `/one` |      `/one/`      |    no    |
| `/one` |    `/one/two`     |    no    |

#### strict v6

在 **v6** 中，所有路径匹配都会**忽略 URL** 上的**尾部斜杠**。实际上，`<Route strict>` 已**被移除**，在 **v6 中不起作用**。

> 这并不意味着，如果需要的话就不能使用尾部斜杠。您的应用程序可以决定使用尾部斜杠或不使用，只是无法在客户端渲染两个不同的 UI，一个在 `<Route path="edit">` 而另一个在 `<Route path="edit/">`。
>
> 您仍然可以在这些 URL 上渲染两个不同的 UI（尽管我们不建议这样做），但您必须在服务器端进行处理。

### component & render & children

#### **component**

##### **v5 中：**

使用 `component` 属性时，`<Route>` 将使用 `React.createElement` 从给定的组件创建一个新的 React 元素。

如果您将内联函数提供给 `component` 属性，则会在**每次渲染时创建一个新的组件**。这将**导致现有组件卸载并重新挂载，而不是仅更新现有组件。**

因此，**不推荐**在 `component` 属性中使用**内联函数**进行渲染，而应使用 `render` 或 `children` 属性。

> 要从**v4/5升级**到**v5.1**，你应该:
>
> - 使用`<Route children>`而不是`<Route render>`和/或`<Route component>` prop。
> - 使用[我们的hook API](https://www.sangniao.com/link/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Imh0dHBzOlwvXC9yZWFjdHRyYWluaW5nLmNvbVwvcmVhY3Qtcm91dGVyXC93ZWJcL2FwaVwvSG9va3Mi.xz8-yApSPXtlBk406dYz_Y-Kyevkj26aeI4XR428tPI)来访问路由器的状态，如当前位置和参数
> - 用**hook**取代所有**`withRouter`的使用**
> - 用**`useRouteMatch`替换**任何不在`Switch`内的`Route`，或将其包裹在`Switch`内。

##### **v6 中：**

由于react 推出了 **`<Suspense fallback={<Spinner />}> ` API**，`fallback` prop需要一个React元素，而不是一个组件。这样我们就可以轻松的传入props了，而不是这样 `<Route component={Profile} passProps={{ animate: true }} />`或者高级组件。

所以**不推荐使用 component 属性**了，在 v5.1 中推荐使用 children，在 v6 中则由 element 取代。

#### render

##### **v5 中：**

**render:** 使用 `render` 属性时，您可以**传递一个函数**，在**匹配到路径时**会调用该函数进行**渲染**。这个函数将接收到与组件渲染属性相同的所有路由属性（`match`、`location` 和 `history`）。

`render` 属性的**优点**是能够方便地进行**内联渲染和包装**，**避免**了由于使用 `component` 属性而导致的**组件卸载**和**重新挂载**问题。

> 要从**v4/5升级**到**v5.1**，你应该: 使用`<Route children>`而不是`<Route render>`和/或`<Route component>` prop。

#### children

##### **v5 中：**

**children:** 使用 `children` 属性时，您可以**传递一个函数**，**不管**路径**是否匹配**，该函数**都会被调用进行渲染**。

`children` 属性的函数接收到与 `component` 和 `render` 属性相同的所有路由属性，但是当路由无法匹配 URL 时，`match` 将为 `null`。这使您可以根据路由是否匹配来动态调整 UI。

`children` 属性特别**适合**在需要渲染**无论路径是否匹配**时**使用**，例如：为列表项添加活动状态类或执行动画效果。

不过，要注意 `<Route children>` 优先级高于 `<Route component>` 和 `<Route render>`，因此不要在同一个 `<Route>` 中同时使用多个。

使用：

```jsx | pure
import {
  BrowserRouter as Router,
  Link,
  Route
} from "react-router-dom";
function ListItemLink({ to, ...rest }) {
  return (
    <Route
      path={to}
      children={({ match }) => (
        <li className={match ? "active" : ""}>
          <Link to={to} {...rest} />
        </li>
      )}
    />
  );
}

ReactDOM.render(
  <Router>
    <ul>
      <ListItemLink to="/somewhere" />
      <ListItemLink to="/somewhere-else" />
    </ul>
  </Router>,
  node
);
```

##### **v6 中：**

v5 应用中的所有`<Route children>` 在v6中改为了**`<Route element>`。**

> 在v6中使用 `<Route element>` 的另一个重要原因是 `<Route children>` 是为**嵌套路由**保留的.

假设你遵循升级到v5.1的步骤，这应该很简单，就是把你的路由元素从子项位置移到一个命名为 `element` 的 prop。

所以更新了 **element 属性**：

```jsx | pure
// 啊，漂亮而简单的API。而且，它就像<Suspense>的API一样!
// 这里没有更多的东西可以学习。
<Route path=":userId" element={<Profile />} />

// 但是，等等，我如何将自定义prop传递给<Profile>？
// 元素？哦，是的，它只是一个元素。简单。
<Route path=":userId" element={<Profile animate={true} />} />

// 好的，但我如何访问路由器的数据，如URL参数
// 还是目前的位置？
function Profile({ animate }) {
  let params = useParams();
  let location = useLocation();
}

// 但在tree的深处的组件呢？
function DeepComponent() {
  // 哦，对，和其他地方一样
  let navigate = useNavigate();
}
```

> 注意: element 中的数据是以元素方式传入（不是组件），所以**不会立即渲染**，只有 Route 匹配时才会渲染（例如这样 `{props.element}` 进行渲染 ）。

### history to useNavigate

您还需要从 package.json 中删除 history 依赖项。history 库是 v6 的直接依赖项（而不是对等依赖项），因此您永远不会直接导入或使用它。相反，您将使用 useNavigate() 钩子进行所有导航。

#### 基本使用

##### **v5**

```jsx | pure
// This is a React Router v5 app
import { useHistory } from "react-router-dom";

function App() {
  let history = useHistory();
  function handleClick() {
    history.push("/home");
  }
  return (
    <div>
      <button onClick={handleClick}>go home</button>
    </div>
  );
}
```

##### **v6**

在 v6 中，应重写此应用程序以使用`navigate`API。大多数时候，这意味着更改`useHistory`或`useNavigate`更改`history.push`或`history.replace`调用站点。

```jsx | pure
// This is a React Router v6 app
import { useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();
  function handleClick() {
    navigate("/home");
  }
  return (
    <div>
      <button onClick={handleClick}>go home</button>
    </div>
  );
}
```

如果您需要替换当前位置而不是将新位置推送到历史堆栈上，请使用`navigate(to, { replace: true })`.如果您需要状态，请使用`navigate(to, { state })`.您可以将第一个参数 to 视为`navigate`您的参数`<Link to>`，将其他参数视为 the`replace`和`state`props。

#### **API案例**

##### **v5**

```jsx | pure
// push跳转携带params参数
props.history.push(`/b/child1/${id}/${title}`)
// push跳转携带search参数
props.history.push(`/b/child1?id=${id}&title=${title}`);
// push跳转携带state参数
props.history.push(`/b/child1`, { id, title });
// 前进
this.props.history.goForward();
// 后退
this.props.history.goBack();
// 前进或回退 ( go )
this.props.history.go(-2); //回退到前2条的路由
// replace跳转携带params参数
this.props.history.replace(`/home/message/detail/${id}/${title}`)
// replace跳转携带search参数
this.props.history.replace(`/home/message/detail?id=${id}&title=${title}`)
// replace跳转携带state参数
this.props.history.replace(`/home/message/detail`, { id, title });
// 在一般组件中使用编程式路由导航 (非路由组件)
import {withRouter} from 'react-router-dom'
class Header extends Component {
    //...
}
// withRouter(Header)后，就可以在一般组件内部使用 this.props.history 
export default withRouter(Header)

```

##### v6

```jsx | pure
// push跳转携带params参数
navigate(`/b/child1/${id}/${title}`);
// push跳转携带search参数
navigate(`/b/child2?id=${id}&title=${title}`);
// push跳转携带state参数
navigate("/b/child2", { state: { id, title }});
// 前进
<button onClick={() => navigate(1)}>Go Forword</button>
// 后退
<button onClick={() => navigate(-1)}>Go back</button>
// 前进或后退几步
<button onClick={() => navigate(2)}>Go</button>
// replace跳转携带params参数
navigate(`/b/child1/${id}/${title}`,{replace: true});
// replace跳转携带search参数
navigate(`/b/child2?id=${id}&title=${title}`,{replace: true});
// replace跳转携带state参数
navigate("/b/child2",{state: { id, title},replace: true});
// 注意的是：withRouter（v6版本弃用）直接使用 useNavigate 即可
```

#### state参数

##### v5

```jsx | pure
//路由链接(携带参数)：
<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
//接收参数：
<Route path="/demo/test" component={Test}/>
	// Test
	// ……
	this.props.location.state
```

**v6**

```jsx | pure
// 通过Link的state属性传递参数
<Link
 className="nav"
 to={`/b/child2`}
 state={{ id: 999, name: "i love merlin" }} >Child2</Link>

//接收参数：接收参数的组件一定要是函数式声明的（class不可以）！！！
<Route path="/b/child2" component={Test}/>
	// Test
	// ……
	import { useLocation } from "react-router-dom";
	const { state } = useLocation(); // 使用 useLocation 获取state参数
	const { xx, xx } = state || {} 
	//state参数 => {id: 999, name: "我是梅琳"}
```

备注：刷新也可以保留住参数。

### Redirect & Navigate 

#### Redirect v5

```jsx | pure
import ｛ Redirect ｝from 'react-router-dom'
<Routes>
	<Route path="/about" element={<About />} />
	<Route path="/home" element={<Home />} />
	// 写在这里
	<Redirect to="/about" />
</Routes>
```

#### Navigate  v6

```jsx | pure
import ｛ Navigate ｝from 'react-router-dom'
<Routes>
	<Route path="about/*" element={<About />} />
	<Route path="home/*" element={<Home />} />
	<Route path="/*" element={<Navigate to="/about" />} />
</Routes>
// 也可以
<Route path="/*" element={<Test />} />
	// Test
	<div>
        ……
        <div>……</div>
        {isRedirect && <Navigate to="/about" />}
    </div>
```

### NavLink

`<NavLink>`是一种特殊的类型`<Link>`，它知道它是否处于“活动”、“待定”或“过渡”状态。这在一些不同的场景中很有用：

- 构建导航菜单时，例如面包屑或一组选项卡，您希望在其中显示当前选择的选项卡
- 它为屏幕阅读器等辅助技术提供有用的上下文
- 它提供了一个“转换”值，让您可以更细粒度地控制[视图转换](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

#### v5

```jsx | pure
import { NavLink } from 'react-router-dom'
<NavLink activeClassName="highlight" className="about"  to="/about" >About</NavLink>
```

#### v6

```jsx | pure
// 以下二者选一即可，一定要注意 （isActive ? " highlight"） highlight前面的空格！！！
// 官方写法
<NavLink className={({ isActive }) => "about" + (isActive ? " highlight" : "")} to="about">About</NavLink>
// ES6 模版字符串写法 
<NavLink className={({ isActive }) => `about ${isActive ? "highlight" : ""}`} to="about">About</NavLink>
```

**end 该属性**更改了和状态`end`的匹配逻辑，使其仅匹配 NavLink 路径的“末尾” 。如果 URL 长度超过，则该 URL 将不再被视为有效。`active``pending``to``to`

| 关联                           | 当前网址     | 活跃   |
| ------------------------------ | ------------ | ------ |
| `<NavLink to="/tasks" />`      | `/tasks`     | 真的   |
| `<NavLink to="/tasks" />`      | `/tasks/123` | 真的   |
| `<NavLink to="/tasks" end />`  | `/tasks`     | 真的   |
| `<NavLink to="/tasks" end />`  | `/tasks/123` | 错误的 |
| `<NavLink to="/tasks/" end />` | `/tasks`     | 错误的 |
| `<NavLink to="/tasks/" end />` | `/tasks/`    | 真的   |

## API

选择路由：https://reactrouter.com/en/main/routers/picking-a-router

路由 API ：https://reactrouter.com/en/main/components/route#action

### createBrowserRouter

createBrowserRouter 是所有 React Router Web 项目的推荐路由器。它使用[DOM History API](https://developer.mozilla.org/en-US/docs/Web/API/History)来更新 URL 并管理历史堆栈。

下边一个案例，用于构建项目顶级路由。

createRoutesFromElements.js

```jsx | pure
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import ActionOrLoader, {routes as ActionOrLoaderRoutes} from "./actionOrLoader";
import React from "react";
export default function CreateRoutesFromElementsTest() {
  // const router = createBrowserRouter([
  //     {
  //       path: '/',
  //       children: [
  //       // 如果使用 children 记得在渲染组件时使用 Outlet 组件，否则子组件不会渲染。
  //         {
  //           path: 'action-test/',
  //           Component: ActionOrLoader,
  //           children: ActionOrLoaderRoutes,
  //         },
  //       ]
  //     }
  //   ]
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path='/*'>
        <Route path='action-test/*' element={<ActionOrLoader />}>
          {ActionOrLoaderRoutes}
        </Route>
      </Route>
    ])
  );
  return <RouterProvider router={router}/>
}
```

注意：

+ **Route** 组件的 **children** 中，**只能**放 Route 或者 Routes 组件，所以在拆分不同文件时，注意使用**变量引入**（上例中  `{ActionOrLoaderRoutes}`）而不是一个组件。

+ **Route children** 中的 **Route** 组件在**父级有 element** 时，**不会**直接渲染，一定要使用 **Outlet** 组件进行 Route 加载（上例中 `element={<ActionOrLoader />}`）。
+ **顶级路由 path 属性**可以不写 /* 这样的路由，只有后裔路由，才需要 /*。

actionOrLoader.js

```jsx | pure
import React, {useCallback, useEffect, useMemo} from "react";
import {Route, useParams, useSubmit, useLoaderData, Outlet} from 'react-router-dom'

export default function ActionOrLoader() {
  // 记得在渲染组件时使用 Outlet 组件，否则子组件不会渲染。
  return <div>
    数据存储层（store）
    <Outlet/>
  </div>
}

export const routes = [
  // children 路由中主要要有 index 路由
  // 数组中的路由主要有 key，可以直接设置为 path 对应值。
  <Route key={'index'} index element={<ActionOrLoaderIndex/>}/>,
  <Route key={':songId'}
         path=':songId'
         element={<ActionOrLoaderDetail/>}
         action={async ({params, request}) => {
           let formData = await request.formData();
           console.log('formData', formData)
           console.log('params', params)
           return null
         }}
         loader={({params}) => {
           console.log('loader', params)
           return {test:'loaderData'}
         }}
  />
]
//////////
export function ActionOrLoaderDetail() {
  const params = useParams();
  const loaderData = useLoaderData()
  useEffect(() => {
    console.log('loaderData', loaderData)
    console.log('ActionOrLoaderDetail-useEffect-params', params)
  }, [params])
  return (<div>
    edit tt
  </div>)
}

export function ActionOrLoaderIndex() {
  const data = {
    name: 'xiaowu77',
    age: 29
  }
  let submit = useSubmit();
  return (
    <div>
      <button onClick={() => {
        submit(data, {
          method: "post",
          action: "asd22",
        });
      }}>跳转
      </button>
    </div>
  )
}
```

### loader

案例如上，使用 **loader** ，可以在每个路由都可以定义一个**“加载器”函数**，以便在**渲染之前**向路由组件**提供数据**。

在组件内部需要使用 **useLoaderData** 获取数据。

### action

每当应用程序向您的路线发送非 get 提交（“post”、“put”、“patch”、“delete”）时，就会调用 action 。

发送一个 action 方法如下：

```jsx | pure
// forms
<Form method="post" action="/songs" />;
<fetcher.Form method="put" action="/songs/123/edit" />;

// imperative submissions
let submit = useSubmit();
submit(data, {
  method: "delete",
  action: "/songs/123",
});
fetcher.submit(data, {
  method: "patch",
  action: "/songs/123/edit",
```

**案例**

```jsx | pure
export const routes = [
  <Route key={':songId'}
         path=':songId'
         element={<ActionOrLoaderDetail/>}
         action={async ({params, request}) => {
           let formData = await request.formData();
           console.log('formData', formData)
           console.log('params', params)
           return {
             name: formData.get('name'),
             age: formData.get('age')
           }
         }}
  />
]

export function ActionOrLoaderDetail() {
  const actionData = useActionData();
  useEffect(() => {
    console.log('actionData', actionData);
  }, [actionData])
  return (<div>
    edit tt
  </div>)
}
```

### redirect

**redirect** 方法，用于 **action 和 loader** 中的**重定向**方法。**非 **action 和 loader 的场景（组件中）还是使用 **useNavigate**。

```jsx | pure
import { redirect } from "react-router-dom";

const loader = async () => {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }
  return null;
};
```

### useSubmit

`useParams` 钩子返回一个键/值对对象，其中包含当前 URL 中由 `<Route path>` 匹配的动态参数。

额外注意的时，子路由从其父路由继承所有参数。

```jsx | pure
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // 从URL获取userId参数。
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```

### lazy

**如果不是数据路由（后裔路由和非数据路由）**

如果不是数据路由（后裔路由和非数据路由）,我们应使用 react Suspense API 异步引入组件。

```jsx | pure
import React from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {Loading} from '@microup/utils';
import {ErrorBoundary} from "react-error-boundary";

export const asyncLazy = (
  importFn,
  props,
  fallback = <Loading/>,
  ErrorComponent = <Empty/>
) => {
  const routeUndefined = (error) => {
    console.error(`route undefined:${error}`)
    return <Navigate to="/undefined"/>
  }
  if (!importFn) return routeUndefined('route path 为空，无对应页面')
  const LazyEle = React.lazy(importFn);
  if (!LazyEle) return routeUndefined(`route path 错误，无对应页面`)
  return (
    <ErrorBoundary fallback={ErrorComponent}>
      <React.Suspense fallback={fallback}>
        <LazyEle {...props}/>
      </React.Suspense>
    </ErrorBoundary>
  )
}
export default (props) => {
  return (
    <Routes>
      <Route index element={asyncLazy(()=>import('./Page1'))}/>
      <Route path={`page1/*`} element={asyncLazy(()=>import('./Page1'))}/>
    </Routes>
  )
};
```

**如果是数据路由**

为了让你的应用包更小，并支持**对路由**进行**代码拆分**，**匹配已知路由后**执行懒加载路由函数。

```jsx | pure
let routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route path="a" lazy={() => import("./a")} />
    <Route path="b" lazy={() => import("./b")} />
  </Route>
);
```

需要注意的是 **lazy** 引入的组件，**必须实现 Component 属性**。

```jsx | pure
import { useLoaderData } from "react-router-dom";

export async function loader() {
  await new Promise((r) => setTimeout(r, 500));
  return "I came from the About.tsx loader function!";
}

export function Component() {
  let data = useLoaderData() as string;

  return (
    <div>
      <h2>About</h2>
      <p>{data}</p>
    </div>
  );
}

Component.displayName = "AboutPage";
```

当然也可以这样引入

```jsx | pure
  <Route
    path='lazy-test'
    lazy={async () => {
      let LazyTest = await import("./LazyTest");
      return {Component: LazyTest.default};
    }}
  />
```

静态定义`loader`/ `action`，那么它将与该函数并行调用`lazy`。如果您有不介意关键捆绑包的小型加载程序，并且希望在组件下载的同时启动其数据获取，那么这非常有用。

```js
let route = {
  path: "projects",
  async loader({ request, params }) {
    let { loader } = await import("./projects-loader");
    return loader({ request, params });
  },
  lazy: () => import("./projects-component"),
};
```

 单个文件中的多个路由

```js
// Assume pages/Dashboard.jsx has all of our loaders/components for multiple
// dashboard routes
let dashboardRoute = {
  path: "dashboard",
  async lazy() {
    let { Layout } = await import("./pages/Dashboard");
    return { Component: Layout };
  },
  children: [
    {
      index: true,
      async lazy() {
        let { Index } = await import("./pages/Dashboard");
        return { Component: Index };
      },
    },
    {
      path: "messages",
      async lazy() {
        let { messagesLoader, Messages } = await import(
          "./pages/Dashboard"
        );
        return {
          loader: messagesLoader,
          Component: Messages,
        };
      },
    },
  ],
};
```

## 备注

### 错误：出现 `useContext` 或 `useRef` 找不到的错误。

出现 `useContext` 或 `useRef` 找不到的错误。通常是react版本问题，建议在 package.json 添加 peerDependencies 打平 react 包到 node_modules 一级目录中。让 react-router 引用正确的版本。

```json
"peerDependencies": {
	"react": "^18.2.0",
	"react-dom": "^18.2.0",
},
```

记得重新 `npm i` 。

### 为何v6删除正则路由？

正则表达式路由路径被移除有两个原因：

+ 在 v6 的路由匹配中，正则表达式**路径**引发了很多问题。如何对正则表达式进行**排名**呢？

+ 我们能够**摆脱**一个完整的**依赖项**（**path-to-regexp**），显著**减少**发送到用户浏览器的**包的体积**。如果重新添加，它将占据 React Router 页面体积的三分之一！

在研究了许多用例后，我们发现可以在没有直接正则表达式路径支持的情况下仍然满足它们，因此我们做出了折衷，显著减小了捆绑包大小，并避免了有关排名正则表达式路由的开放性问题。

案例

```jsx | pure
function App() {
  return (
    <Routes>
      <Route path="/users/:id" element={<ValidateUser />} />
      <Route path="/users/*" element={<NotFound />} />
    </Routes>
  );
}

function ValidateUser() {
  let params = useParams();
  let userId = params.id.match(/\d+/);
  if (!userId) {
    return <NotFound />;
  }
  return <User id={params.userId} />;
}

function User(props) {
  let id = props.id;
  // ...
}
```

### `Route` 组件中为什么留下 `element ` 而不是 `render` 或者 `component`?

+ 由于react 推出了 **`<Suspense fallback={<Spinner />}> ` API**，`fallback` prop需要一个React元素，而不是一个组件。所以 element 更贴切。

+ 在有 hook 之前，`<Route>`路由元素获取信息，没有很好的方式（高阶组件，自定义props 传递等都不好），直到有 hook 后，可以通过下面方式获取信息。 

  ```js
  let params = useParams();
  let location = useLocation();
  ```

+ 在v6中使用 `<Route element>` 的另一个重要原因是 `<Route children>` 是为**嵌套路由**保留的.

### 顶级路由与后裔（Descendant）路由

这里的顶级路由指的是**顶层定义的路由**，即 **createBrowserRouter 传入的参数**。而二级路由通常时一级路由 **element 参数**传入的组件中的路由（Routes）。

使用 Routes 组件时一般都是在后裔路由中使用。

使用**后裔路由**时，注意**不可以**使用 **loader**、**lazy**、**ErrorBoundary** 和 **action** 属性，也不可以使用 **useSubmit** Hook。

参考：https://segmentfault.com/q/1010000043580625