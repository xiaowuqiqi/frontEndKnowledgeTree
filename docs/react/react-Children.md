---
title: React-Children
group:
  title: 基本使用
  order: 1
order: 2
---

# children

## 简介

我们都知道vue有插槽的概念，我们需要让子组件的一部分内容，被父组件控制，而不是被子组件控制，那么我们会采用插槽的写法 `<slot></slot>`

在 React 里也有类似的写法，父组件写法是相同的，但子组件是采用 `{this.props.children}` 来实现。

## this.props.children

使用 this.props.children 时需要注意， this.props.children 的值一般有三种可能：

如果当前组件没有子节点，它就是`undefined`;

如果有一个子节点，数据类型是`Object`;

如果有多个子节点，数据类型就是`array`。

其实 React 中的 Children 不一定是组件，它们可以使任何东西，文字、函数等。

所以，处理`this.props.children`的时候要小心。

## 一个节点 [ Object ]

最基本的使用方式：

```jsx | pure
////// Text 父级
export default class Text extends React.Component {
  render() {
    return (
      <div>
        <Children>
          <a href="ok">ok</a>
        </Children>
      </div>
    );
  }
}
///// children
export default function Children(props) {
  console.log(props.children)
  return (
    <div>
      {props.children}
    </div>
  );
}

```

当使用打印 props.children 时

```js
{$$typeof: Symbol(react.element), type: "a", key: null, ref: null, props: {…}, …}
$$typeof: Symbol(react.element)
	key: null
	props: // 标签携带的属性
		children: "ok"
		href: "ok"
		__proto__: Object
	ref: null
	type: "a" // 用于标签判断
	_owner: FiberNode {tag: 1, key: null, stateNode: Text, elementType: ƒ, type: ƒ, …}
	_store: {validated: true}
	_self: null
	_source: null
	__proto__: Object
```



## 多个节点时 [Array]

使用 Children 时可能传入多个类型不同的元素。

```jsx | pure
export default class Text extends React.Component {
  render() {
    return (
      <div>
        <Children>
          <a href="ok">ok</a>
          <a href="ok">ok</a>
          ok
          {1}
          {null}
          {undefined}
          {new Array(1,2,3)}
        </Children>
      </div>
    );
  }
}
```

Children 对不同类型元素做区分，分别对其输出。

```jsx | pure
export default function Children(props) {
  // Declare a new state variable, which we'll call "count"
  // const [count, setCount] = useState(0);
  console.log(props.children)
  return (
    <div>
      {props.children.map(item=>{
        if({}.toString.call(item)==='[object Object]'&&'$$typeof' in item){
          console.log('react元素')
          return item
        }
        if(typeof item === 'string'){
          console.log('string元素')
          return (<p>item</p>)
        }
        if(typeof item === 'number'){
          console.log('number元素')
          return (<input type='number' value={item} disabled/>)
        }
        if(Array.isArray(item)){
          console.log('array元素')
          return (<ul>
              {item.map(liText=><li>{liText}</li>)}
          </ul>)
        }
        return
      })}
    </div>
  );
}
```



## 节点为 function 时

### **简单实践**

节点为 function 时使用方法如下：

```jsx | pure
// 调用
<Executioner>
  {() => <h1>Hello World!</h1>}
</Executioner>

///// 可以使用方法

class Executioner extends React.Component {
  render() {
    return this.props.children()
  }
}
```



### **子组件的回传参数**

我们可以巧妙的获取**子组件传出的值**

```jsx | pure
export default class Text extends React.Component {
  render() {
    return (
      <div>
        <Children>
          {(num)=>(<p>{num}</p>)}
        </Children>
      </div>
    );
  }
}
```

组件 Children 做累加操作，把值返回给父级组件

```jsx | pure
export default function Children(props) {
  // Declare a new state variable, which we'll call "count"
  const [num, setNum] = useState(0);
  const child = typeof props.children === 'function'?props.children:()=>{}
  return (
    <div>
      <button onClick={()=>setNum(num+1)}>+1</button>
      {child(num)}
    </div>
  );
}
```

### **异步操作**

使用函数传值方法，可以从服务器获取一些数据。（重点）

```jsx | pure
// Fetch内获取数据后异步把参数注入到 result 中，并执行。
<Fetch url="api.myself.com">
  {(result) => <p>{result}</p>}
  <!-- 或者 {(dataSet) => <table dataSet={dataSet}></table>}-->  
</Fetch>
```



## 循环

 `React.Children.map` 以及 `React.Children.forEach` 。

它们在对应数组的情况下能起作用，除此之外，当**函数、对象或者任何东西**作为children传递时，它们也会**起作用**。

这样就不用担心用户传入是否是一个数组了

```jsx | pure
export default function Children(props) {
  return (
    <div>
      {React.Children.map(props.children, (child, i) => {
        console.log(child, i)
      })}
    </div>
  );
}
```

> 元素假如是数组，将会打平处理。

## React.Children.count

因为`this.props.children` 可以是任何类型的，检查一个组件有多少个children是非常困难的。

使用 `this.props.children.length` 是不对的。

我们需要使用 React.Children.count ，获取元素个数。

```js
class ChildrenCounter extends React.Component {
  render() {
    return <p>React.Children.count(this.props.children)</p>
  }
}
```

## React.Children.toArray

children转换为数组通过 `React.Children.toArray` 方法。

如果你需要对它们进行**排序**，这个方法是非常有用的。

```jsx | pure
class Sort extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)
    // Sort and render the children
    return <p>{children.sort().join(' ')}</p>
  }
}

///////
<Sort>
  // We use expression containers to make sure our strings
  // are passed as three children, not as one string
  {'bananas'}{'oranges'}{'apples'}
</Sort>
```



## React.Children.only

在 `render` 里面使用 `React.Children.only`

```dart
export default function Children(props) {
  return (
    <div>
      {React.Children.only(props.children)}
    </div>
  );
}
```

这样只会返回一个child。如果不止一个child，它就会抛出错误，让整个程序陷入中断——完美的避开了试图破坏组件的懒惰的开发者。



## 修改子元素

修改子元素。`React.cloneElement` 会克隆一个元素。

我们将想要克隆的元素当作第一个参数，然后将想要设置的属性以对象的方式作为第二个参数。

```js
export default function Children(props) {
  // Declare a new state variable, which we'll call "count"
  const [num, setNum] = useState(0);
  return (
    React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        disabled: true
      })
    })
  );
}
```

## 判断reactElement使用

使用isValidElement判断是否是reactElement

```tsx | pure
if (React.isValidElement<common.ObjectAny>(children)) {
    return (
      <div>
        {React.cloneElement(children, { key: 1 })}
      </div>
    );
  }
```

## 把react组件,插入到任意dom元素中

```ts
class Utils {
constructor () {}
alert (view) {
let div = document.createElement('div')
view = view || <button>确定</button>
ReactDOM.render(view, div)
document.body.appendChild(div)
}
}
```

## HOC的TS写法

```tsx | pure
export default ({ children, overlay }: { children: React.ReactElement, overlay: IOverlay[] }) => {

  const ref = useRef<HTMLElement | null>(null);

  if (React.isValidElement<React.HTMLProps<HTMLElement | null>>(children)) {
    return (
      <section ref={ref} className={styles.MultiMenu}>
        <Menu list={overlay} />
        {React.cloneElement(children, children.props)}
      </section>
    );
  }
  return children; // 返回值必须是reactElement,所以这里需要返回
};
```

