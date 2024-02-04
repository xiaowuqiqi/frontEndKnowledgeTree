---
title: vue基础其他
order: 2
nav: VUE框架
---

## 组件定义

### 组合式API组件定义

使用构建步骤时，我们一般会将 Vue 组件定义在一个单独的 `.vue` 文件中，这被叫做[单文件组件](https://cn.vuejs.org/guide/scaling-up/sfc.html) (简称 SFC)：

```jsx | pure
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

当不使用构建步骤时，一个 Vue 组件以一个包含 Vue 特定选项的 JavaScript 对象来定义：

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // 也可以针对一个 DOM 内联模板：
  // template: '#my-template-element'
}
```

这里的模板是一个内联的 JavaScript 字符串，Vue 将会在运行时编译它。你也可以使用 ID 选择器来指向一个元素 (通常是原生的 `<template>` 元素)，Vue 将会使用其内容作为模板来源。

### 选项式API组件定义

选项式API，示例：

```jsx | pure
<template>
  <div @click="handleClick">
    {{ computedMessage }}
  </div>
</template>

<script>
import MyComponent from './MyComponent.vue';

export default {
  name: 'ExampleComponent',

  components: {
    MyComponent,
  },

  props: {
    message: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      localMessage: 'Hello Vue!',
    };
  },

  computed: {
    computedMessage() {
      return this.localMessage + this.message;
    },
  },

  watch: {
    message(newVal, oldVal) {
      console.log('Message changed from', oldVal, 'to', newVal);
    },
  },

  methods: {
    handleClick() {
      this.$emit('click', this.localMessage);
    },
  },

  created() {
    console.log('Component is created!');
  },

  // ...其他生命周期钩子、选项等
};
</script>
```

## 插槽

### [默认内容](https://cn.vuejs.org/guide/components/slots.html#fallback-content)

在外部没有提供任何内容的情况下，可以为插槽指定默认内容。比如有这样一个 `<SubmitButton>` 组件：

```jsx | pure
<button type="submit">
  <slot></slot>
</button>
```

默认值：如果我们想在父组件没有提供任何插槽内容时在 `<button>` 内渲染“Submit”，只需要将“Submit”写在 `<slot>` 标签之间来作为默认内容

```jsx | pure
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```

父级使用

```jsx | pure
<SubmitButton>Save</SubmitButton>
```

### [具名插槽](https://cn.vuejs.org/guide/components/slots.html#named-slots)

有时在一个组件中包含多个插槽出口是很有用的。子级：

```jsx | pure
<div class="container">
  <header>
    <!-- 标题内容放这里 -->
  </header>
  <main>
    <!-- 主要内容放这里 -->
  </main>
  <footer>
    <!-- 底部内容放这里 -->
  </footer>
</div>
```

对于这种场景，`<slot>` 元素可以有一个**特殊的 attribute `name`**，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容，**插槽组件：**

```jsx | pure
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

这类带 `name` 的插槽被称为具名插槽 (named slots)。没有提供 `name` 的 `<slot>` 出口会隐式地命名为“default”。

要为具名插槽传入内容，我们需要使用一个含 **`v-slot` 指令**的 `<template>` 元素，并将目标插槽的名字传给该指令：

```jsx | pure
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
```

`v-slot` 有对应的**简写 `#`**，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。

**调用插槽的组件：**

```jsx | pure
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：

```jsx | pure
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

最终渲染出的 HTML 如下：

```jsx | pure
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

### [动态插槽名](https://cn.vuejs.org/guide/components/slots.html#dynamic-slot-names)

[动态指令参数](https://cn.vuejs.org/guide/essentials/template-syntax.html#dynamic-arguments)在 `v-slot` 上也是有效的，即可以定义下面这样的动态插槽名：

```jsx | pure
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

注意这里的表达式和动态指令参数受相同的[语法限制](https://cn.vuejs.org/guide/essentials/template-syntax.html#directives)。

## 常用api

### nextTick()

等待下一次 DOM 更新刷新的工具方法。

- **类型**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **详细信息**

  当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

  `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

- **示例**

  ```jsx | pure
  <script setup>
  import { ref, nextTick } from 'vue'
  
  const count = ref(0)
  
  async function increment() {
    count.value++
  
    // DOM 还未更新
    console.log(document.getElementById('counter').textContent) // 0
  
    await nextTick()
    // DOM 此时已经更新
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>
  
  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

### defineComponent()

`defineComponent` 是一个核心 API，它用于定义一个 Vue 组件。这个函数不仅用于创建组件，还为 TypeScript 提供了类型推断。

使用 `defineComponent` 的主要好处之一，特别是在使用 TypeScript 时，是它能提供更强大的类型推断。

当你在组件选项内部定义 `props`, `data`, `methods` 等时，TypeScript 能够正确地推断它们的类型，从而为你在组件内部编写代码提供更好的智能提示和错误检查。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    propA: Number,
    propB: String
  },
  data() {
    return {
      message: 'Hello, Vue!'
    }
  },
  methods: {
    greet() {
      console.log(this.message)  // TypeScript 知道 `message` 是一个字符串
      console.log(this.propA)    // TypeScript 知道 `propA` 是一个数字或者 undefined
    }
  }
})
```

