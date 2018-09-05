<template lang="pug">
    section.form-handler-checkbox
        input(type="checkbox" v-model="formDefinition.value" :name="formDefinition.ref_id")
</template>

<script>
export default {
  name: "FormHandlerContainerCheckbox",
  props: ["formDefinition"]
};
</script>

<style scoped>
.form-handler-label > p {
  margin-top: 0;
  margin-bottom: 0;
  margin-left:0;
  margin-right:10px;
  font-weight: bold;
}
</style>