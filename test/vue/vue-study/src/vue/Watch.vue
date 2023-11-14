<script setup>
import {reactive, ref, watch} from 'vue';

let reactive1 = reactive({count: 0})
let ref1 = ref(0)
watch([ref1, () => reactive1.count], ([num1, num2]) => {
  console.log(num1, num2)
  console.log('watch调用') // 在更新前
})
</script>

<template>
  <article>
    <header>Watch</header>
    <section>
      <button @click="()=>{
        ref1 = ref1+1;
        reactive1.count = reactive1.count+1;
      }">btn</button>
      <div>
        {{ console.log('组件更新') }}
        {{ ref1 }}
        {{ reactive1.count }}
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>
