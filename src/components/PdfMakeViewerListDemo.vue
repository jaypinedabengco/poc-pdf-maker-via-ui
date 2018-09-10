<template lang="pug">
    div.pdfmake-viewer-list-demo
        h1 PDFMake Viewer Demo List
        h3 Add
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
                | {{savedForm.formName}}
              td
                | {{savedForm.formattedDateCreated}}
              td
                | {{savedForm.formattedDateUpdated || 'New'}}
              td
                router-link(:to="`/pdfmake/view/${savedForm.formName}/${savedForm.id}`") Edit
                | |
                a( href="#" @click.prevent="deleteForm(savedForm.id)") Delete
</template>

<script>
import FormDefinitionContentCRUD from '@/classes/FormDefinitionContentCRUD'

let formDefinitionContentCRUD = new FormDefinitionContentCRUD()

export default {
  name: 'PdfMakeViewerListDemo',
  created () {
    // fetch from crud mixin
    this.updateSavedListForms()
  },
  methods: {
    async deleteForm (formId) {
      return formDefinitionContentCRUD.delete(formId).then(() => this.updateSavedListForms())
    },
    async updateSavedListForms () {
      formDefinitionContentCRUD.getList()
        .then(savedForms => {
          console.log('savedForms', savedForms)
          this.savedForms = savedForms
        })
    }
  },
  data () {
    return {
      forms: [
        {
          id: 'entry-notice-form-9',
          name: 'Entry Notice Form 9'
        }
      ],
      savedForms: []
    }
  }
}
</script>

<style scoped>
td,
th {
  padding: 10px;
  border: 1px solid;
}
</style>
