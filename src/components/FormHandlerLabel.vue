<template lang="pug">
    section.form-handler-label
        p {{formDefinition.value}}
        slot(name="child-container")
</template>

<script>
export default {
  name: "FormHandlerContainerLabel",
  props: ["formDefinition"]
};
</script>

<style scoped>
.form-handler-label > p {
  margin-top: 0;
  margin-bottom: 0;
  margin-left:10px;
  margin-right:10px;
  font-weight: bold;
}
</style>