<template lang="pug">
    section.form-handler-container(:class="formDefinition.children_view == 'horizontal' ? 'horizontal-children-view' : 'vertical-children-view'")
        slot(name="child-container")
</template>

<script>

export default {
  name: 'FormHandlerContainer',
  props: ['formDefinition']
}
</script>

<style scoped>
.horizontal-children-view > * {
  display: inline-block;
}
</style>
