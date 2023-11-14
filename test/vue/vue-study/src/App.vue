<script setup>
import RTBtn from './util/RTBtn.vue'
import Ref from './vue/Ref.vue'
import Computed from './vue/Computed.vue'
import Watch from './vue/Watch.vue'
import W_c from './vue/对比computed与watch.vue'
import Period from './vue/生命周期.vue'
import TemplateRefs from './vue/模板引用/index.vue'
import VModel from './vue/实现vModel接口/index.vue'
import Attri from './vue/透传attribute/index.vue'
import StoreDemo from './vue/全局状态管理/index.vue'
import Async from './vue/异步组件/index.vue'

</script>

<template>
  <main>
    <RTBtn btnText="响应式属性"><Ref /></RTBtn>
    <RTBtn btnText="computed学习"><Computed /></RTBtn>
    <RTBtn btnText="watch学习"><Watch /></RTBtn>
    <RTBtn btnText="对比computed与watch"><W_c /></RTBtn>
    <RTBtn btnText="生命周期"><Period /></RTBtn>
    <RTBtn btnText="模板引用父子"><TemplateRefs /></RTBtn>
    <RTBtn btnText="实现v-model接口"><VModel /></RTBtn>
    <RTBtn btnText="透传attribute"><Attri /></RTBtn>
    <RTBtn btnText="全局状态管理"><StoreDemo /></RTBtn>
    <RTBtn btnText="异步组件"><Async /></RTBtn>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
