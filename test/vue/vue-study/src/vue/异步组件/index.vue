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
