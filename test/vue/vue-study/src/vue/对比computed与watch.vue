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

// 初始化时：
// computed 不会立即打印 log，直到 doubleCount 被访问
// watchEffect 会立即打印一次 log，即 "watchEffect is running 0"
count.value++;
setTimeout(()=>{
  count.value++;
})


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
