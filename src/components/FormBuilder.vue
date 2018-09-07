<template lang="pug">
    span#form-builder(:class="`form-type-${formDefinition.type}`")
        //- If container, then do recursive build
        form-handler-container(v-if="formDefinition.type == 'container'" :form-definition="formDefinition")
            form-builder(slot="child-container" v-if="formDefinition.children" v-for="childFormDefinition in formDefinition.children"  v-bind:key="childFormDefinition.ref_id" :form-definition="childFormDefinition")
        form-handler-label(v-else-if="formDefinition.type == 'label'" :form-definition="formDefinition")
        form-handler-text(v-else-if="formDefinition.type == 'text'" :form-definition="formDefinition")
        form-handler-checkbox(v-else-if="formDefinition.type == 'checkbox'" :form-definition="formDefinition")
        form-handler-select(v-else-if="formDefinition.type == 'select'" :form-definition="formDefinition")
        form-handler-date-picker(v-else-if="formDefinition.type == 'date-picker'" :form-definition="formDefinition")
        span(v-else)
            | unknown type of {{formDefinition.type}}
</template>

<script>
import FormHandlerContainer from "@/components/FormHandlerContainer";
import FormHandlerLabel from "@/components/FormHandlerLabel";
import FormHandlerText from "@/components/FormHandlerText";
import FormHandlerCheckbox from "@/components/FormHandlerCheckbox";
import FormHandlerSelect from "@/components/FormHandlerSelect";
import FormHandlerDatePicker from "@/components/FormHandlerDatePicker";

export default {
  name: "FormBuilder",
  props: ["formDefinition"],
  components: {
      "form-handler-container": FormHandlerContainer,
      "form-handler-label": FormHandlerLabel,
      "form-handler-text": FormHandlerText,
      "form-handler-checkbox": FormHandlerCheckbox, 
      "form-handler-select": FormHandlerSelect, 
      "form-handler-date-picker": FormHandlerDatePicker
  }
};
</script>

<style scoped>
</style>
