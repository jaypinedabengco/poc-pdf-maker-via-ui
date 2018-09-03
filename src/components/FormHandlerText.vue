<template lang="pug">
    section.form-handler-text
        input(type="text" v-model="formDefinition.value" :name="formDefinition.ref_id")
        slot(name="child-container")
</template>

<script>
export default {
  name: "FormHandlerContainerText",
  props: ["formDefinition"]
};
</script>

<style scoped>
.form-handler-text {
  color: red;
}
</style>