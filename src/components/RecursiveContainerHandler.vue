<template lang="pug">
    span
        | i'm a container
        slot(v-if="recursiveData.children" name="child-container")
       
</template>

<script>

export default {
  name: "RecursiveContainerHandler",
  props: ['recursiveData']
};
</script>

<style scoped>
</style>
