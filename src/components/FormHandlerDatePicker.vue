<template lang="pug">
    section.form-handler-date-picker
       date-picker(v-model="formDefinition.value" :name="formDefinition.ref_id" :format="format")
</template>

<script>
import DatePicker from "vuejs-datepicker";
import DateService from "@/services/DateService";

export default {
  name: "FormHandlerContainerDatePicker",
  props: ["formDefinition"],
  components: {
    "date-picker": DatePicker
  },
  created() {
    let format = this.formDefinition.format;

    // handle library specific formatting
    if (format) {
      format = DateService.changeDateFormatForVueJSDatePicker(
        format
      );
      // apply to data 'format'
      // which will be used on the library specific datepicker
      this.format = format;
    }
  },
  data() {
    return {
      // set default formating, based on library used
      format: "dd/MM/yyyy"
    };
  }
};
</script>

<style scoped>
</style>