---
title: vue监听器与生命周期
order: 3
nav: VUE框架
---

## 监听器

### [基本示例](https://cn.vuejs.org/guide/essentials/watchers.html#basic-example)

计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态。

在组合式 API 中，我们可以使用 [`watch` 函数](https://cn.vuejs.org/api/reactivity-core.html#watch)在每次响应式状态发生变化时触发回调函数：

```html
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNplkkGPmzAQhf/KKxdA3Rj1mpJUUdVDT22lHrlYxDRuYOzaJjRC/PcdxyGr3b2A7PfmmzcMc3awVlxGlW2z2rdO2wCvwmj3DenBGhcww6nuCZMM7QkLOmcG5FyRN9RQa8gH/BuVD9oQdtFb5Hm5KpL8pNx6/+vu8xj9KPv+CnYFqQnyhTFIdxb4vCkjpaFb32JVnyD9lVoUpKaVVmK3x9wQoLtXgtB0VP9/cOMveYk9Np/K5MM9l7jIflScLv990nTW9EcIwXNFR3DX1YwYk4dxyrNXTlIHdCrGyk8hWL+tqqvyZMQUukpaHYOnujdtilTLHPHXGyrKUiRH8i9obx+5UM4Z98j6Pu23qH/AVzP2R5CJRMl14aRw+PldIMdH3Bh3bnzxY+FcdZW2zPvlQ1CD7WVQfALquPToP/gzL4RHqsg89rJNWq3JjgGXzWCOqt812ao3GaqEqRKHcfO8/gDLkq7r6tEyW54Bf5TTlg==)

### [侦听数据源类型](https://cn.vuejs.org/guide/essentials/watchers.html#watch-source-types)

`watch` 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：

```js
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你**不能直接侦听响应式对象的属性值**，例如:

```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

这里需要用一个返回该属性的 getter 函数：

```js
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

### [深层侦听器](https://cn.vuejs.org/guide/essentials/watchers.html#deep-watchers)

直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象（地址不同）时，才会触发回调：

```js
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
)
```

你也可以给上面这个例子显式地加上 `deep` 选项，强制转成深层侦听器：

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

### [立刻执行](https://cn.vuejs.org/guide/essentials/watchers.html#eager-watchers)

`watch` 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。

我们可以通过传入 `immediate: true` 选项来强制侦听器的回调立即执行：

```js
watch(source, (newValue, oldValue) => {
  // 立即执行，且当 `source` 改变时再次执行
}, { immediate: true })
```

### [watchEffect()](https://cn.vuejs.org/guide/essentials/watchers.html#watcheffect)

侦听器的回调使用与源完全相同的响应式状态是很常见的。例如下面的代码，在每当 `todoId` 的引用发生变化时使用侦听器来加载一个远程资源：

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```

等同于

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

这个例子中，回调会立即执行，不需要指定 `immediate: true`。在执行期间，它会自动追踪 `todoId.value` 作为依赖（和计算属性类似）。每当 `todoId.value` 变化时，回调会再次执行。

使用 `watchEffect()` 可以消除手动维护依赖列表的负担。

此外，如果你需要侦听一个嵌套数据结构中的几个属性，`watchEffect()` 可能会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。

**注意**

`watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。

### watchEffect对比computed

watchEffect和computed都有点类似于react的useMemo。

但是computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值。

而watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值。

computed若是值没有被使用时不会调用，但是watchEffect始终会调用一次。

```html
<script setup>
import { ref, computed, watchEffect } from 'vue';
const count = ref(0);
// computed
const doubleCount = computed(() => {
  console.log('computed is running', count.value);
  return count.value;
});
// watchEffect
watchEffect(() => {
  console.log('watchEffect is running', count.value);
});
count.value++;

// 控制台打印：
// watchEffect is running 0
// 组件渲染1
// computed is running 1
// 组件渲染2
// watchEffect is running 1
</script>
<template>
  <article>
    <header>Watch</header>
    <section>
      {{console.log('组件渲染1')}}
      {{ doubleCount }}
      {{console.log('组件渲染2')}}
    </section>
  </article>
</template>
<style scoped>
</style>
```

### [`watch` vs. `watchEffect`](https://cn.vuejs.org/guide/essentials/watchers.html#watch-vs-watcheffect)

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

### [watchPostEffect](https://cn.vuejs.org/guide/essentials/watchers.html#callback-flush-timing)

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

想在侦听器回调中能访问被 Vue 组件更新**之后**的 DOM（类似 useEffect），你需要指明 `flush: 'post'` 选项：

js

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

js

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

### [停止侦听器](https://cn.vuejs.org/guide/essentials/watchers.html#stopping-a-watcher)

侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：

```html
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

## 生命周期

![lifecycle.16e4c08e](./monitor.assets/lifecycle.16e4c08e.png)

### [onMounted()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onmounted)

注册一个回调函数，在组件挂载完成后执行。

- **类型**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **详细信息**

  组件在以下情况下被视为已挂载：

  - 其所有同步子组件都已经被挂载 (不包含异步组件或 `<Suspense>` 树内的组件)。
  - 其自身的 DOM 树已经创建完成并插入了父容器中。注意仅当根容器在文档中时，才可以保证组件 DOM 树也在文档中。

  这个钩子通常用于执行需要访问组件所渲染的 DOM 树相关的副作用，或是在[服务端渲染应用](https://cn.vuejs.org/guide/scaling-up/ssr.html)中用于确保 DOM 相关代码仅在客户端执行。

  **这个钩子在服务器端渲染期间不会被调用。**

- **示例**

  通过模板引用访问一个元素：

  ```html
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const el = ref()
  
  onMounted(() => {
    el.value // <div>
  })
  </script>
  
  <template>
    <div ref="el"></div>
  </template>
  ```

### [onUpdated()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onupdated)

注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。注意的是第一次组件渲染时不执行。

- **类型**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **详细信息**

  父组件的更新钩子将在其子组件的更新钩子之后调用。

  这个钩子会在组件的任意 DOM 更新后被调用，这些更新可能是由不同的状态变更导致的，因为多个状态变更可以在同一个渲染周期中批量执行（考虑到性能因素）。如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 [nextTick()](https://cn.vuejs.org/api/general.html#nexttick) 作为替代。

  **这个钩子在服务器端渲染期间不会被调用。**

  WARNING

  不要在 updated 钩子中更改组件的状态，这可能会导致无限的更新循环！

- **示例**

  访问更新后的 DOM

  ```html
  <script setup>
  import { ref, onUpdated } from 'vue'
  
  const count = ref(0)
  
  onUpdated(() => {
    // 文本内容应该与当前的 `count.value` 一致
    console.log(document.getElementById('count').textContent)
  })
  </script>
  
  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

### [onUnmounted()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onunmounted)

注册一个回调函数，在组件实例被卸载之后调用。

- **类型**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **详细信息**

  一个组件在以下情况下被视为已卸载：

  - 其所有子组件都已经被卸载。
  - 所有相关的响应式作用 (渲染作用以及 `setup()` 时创建的计算属性和侦听器) 都已经停止。

  可以在这个钩子中手动清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。

  **这个钩子在服务器端渲染期间不会被调用。**

- **示例**

  ```html
  <script setup>
  import { onMounted, onUnmounted } from 'vue'
  
  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })
  
  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

### [onBeforeMount()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onbeforemount)

注册一个钩子，在组件被挂载之前被调用。

- **类型**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **详细信息**

  当这个钩子被调用时，组件已经完成了其响应式状态的设置，但还没有创建 DOM 节点。它即将首次执行 DOM 渲染过程。

  **这个钩子在服务器端渲染期间不会被调用。**

### [onBeforeUpdate()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onbeforeupdate)

注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。

- **类型**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **详细信息**

  这个钩子可以用来在 Vue 更新 DOM 之前访问 DOM 状态。在这个钩子中更改状态也是安全的。

  **这个钩子在服务器端渲染期间不会被调用。**

### [onBeforeUnmount()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount)

注册一个钩子，在组件实例被卸载之前调用。

- **类型**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **详细信息**

  当这个钩子被调用时，组件实例依然还保有全部的功能。

  **这个钩子在服务器端渲染期间不会被调用。**

### [onErrorCaptured()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured)

注册一个钩子，在捕获了后代组件传递的错误时调用。

- **类型**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void
  
  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **详细信息**

  错误可以从以下几个来源中捕获：

  - 组件渲染
  - 事件处理器
  - 生命周期钩子
  - `setup()` 函数
  - 侦听器
  - 自定义指令钩子
  - 过渡钩子

  这个钩子带有三个实参：错误对象、触发该错误的组件实例，以及一个说明错误来源类型的信息字符串。

  你可以在 `errorCaptured()` 中更改组件状态来为用户显示一个错误状态。注意不要让错误状态再次渲染导致本次错误的内容，否则组件会陷入无限循环。

  这个钩子可以通过返回 `false` 来阻止错误继续向上传递。请看下方的传递细节介绍。

  **错误传递规则**

  - 默认情况下，所有的错误都会被发送到应用级的 [`app.config.errorHandler`](https://cn.vuejs.org/api/application.html#app-config-errorhandler) (前提是这个函数已经定义)，这样这些错误都能在一个统一的地方报告给分析服务。
  - 如果组件的继承链或组件链上存在多个 `errorCaptured` 钩子，对于同一个错误，这些钩子会被按从底至上的顺序一一调用。这个过程被称为“向上传递”，类似于原生 DOM 事件的冒泡机制。
  - 如果 `errorCaptured` 钩子本身抛出了一个错误，那么这个错误和原来捕获到的错误都将被发送到 `app.config.errorHandler`。
  - `errorCaptured` 钩子可以通过返回 `false` 来阻止错误继续向上传递。即表示“这个错误已经被处理了，应当被忽略”，它将阻止其他的 `errorCaptured` 钩子或 `app.config.errorHandler` 因这个错误而被调用。

### [onRenderTracked()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onrendertracked)

注册一个调试钩子，当组件渲染过程中追踪到响应式依赖时调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void
  
  type DebuggerHook = (e: DebuggerEvent) => void
  
  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **参考**[深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)

### [onRenderTriggered()](https://cn.vuejs.org/api/composition-api-lifecycle.html#onrendertriggered)

注册一个调试钩子，当响应式依赖的变更触发了组件渲染时调用。

**这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。**

- **类型**

  ts

  ```
  function onRenderTriggered(callback: DebuggerHook): void
  
  type DebuggerHook = (e: DebuggerEvent) => void
  
  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **参考**[深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)