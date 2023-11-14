# webpack的插件机制

webpack实现插件机制的大体方式是：

1，创建 - webpack 在其内部对象上创建各种钩子。

2，注册 - 插件将自己的方法注册到对应钩子上，交给 webpack。

3，调用 - webpack 编译过程中，会实时触发相应钩子，因此也就触发了插件的方法。

webpack 本质是时间流机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例。

通过事件和注册和监听，触发webpack生命周期中的函数方法。



**Tapable**

```js
const {
	SyncHook,
	SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable')
```



分为**同步Sync**和**异步Async**。异步又分为**并行**（Parallel），**串行**（Series）。

关键字分类

| 类型      | 使用要点                                                     |
| --------- | ------------------------------------------------------------ |
| Basic     | 不关心监听函数的返回值                                       |
| Bail      | 保险式：只要监听函数中有返回值（不为undefined），则跳过之后的监听函数。 |
| Waterfall | 瀑布式：上一步的返回值交给下一步使用。                       |
| Loop      | 循环类型：如果该监听函数返回true，则这个监听函数会反复执行，如果返回undefined则退出循环。 |

