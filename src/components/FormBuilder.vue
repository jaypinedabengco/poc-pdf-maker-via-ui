<template lang="pug">
    span#form-builder
        form-handler-container(v-if="formDefinition.type == 'container'" :form-definition="formDefinition")
            form-builder(slot="child-container" v-if="formDefinition.children" v-for="childFormDefinition in formDefinition.children"  v-bind:key="childFormDefinition.ref_id" :form-definition="childFormDefinition")
        form-handler-label(v-else-if="formDefinition.type == 'label'" :form-definition="formDefinition")
            form-builder(slot="child-container" v-if="formDefinition.children" v-for="childFormDefinition in formDefinition.children"  v-bind:key="childFormDefinition.ref_id" :form-definition="childFormDefinition")
        form-handler-text(v-else-if="formDefinition.type == 'text'" :form-definition="formDefinition")
            form-builder(slot="child-container" v-if="formDefinition.children" v-for="childFormDefinition in formDefinition.children"  v-bind:key="childFormDefinition.ref_id" :form-definition="childFormDefinition")
        form-handler-checkbox(v-else-if="formDefinition.type == 'checkbox'" :form-definition="formDefinition")
            form-builder(slot="child-container" v-if="formDefinition.children" v-for="childFormDefinition in formDefinition.children"  v-bind:key="childFormDefinition.ref_id" :form-definition="childFormDefinition")
        span(v-else)
            | unknown type of {{formDefinition.type}}
</template>

<script>
import FormHandlerContainer from "@/components/FormHandlerContainer";
import FormHandlerLabel from "@/components/FormHandlerLabel";
import FormHandlerText from "@/components/FormHandlerText";
import FormHandlerCheckbox from "@/components/FormHandlerCheckbox";

export default {
  name: "FormBuilder",
  props: ["formDefinition"],
  components: {
      "form-handler-container": FormHandlerContainer,
      "form-handler-label": FormHandlerLabel,
      "form-handler-text": FormHandlerText,
      "form-handler-checkbox": FormHandlerCheckbox
  }
};
</script>

<style scoped>
</style>
