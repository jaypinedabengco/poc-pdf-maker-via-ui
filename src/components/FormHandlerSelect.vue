<template lang="pug">
    section.form-handler-select
        select(v-model="formDefinition.value" :name="formDefinition.ref_id")
          option(v-for="option in formDefinition.options" :value="option") {{option}}
</template>

<script>
export default {
  name: 'FormHandlerContainerSelect',
  props: ['formDefinition']
}
</script>

<style scoped>
</style>
