---
title: 异步组件
order: 7
nav: VUE框架
---

# 异步组件

## 基础使用

仅在需要时再从服务器加载相关组件。Vue 提供了 [`defineAsyncComponent`](https://cn.vuejs.org/api/general.html#defineasynccomponent) 方法来实现此功能：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`
```

`defineAsyncComponent` 方法接收一个返回 Promise 的加载函数。这个 Promise 的 `resolve` 回调方法应该在从服务器获得组件定义时调用。你也可以调用 `reject(reason)` 表明加载失败。

[**ES 模块动态导入**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)也会返回一个 Promise，所以多数情况下我们会将它和 `defineAsyncComponent` 搭配使用。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最后得到的 `AsyncComp` 是一个外层包装过的组件，**仅在页面需要它渲染时**才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

与普通组件一样，异步组件可以使用 `app.component()` [全局注册](https://cn.vuejs.org/guide/components/registration.html#global-registration)：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

也可以直接在父组件中直接定义它们：

```jsx | pure
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

## 加载与错误状态

异步操作不可避免地会涉及到加载和错误状态，因此 `defineAsyncComponent()` 也支持在高级选项中处理这些状态：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

## Suspense

`<Suspense>` 可以等待的异步依赖有两种：

1. 带有异步 `setup()` 钩子的组件。这也包含了使用 `<script setup>` 时有顶层 `await` 表达式的组件。
2. [异步组件](https://cn.vuejs.org/guide/components/async.html)。

### [async setup()](https://cn.vuejs.org/guide/built-ins/suspense.html#async-setup)

组合式 API 中组件的 `setup()` 钩子可以是异步的：

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

如果使用 `<script setup>`，那么顶层 `await` 表达式会自动让该组件成为一个异步依赖：

```jsx | pure
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### [异步组件](https://cn.vuejs.org/guide/built-ins/suspense.html#async-components)

异步组件默认就是**“suspensible”**的。这意味着如果组件关系链上有一个 `<Suspense>`，那么这个异步组件就会被当作这个 `<Suspense>` 的一个异步依赖。在这种情况下，加载状态是由 `<Suspense>` 控制，而该组件自己的加载、报错、延时和超时等选项都将被忽略。

异步组件也可以通过在选项中指定 `suspensible: false` 表明不用 `Suspense` 控制，并让组件始终自己控制其加载状态。

### [加载中状态](https://cn.vuejs.org/guide/built-ins/suspense.html#loading-state)

`<Suspense>` 组件有两个插槽：`#default` 和 `#fallback`。两个插槽都只允许**一个**直接子节点。在可能的时候都将显示默认槽中的节点。否则将显示后备槽中的节点。

template

```
<Suspense>
  <!-- 具有深层异步依赖的组件 -->
  <Dashboard />

  <!-- 在 #fallback 插槽中显示 “正在加载中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

### [事件](https://cn.vuejs.org/guide/built-ins/suspense.html#events)

`<Suspense>` 组件会触发三个事件：`pending`、`resolve` 和 `fallback`。`pending` 事件是在进入挂起状态时触发。`resolve` 事件是在 `default` 插槽完成获取新内容时触发。`fallback` 事件则是在 `fallback` 插槽的内容显示时触发。

### 案例

实现错误捕获与异步组件引入，异步组件使用 setup await 实现。

父级：

```jsx | pure
<script setup>
import Async from './async.vue';
import {onErrorCaptured,ref} from "vue";
// 选择执行
const select = ref('resolve')
// 异步错误捕获
let errRef = ref(null)
onErrorCaptured((err)=>{
  errRef.value = err
  return false
})
const clearErrRef = ()=>{
  errRef.value = null
}
// end
</script>
<template>
  <button @click="select='reject'">异步报错</button>
  <button @click="()=>{
        clearErrRef()
        select='resolve'
  }">异步执行</button>

  <Suspense v-if="!errRef">
    <Async :select="select"></Async>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
  <!-- 错误展示 -->
  <div v-else>错误：{{errRef}}</div>
</template>
```

子级：

```jsx | pure
<script setup>
import {defineProps, watch, ref} from 'vue'

// 使用 defineProps 获取父组件传递的 props
const props = defineProps(['select'])

// 定义一个响应式引用来存储异步操作的结果
const asyncResult = ref(null)

// 使用 watch 函数来观察 props.select 的变化
watch(()=>props.select,async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
  if (props.select === 'reject') {
    await Promise.reject('内存爆满，运行出错！')
  }
  if (props.select === 'resolve') {
    asyncResult.value = await Promise.resolve({data: 'net-2023'})
  }
}, {immediate:true})  // immediate 选项确保 watcher 在 setup 时立即运行一次
</script>
<template>
  <div>
    <header>async-children</header>
    <div>{{ asyncResult }}</div>
  </div>
</template>
```

