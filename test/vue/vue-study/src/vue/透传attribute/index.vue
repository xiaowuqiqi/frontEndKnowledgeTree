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
