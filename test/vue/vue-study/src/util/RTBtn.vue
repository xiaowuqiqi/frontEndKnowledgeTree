
<script setup>
import {ref} from 'vue'
defineProps(['btnText'])
const hidden = ref(false)
</script>

<template>
  <article>
    <button v-if="!hidden" @click="()=>hidden = true">{{ btnText }}</button>
    <section v-if="hidden">
      <button v-if="hidden" @click="()=>hidden = false">返回</button>
      <slot>空</slot>
    </section>
  </article>
</template>

<style scoped>

</style>
