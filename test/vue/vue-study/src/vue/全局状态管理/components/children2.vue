<script setup>
import {inject, ref, computed} from 'vue';
const store = inject('store');

let coun1 = ref(0)

// 获取总的年龄
const summaryAge = computed(() => store.getAgeList.reduce(
  (total, item) => item + total
  , 0))
</script>
<template>
  <header>children2</header>
  <!-- 点击刷新视图，store中计算属性不会重新计算 -->
  <button @click="coun1 = coun1+1">测试视图刷新，计算属性不变化</button>
  <div>{{ coun1 }}</div>
  <!-- 数据展示 -->
  <table>
    <tbody>
    <tr>
      <th>名字</th>
      <th>年龄</th>
    </tr>
    <tr v-for="(item,index) in store.data" :key="index">
      <td>{{ item.name }}</td>
      <td>{{ item.age }}</td>
    </tr>
    </tbody>
  </table>
  <div>
    年纪总和：{{ summaryAge }}
  </div>
</template>



