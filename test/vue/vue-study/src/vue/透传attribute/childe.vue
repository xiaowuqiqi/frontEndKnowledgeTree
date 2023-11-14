<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
<template>
  <article>
    <header>儿子</header>
    <div>
      <button @click="$attrs.onClick1">儿子btn</button>
    </div>
  </article>
</template>
