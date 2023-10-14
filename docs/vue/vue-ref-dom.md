---
title: vue父子组件
order: 4
nav: VBU
---

## 模板引用

需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 `ref` attribute。

### 获取ref时机

注意**在组件挂载后**才能访问模板引用，要使用 onMounted 或者 watchEffect。

```html
<script setup>
import { ref, onMounted } from 'vue';
// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)
onMounted(() => {
  input.value.focus()
})
// 或者使用 watchEffect
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
})
</script>
<template>
  <input ref="input" />
</template>
```

如果不使用 `<script setup>`，需确保从 `setup()` 返回 ref：

```js
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

选项式api：

```html
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>
```

### **在 v-for 中使用**

```html
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

### 函数方式

`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数：

```html
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

> 注意穿入表达式时需要有冒号
>
> - 使用 `ref` 时，你总是在使用一个静态的字符串作为 `ref` 名称。
> - 使用 `:ref` 时，你在使用一个动态的表达式来确定 `ref` 名称，该表达式会被求值并转换为字符串。

### 组件上的 ref

父子交互，推荐使用使用标准的 props 和 emit 接口来实现父子传值。

ref 就是组件的 `this` 。

使用ref用于父级调用子级的方法：

父级：

```html
<script setup>
import Childe from './childe.vue'
import {ref,onMounted} from 'vue';
let childe = ref(null);
const handleCount = ()=>{
  childe.value.handleCount()
}
onMounted(()=>{
  console.log(childe.value.count1)
})
</script>
<template>
  <article>
    <header>模板引用</header>
    <div>
      <!--错误，ref在渲染后才会获得到，所以需要写成方法-->
      <!--<button @click="childe.value.handleCount">爸爸count1+1</button>-->
      <button @click="handleCount">爸爸count1+1</button>
      <Childe ref="childe"></Childe>
    </div>
  </article>
</template>
```

儿级：

需要 defineExpose 外放属性，ref才能获取到

```html
<script setup>
import {ref,defineExpose} from 'vue';

let count1 = ref(0);
let handleCount = ()=>{
  count1.value = count1.value+1
}
defineExpose({
  count1,
  handleCount
})
</script>
<template>
  <article>
    <header>儿子</header>
    <div>
      <button @click="handleCount">儿子count1+1</button>
      <div>
        {{ count1 }}
      </div>
    </div>
  </article>
</template>
```

## props

用于父级往子级传入数据

### 获取

子级组件获取父级组件传入的值，需要用到 defineProps。

```html
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入

如果你没有使用 `<script setup>`，props 必须以 `props` 选项的方式声明：

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

### 传入

父级传入固定数据：

```html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

动态数据，需要属性前边加上冒号：

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

```html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

### 其他声明方式

除了使用字符串数组来声明 prop 外，还可以使用对象的形式：

```js
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

如果你正在搭配 TypeScript 使用 `<script setup>`，也可以使用类型标注来声明 

```html
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

### **命名格式**

为了和 HTML attribute 对齐，我们通常会将其写为 kebab-case 形式：

```html
<MyComponent greeting-message="hello" />
```

使用

```js
defineProps({
  greetingMessage: String
})
```

```html
<span>{{ greetingMessage }}</span>
```

### 静态 vs. 动态 Prop

```html
<!-- 仅写上 prop 但不传值，会隐式转换为 `true` -->
<BlogPost is-published />

<!-- 虽然 `false` 是静态的值，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :is-published="false" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :is-published="post.isPublished" />
```

```html
<!-- 虽然这个数组是个常量，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :comment-ids="post.commentIds" />
```

```html
<!-- 虽然这个对象字面量是个常量，我们还是需要使用 v-bind -->
<!-- 因为这是一个 JavaScript 表达式而不是一个字符串 -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- 根据一个变量的值动态传入 -->
<BlogPost :author="post.author" />
```

### 打散对象传入

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

以及下面的模板：

```html
<BlogPost v-bind="post" />
```

而这实际上等价于：

```html
<BlogPost :id="post.id" :title="post.title" />
```

### [运行时类型检查](https://cn.vuejs.org/guide/components/props.html#runtime-type-checks)

校验选项中的 `type` 可以是下列这些原生构造函数：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

另外，`type` 也可以是自定义的类或构造函数，Vue 将会通过 `instanceof` 来检查类型是否匹配。例如下面这个类：

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

你可以将其作为一个 prop 的类型：

```js
defineProps({
  author: Person
})
```

Vue 会通过 `instanceof Person` 来校验 `author` prop 的值是否是 `Person` 类的一个实例。

### 其他

**单向数据流**

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```

**prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性**。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

```js
const props = defineProps(['initialCounter'])

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter)
```

**需要对传入的 prop 值做进一步的转换**。在这种情况中，最好是基于该 prop 值定义一个计算属性：

```js
const props = defineProps(['size'])

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase()
```

**boolean转化**

```html
<!-- 等同于传入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同于传入 :disabled="false" -->
<MyComponent />
```



## $emit

用于子级往父级传出数据。

### 基本使用

**父级：**

父组件可以通过 `v-on` 或 `@` 来选择性地监听子组件上抛的事件，就像监听原生 DOM 事件那样

```js
const postFontSize = ref(1)
```

```html
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

**子级：**

子组件可以通过调用内置的 [**`$emit`** 方法](https://cn.vuejs.org/api/component-instance.html#emit)，通过传入事件名称来抛出一个事件，同时需要 defineEmits 声明抛出事件：

```html
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

> 和 `defineProps` 类似，`defineEmits` 仅可用于 `<script setup>` 之中，并且不需要导入。

### **js中使用emit**

 `<script setup>` 中抛出事件，因为此处无法直接访问 $emit：

```html
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

在setup()中使用：

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

## 透传 Attributes

### class

一个父组件使用了这个组件，并且传入了 `class`：

```html
<MyButton class="large" />
```

最后渲染出的 DOM 结果是：

```html
<button class="large">click me</button>
```

### [`v-on` 监听器继承](https://cn.vuejs.org/guide/components/attrs.html#v-on-listener-inheritance)

同样的规则也适用于 `v-on` 事件监听器：

```html
<MyButton @click="onClick" />
```

`click` 监听器会被添加到 `<MyButton>` 的根元素，即那个原生的 `<button>` 元素之上。当原生的 `<button>` 被点击，会触发父组件的 `onClick` 方法。同样的，如果原生 `button` 元素自身也通过 `v-on` 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。

### [禁用 Attributes 继承](https://cn.vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance)

如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

从 3.3 开始你也可以直接在 `<script setup>` 中使用 [`defineOptions`](https://cn.vuejs.org/api/sfc-script-setup.html#defineoptions)：

```html
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

## $attrs

这些透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

```html
<span>Fallthrough attribute: {{ $attrs }}</span>
```

这个 `$attrs` 对象包含了除组件所声明的 `props` 和 `emits` 之外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

有几点需要注意：

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 `foo-bar` 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
- 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

### 更改父级属性施加位置

我们想要所有像 `class` 和 `v-on` 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现：

```html
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>

<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

### js中使用

如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

```html
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果没有使用 `<script setup>`，`attrs` 会作为 `setup()` 上下文对象的一个属性暴露：

```js
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

### 替换emit使用方式

父级：

```html
<script setup>
import Btn from './childe.vue'
import {ref} from 'vue';
let count1 = ref(0);
</script>
<template>
  <article>
    <header>模板引用</header>
    <div>
      <Btn @click1="()=>{
        console.log(count1)
        count1 = count1+1
      }"/>
      <div>
        {{count1}}
      </div>
    </div>
  </article>
</template>
```

子级：

```html
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
<template>
  <article>
    <header>儿子</header>
    <div>
      <button @click="$attrs.onClick1">儿子btn</button>
    </div>
  </article>
</template>
```

