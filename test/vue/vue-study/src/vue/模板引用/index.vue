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
<style scoped>
</style>
