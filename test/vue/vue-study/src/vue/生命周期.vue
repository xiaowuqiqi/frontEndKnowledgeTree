<script setup>
import {
  ref, onMounted, onBeforeMount, onUpdated, onBeforeUpdate,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

let count = ref(0)
const handleCount = () => {
  count.value = count.value + 1;
}
onBeforeMount(()=>{
  console.log('onBeforeMount')
})
onMounted(()=>{
  console.log('onMounted')
})
onBeforeUpdate(()=>{
  console.log('onBeforeUpdate')
})
onUpdated(()=>{
  console.log('onUpdated')
})
onBeforeUnmount(()=>{
  console.log('onBeforeUnmount')
})
onUnmounted(()=>{
  console.log('onUnmounted')
})
</script>
<template>
  <article>
    <header>生命周期</header>
    <div>
      <button @click="handleCount">
        更新
      </button>
      <div>
        {{ count }}
      </div>
    </div>
  </article>
</template>
<style scoped>

</style>
