<script setup>
import {inject} from 'vue';
const store = inject('store');
const createRandomItme = () => {
  return {
    name: 'daItem' + Math.floor(Math.random() * 100),
    age: Math.floor(Math.random() * 10)
  }
}
// 对换两个节点数据
const splite1_2 = () => {
  [store.data[0], store.data[1]] = [store.data[1], store.data[0]]
}

</script>
<template>
  <header>children1</header>
  <button @click="()=>{store.pushData(createRandomItme())}">随机添加一个数据</button>
  <button @click="()=>{splite1_2()}">更换1，2数据</button>

</template>



