<template lang="pug">
    div.pdfmake-viewer-list-demo
        h1 PDFMake Viewer Demo List
        h3 Create
        li(v-for="form in forms" v-bind:key="form.id") 
          router-link(:to="`/pdfmake/view/${form.id}`") {{form.name}}
        h3 Edit
        div(v-if="!savedForms.length")
          h4 No forms to Edit
        div(v-else)
          table
            tr
              th 
                | id
              th 
                | Form
              th 
                | Date Created
              th 
                | Date Last Updated
              th 
                | Actions 
            tr(v-for="savedForm in savedForms" v-bind:key="savedForm.id") 
              td 
                | {{savedForm.id}}
              td 
                | {{savedForm.form_name}}
              td
                | {{savedForm.date_created_formatted}}
              td
                | {{savedForm.date_updated_formatted || 'New'}}
              td
                router-link(:to="`/pdfmake/view/${savedForm.form_name}/${savedForm.id}`") Edit 
                | | 
                a( href="#" @click.prevent="deleteForm(savedForm.id)") Delete
          
</template>

<script>
import pdfMakeDemoCRUDMixin from "@/mixins/pdfMakeDemoCRUDMixin";

export default {
  name: "PdfMakeViewerListDemo",
  mixins: [pdfMakeDemoCRUDMixin],
  created() {
    // fetch from crud mixin
    this.updateSavedListForms();
  },
  methods: {
    deleteForm(formId) {
      this.deleteFormDefinition(formId).then(() => {
        // remove from list
        this.updateSavedListForms();
      });
    },
    updateSavedListForms() {
      this.getAllFormDefinitions().then(formDefinitions => {
        this.savedForms = formDefinitions;
      });
    }
  },
  data() {
    return {
      forms: [
        {
          id: "entry-notice-form-9",
          name: "Entry Notice Form 9"
        }
      ],
      savedForms: []
    };
  }
};
</script>

<style scoped>
td,
th {
  padding: 10px;
  border: 1px solid;
}
</style>
