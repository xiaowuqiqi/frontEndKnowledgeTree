<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <!--@input="$emit('update:modelValue', $event.target.value)"-->
  <input
    :value="modelValue"
    @input="(e)=>$emit('update:modelValue', e.target.value)"
  />
</template>
