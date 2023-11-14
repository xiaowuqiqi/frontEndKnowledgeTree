<script setup>
import {computed,ref} from 'vue';
let count1 = ref(0)
let str = computed(()=>(count1+'个'))
</script>

<template>
  <article>
    <header>Ref</header>
    <section>
      <button @click="count1 = count1+1">computed1</button>
      <div>
        {{str}}
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>
