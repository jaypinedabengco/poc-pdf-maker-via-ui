<template lang="pug">
    section.form-handler-label
        p {{formDefinition.value}}
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
  margin-left:0;
  margin-right:10px;
  font-weight: bold;
}
</style>