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
<style scoped>

</style>
