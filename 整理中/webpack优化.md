# webpack优化

## css优化

### purgecss-webpack-plugin

参考：https://www.leixuesong.com/3727

**可以去除未使用的css**，一般与glob、glob-all配合使用。

必须和mini-css-extract-plugin配合使用

paths路径是绝对路径

**方法1**

> 发现 方法1 与css-loader添加前缀有冲突，css全部被清

安装

```js
cnpm i -D purgecss-webpack-plugin glob
```

使用

```js
// 方法1
const glob = require('glob');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');

new PurgecssWebpackPlugin({
    paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }), 
    // paths标明用该插件的文。
    // nodir只匹配文件不匹配目录。
}),

```

> glob：node的glob模块允许你使用 *等符号, 来写一个glob规则,像在shell里一样,获取匹配对应规则的文件.
> https://www.cnblogs.com/liulangmao/p/4552339.html
>
> ```js
> glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }) // 找到当前目录src下所有的.css文件。
> ```

**方法2**（放入postcss中执行）

安装

```js
$ cnpm i -D @fullhuman/postcss-purgecss
```

使用

```js
// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer'), // 添加前缀
    purgecss({ // 删除没用的class样式
      content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'], // 应该分析的内容
    }),
  ],
};
```

### css驼峰转化

引入css时使用驼峰，用到属性`localsConvention`。

css文件。

```css
.router-title {
    border: 1px solid red;
}
.router2 {
    border: 1px solid red;
}
.router3 {
    border: 1px solid red;
}

```

jsx文件

```jsx
import styles from './index.css';

render() {
    return (
        // 使用驼峰命名引入样式
      <div className={styles.routerTitle}>
        welcome
        <Module1 defaultNum={5} />
      </div>
    );
}
```

最终可以拿到的styles：

> 打印styles得到：
>
> router2: "router2"
>
> router3: "router3"
>
> router-title: "router-title"
>
> routerTitle: "router-title"

localsConvention可以选择的值有：camelCase，dashes等。

camelCase // 把“下划线”、”阔这号”都转为驼峰 。（推荐）

dashes // 只转化“阔这号“为驼峰。

```js
use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              localsConvention: 'camelCase',
            },
          },
        ],
```

> 这里的importLoaders属性。作用：在使用@import时需要执行几个前置loader（ 2：执行postcss-loader，less-loader ）

### 自定义前缀

使用modules.getLocalIdent设置前缀。

这里getLocalIdent是个方法，可以拿到多个属性`getLocalIdent: (context, localIdentName, localName)`这里的context中可以获取到resourcePath文件路径，而localName则是css文件内的class名。

**配置**

```js
{
    loader: 'css-loader',
      options: {
        modules: {
          getLocalIdent: (context, localIdentName, localName) => {
            const regExp = /(?<=zhufeng-webpack-optimization[\\/]src)([\\/][\w]+)*/;
            const urlRoute = regExp.exec(context.resourcePath)[0].slice(1);
            return `wz-${urlRoute.split('\\').join('-')}-${localName}`;
          },
       },
    },
},
```

使用**正则**获取到项目路径后的路径：zhufeng-webpack-optimization**\src\router\index**.css。

然后分解拼接为 wz-router-index-routeTitle 作为新的class。

### px自动转成rem

使用px2rem-loader

页面元素渲染时计算根元素的font-size值

> 如果font-size为12px，1rem就是12px。

安装：

```
cnpm i px2rem-loader lib-flexible -D
```

> **lib-flexible**参考:[淘宝弹性布局方案lib-flexible实践](https://www.cnblogs.com/lyzg/p/5058356.html)

**使用lib-flexible，规定rem基准值**

在html引入文件

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script>
      <%= require('raw-loader!../node_modules/lib-flexible/flexible.js').default %>
    </script>
    <title>主页</title>
</head>
```

> raw-loader：一个webpack的加载器，它允许你以字符串的形式导入文件。
>
> <%=  %>：在script标签中使用这种语法，webpack可以读取到。

设置样式

```css
.router-title {
  border: 1px solid red;
  box-sizing: border-box;
  width: 10rem; // 10rem正好是100%的屏幕宽度
}
```

> 当拖动宽度时，可以看到
>
> html标签上有一个随宽度变化的属性：`style="font-size:48.4px;"`

**px转rem**

使用px2rem-loader时不需要lib-flexible。

配置

```js
{
  loader: 'css-loader',
},
{ // 转rem loader
  loader: 'px2rem-loader',
  options: {
    remUni: 75, // 1rem 是 75px。（ 10rem->100%宽度->750px ,所以设计稿宽是750px）
    remPrecision: 8, // 转化为rem后保留8位小数。
  },
},
'postcss-loader',
```

> 设置remUni属性可以设置设计宽度。例如750px宽度的稿子，可以设置remUni:75。

设置样式

```css
.router-title {
  border: 1px solid red;
  box-sizing: border-box;
  width: 750px;
}
```

## 动态类型库

把基础模块独立出来打包到独立的动态链接库中。

当需要导入的模块在动态链接库里的时候，模块不能再次被打包，而是去动态链接库里获取。

### **DLL**

**什么是DLL**

> DLL(Dynamic Link Library)文件为动态链接库文件,在Windows中，许多应用程序并不是一个完整的可执行文件，它们被分割成一些相对独立的动态链接库，即DLL文件，放置于系统中。当我们执行某一个程序时，相应的DLL文件就会被调用。

举个例子：很多产品都用到螺丝，但是工厂在生产不同产品时，不需要每次连带着把螺丝也生产出来，因为螺丝可以单独生产，并给多种产品使用。在这里螺丝的作用就可以理解为是dll。

**为什么要使用Dll**

通常来说，我们的代码都可以至少简单区分成**业务代码**和**第三方库**。如果不做处理，每次构建时都需要把所有的代码重新构建一次，耗费大量的时间。然后大部分情况下，很多第三方库的代码并不会发生变更（除非是版本升级），这时就可以用到dll：**把复用性较高的第三方模块打包到动态链接库中，在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码**。

还是上面的例子：把每次构建，当做是生产产品的过程，我们把生产螺丝的过程先提取出来，之后我们不管调整产品的功能或者设计（对应于业务代码变更），**都不必重复生产螺丝（第三方模块不需要重复打包）**；除非是**产品要使用新型号的螺丝（第三方模块需要升级）**，才需要去重新生产新的螺丝，然后接下来又可以专注于调整产品本身。

DllPlugin插件：用于打包出一个个动态链接库

DllReferencePlugin插件：在配置文件中引入DllPlugin插件打包好的动态链接库。

### DllPlugin

**设置**

新建webpack.dll.config.js

> 设置出入口，打包第三方库位dll。
>
> 设置library为变量的导出名字，下边DllPlugin中使用改名字。

```js
entry: ['react', 'react-dom'], // 希望第三方库文件单独打包
output: {
  path: path.join(__dirname, 'dist'),
  filename: '[name].dll.js', // 打包出来的文件
  libraryTarget: 'var', // 使用var方式（可以不写）
  library: '_dll_[name]', // 指定导出的名字
},
```

使用 webpack.DllPlugin 生成dll文件。

> 使用 cleanOnceBeforeBuildPatterns 设置删除文件时忽略的文件
>
> cleanOnceBeforeBuildPatterns: ['!\*.manifest.\*']

> 这里的 manifest.js 文件是dll的列表，标明插件的路径。

```js
plugins: [
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', '[name].manifest.js'),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['!*.manifest.*'],
    }),
  ],
```

**主配置文件**

设置CleanWebpackPlugin插件。

```js
new CleanWebpackPlugin({
  cleanOnceBeforeBuildPatterns: ['**/*', '!*.dll.*', '!*.manifest.*'],
}),
```

> `**/* `删除dist中所有的文件。 `!*.dll.*`但是忽略dll文件。
>
> `!*.manifest.*`忽略manifest文件。

### DllReferencePlugin

**主配置文件**

设置DllReferencePlugin插件，指定dll路径

webpack.config.js

```js
new webpack.DllReferencePlugin({
   manifest: path.resolve(__dirname, 'dist', 'main.manifest.js'),
}),
```

> 这里manifest属性标识dll的列表文件的路径。列表文件内有对打包的dll的标识。
>
> 例如main.manifest.js的一条数据
>
> ```js
> "./node_modules/_react-dom@16.13.1@react-dom/index.js":
> {
>   "id":"./node_modules/_react-dom@16.13.1@react-dom/index.js", 
>   "buildMeta":{
>      "providedExports":true
>   }
> },
> ```

使用DllReferencePlugin后，一些包则在打包时不会再打入。而是使用下面方式代替：

```js
let React = _ddl_react.React
```

测试中，原先打包大小有明显缩小。

```
// 使用dll前
main.71ae9cdae78bd657c621.js    847 KiB
// 使用后
main.9c3e9607f4018873c351.js   25.1 KiB
```

### 修改HTML模板

通过var导入的文件都要手动引入。

修改html模板

```html
<body>
<div id="root"></div>
<script src="./main.dll.js"></script>
</body>
```

## TreeShaking

摇树，一个模型可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到bundle里边去。

tree shaking就是把用到的方法打入bundle，没有用到的方法会uglify阶段擦除掉。

原理是**利用es6模块的特点**，**引入模块只能顶层语句**中出现，import的模块名只能是字符串常量。

### **开启**

webpack默认支持，在.babelrc设置 `modules:false` 即可在 `production mode` 下默认开启。

> 注意devtool设为null

设置babel.config.js

```js
presets: [
    ['@babel/preset-env', { modules: false }],
    // 设置modules:false
    '@babel/preset-react',
  ],
```

> 设置modules: false，treeShaking实现主要依赖es6模块化语法，所以不要让babel转义为CommonJS

### 应用场景

1没有导入或者使用

```js
export function func1() {
  return 'func1';
}

export function func2() {
  return 'func2';
}

import {func2} from '../utils'
```

2代码不会执行，不可到达。

```js
if(false){
console.log('false')
}
```

3代码执行结果不会被用到

```js
import {func2} from './functions';
func2()
```

4代码中只会应行死变量，只写不读。

```js
var aa = 'aa'
aa = 'bb'
```

**注意**

双入口，摇树也依然会开启。

良好的支持摇树优化注意什么？

+ 一定要使用es6modules
+ 尽量编写没有副作用的代码，不要写动态引入别的模块，改变全局变量。

## 开启 Scope Hoisting

**Scope Hoisting 可以让webpack打包出来的代码文件更小，运行更快，它又译作‘作用域提升‘，在webpack3中新推出的功能。**

代码体积更小，因为函数声明语句产生大量的代码。

代码在运行时因为创建的函数作用域更少了，内存开销也随之变小

大梁作用域包装代码会导致体积增大。

运行时创建的函数作用域变多，内存开销增大。

scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止命名冲突。

这个功能在**mode为production下默认开启**，开发环境要用webpack.optimize.ModuleConcatenationPlugin 插件。

也要使用ES6 Module，CJS不支持。



## 热加载

### HotModuleReplacementPlugin

不刷新页面加载一个模块，热加载。

webpack配置

```js
plugins: [
  new webpack.HotModuleReplacementPlugin()
]

devServer: {
    // 启动server的热加载功能
  hot: true,
}
```

index.jsx

```jsx
import ReactDOM from 'react-dom';
 
componentDidMount() {
    console.log(styles);
    if (module.hot) {
      module.hot.accept(['./module/module1'], () => {
        // 这里的 ./module/module1 必须是当前页面引入的文件。
        // let App = require('./App').default;
        // 当文件./module/module1变动，就重启渲染<Module1 />到hot1中。
        ReactDOM.render(<Module1 />, document.getElementById('hot1'));
      });
    }
  }

render(){
  return (<div id="hot1" />)
}
```

项目案例

```js
// 用于不刷新页面，编程一个组件(提高10%编程效率)
// 使用：
// const [bugHotFn, _bugHot] = useBugHotModule();
// useEffect(() => {
//   if (module.hot) {
//     module.hot.accept(['./ButtonRender'], _bugHot);
//   }
// }, []);
// {bugHotFn(<ButtonRender />)}
// 封装方法：
const useBugHotModule = () => {
  const [visible, setVisible] = useState(true);
  const bugHot = () => {
    setVisible(false);
    setVisible(true);
  };
  if (visible) {
    return [(Dom) => Dom, bugHot];
  }
  return [() => {}, bugHot];
};
```

### react-hot-loader

实时调整React组件.

webpack-dev-server 已经是热加载，为什么还要在 react 项目中安装 webpack-dev-server ？

> 其实这两者的更新是却别的， webpack-dev-server 的热加载是开发人员修改了代码，代码经过打包，重新刷新了整个页面。二 react-hot-loader 不会刷新整个页面，他只替换了修改的代码，做到了页面的局部刷新。但他需要依赖 webpack 的 HotModuleReplacement 热加载插件。

安装

```js
cnpm i --save-dev react-hot-loader
```

使用

```js
// .babelrc
{
  "plugins": ["react-hot-loader/babel"]
}
```

```js
// App.js
import { hot } from 'react-hot-loader/root';
const App = () => <div>Hello World!</div>;
export default hot(App);
```

> hot方法，有冒泡机制。当多个组件时且具有层级关系时。子组件变化通知子组件的hot，假如没有处理再通知父级组件hot。父级组件如果处理更新父级组件。假如都没有处理会刷新页面。

### React Fast Refresh

React Fast Refresh

对于react-hot-loader的代替方案。

参考：https://segmentfault.com/a/1190000023534941



## splitChunks

[《理解webpack4.splitChunks之chunks》](https://www.cnblogs.com/kwzm/p/10314827.html)

[《理解webpack4.splitChunks之cacheGroups》](https://www.cnblogs.com/kwzm/p/10315080.html)

[《理解webpack4.splitChunks之maxInitialRequests》](https://www.cnblogs.com/kwzm/p/10316217.html)

[《理解webpack4.splitChunks之maxAsyncRequests》](https://www.cnblogs.com/kwzm/p/10316482.html)

[《理解webpack4.splitChunks之其余要点》](https://www.cnblogs.com/kwzm/p/10333554.html)

## 知识点

### 行内loader使用

在引用文件时使用loader。

例如css-loader的行内使用，执行从右向左，依次把结果传递。

```js
import 'style-loader!css-loader!./index.css'
```

当使用 “!!” 双感叹号。表示步走配置项中的loader。

```html
 <style>
<%= require('!!raw-loader!./inline.css').default %>
</style>
```

### 内联资源

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
		<%= require('!!raw-loader!./inline.css').default %>
	</style>
    <script>
      	<%= require('raw-loader!../node_modules/lib-flexible/flexible.js').default %>
    </script>
    <title>主页</title>
</head>
```

可以在页面框架加载时进行初始化。

可以上报打点数据。

css的内联可以避免页面闪动。

可以减少HTTP网络请求的数量。 

## webpack4特性

webpack4的splitChunks分包：https://www.jianshu.com/p/4f0600ea1c5f

> 自从webpack升级到4以来，号称零配置。代码会自动分割、压缩、优化，同时 webpack 也会自动帮你 Scope hoisting 和 Tree-shaking。
> 说到这里webpack4取消了UglifyjsWebpackPlugin，使用minimize进行压缩，取消了CommonsChunkPlugin，使用splitChunks进行分包。