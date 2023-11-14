<script setup>
import {ref} from 'vue';
import Childe from './childe.vue';
const inputData = ref()
</script>
<template>
  <Childe v-model="inputData"/>
  <div>
    {{inputData}}
  </div>
</template>
<style scoped>

</style>
