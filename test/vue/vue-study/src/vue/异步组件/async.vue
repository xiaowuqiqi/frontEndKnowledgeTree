<script setup>
import {defineProps, watch, ref} from 'vue'

// 使用 defineProps 获取父组件传递的 props
const props = defineProps(['select']);

// 定义一个响应式引用来存储异步操作的结果
const asyncResult = ref(null);

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
