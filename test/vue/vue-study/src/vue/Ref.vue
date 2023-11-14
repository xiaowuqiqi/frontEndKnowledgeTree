<script setup>
import {reactive,ref} from 'vue';
let state = reactive({count:0})
let count1 = ref(0)
</script>

<template>
  <article>
    <header>Ref</header>
    <section>
      <button @click="state.count = state.count+1">reactive1</button>
      <div>
        {{state.count}}
      </div>
      <button @click="count1 = count1+1">reactive1</button>
      <div>
        {{count1}}
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>
