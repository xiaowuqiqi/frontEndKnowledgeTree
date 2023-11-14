<script setup>
import {initStore} from'./store'
import Children1 from './components/children1.vue'
import Children2 from './components/children2.vue'
initStore()
</script>
<template>
  <div>
    <Children1 />
    <Children2 />
  </div>
</template>
