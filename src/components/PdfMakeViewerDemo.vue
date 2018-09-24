<template lang="pug">
    div
        h1 PDFMake Viewer Demo
        router-link(:to="`/pdfmake/view`") Go Back to List
        h3 for Form {{formName}}
        div#pdf-form-container(v-if="formDefinition")
            form
                form-builder(:form-definition="formDefinition")
            button(@click="updatePDFPreview") update preview
            button(@click="saveOrUpdateForm") {{formId ? 'update' : 'save'}}
            |  {{saveOrUpdateMessage}}
            button(@click="testExtractFormContent") test
        div#pdf-form-preview-container
            iframe(v-if="base64PreviewSrc" type="application/pdf" :src="base64PreviewSrc" width="100%;" height="800px;")
            div(v-else) building
</template>

<script>
import * as pdfMake from 'pdfmake/build/pdfmake.js'
import vfsFonts from 'pdfmake/build/vfs_fonts'
import pdfMakeBuilderMixin from '@/mixins/pdfMakeBuilderMixin'
import axios from 'axios'
import FormBuilder from '@/components/FormBuilder'
import FormDefinitionContentCRUD from '@/classes/FormDefinitionContentCRUD'

// initialize vfsFonts, there seems
// to be an issue with loading fonts
// NOTE: try to find a better fix for this.
let { vfs } = vfsFonts.pdfMake
pdfMake.vfs = vfs

let formDefinitionContentCRUD = new FormDefinitionContentCRUD()

export default {
  name: 'PdfMakeViewerDemo',
  mixins: [pdfMakeBuilderMixin],
  components: {
    'form-builder': FormBuilder
  },

  watch: {
    formDefinition: {
      handler () {
        // remove any update message
        this.saveOrUpdateMessage = ''

        // trigger update of pdf preview on change
        // prevent always trigger update on change
        // clear timeout if has one
        if (this.changeOngoingCheckerTimeout) {
          clearTimeout(this.changeOngoingCheckerTimeout)
        }

        // run timeout checker
        this.changeOngoingCheckerTimeout = setTimeout(() => {
          this.updatePDFPreview()
        }, 500) // in millis
      },
      deep: true
    }
  },

  // -- DATA
  data () {
    return {
      changeOngoingCheckerTimeout: null,
      formName: null,
      formId: null,
      formDefinition: null,
      baseDefinition: null,
      base64PreviewSrc: null,
      saveOrUpdateMessage: ''
    }
  },

  // -- CREATED
  async created () {
    try {
      // set formName
      this.formName = this.$route.params.form_name

      // get form definition , if no id, then get via api (fresh), if has one, then get from crud storage
      this.formDefinition = await this.getFreshFormDefinition(this.formName)

      // if has form id, then edit mode
      if (this.$route.params.form_id) {
        this.formId = this.$route.params.form_id

        let fetchedFormContent = await formDefinitionContentCRUD.getContent(this.formId)
        console.log('fetchedFormContent', fetchedFormContent)
        await this.populateContentToFormDefinition(fetchedFormContent, this.formDefinition)
        // get saved content
        // then prepopulate content to formDefinition
      }
    } catch (error) {
      this.formDefinition = null
      console.log('something went wrong', error)
      alert(error)
    }
  },

  // -- METHODS
  methods: {
    getFreshFormDefinition (formName) {
      // get form
      return axios
        .get(`/static/sample-data/json/formDefinition/${formName}.json`)
        .then(result => {
          return result.data
        })
    },

    /**
     *
     */
    async saveOrUpdateForm () {
      // extract form definition values and building specific contents, like type &/or format
      let formDefinitionContent = await this.extractFieldValueFromFormDefinition(this.formDefinition)
      // if has form id, then update
      if (this.formId) {
        await formDefinitionContentCRUD.update(this.formId, formDefinitionContent)
      } else {
        await formDefinitionContentCRUD.save(formDefinitionContent, this.formName)
          .then(formDefinitionSave => {
            // update id
            this.formId = formDefinitionSave.id
            console.log('this.formId', this.formId)
          })
      }

      this.saveOrUpdateMessage = 'updated!'
    },

    /**
     *
     */
    async updatePDFPreview () {
      try {
        // get document definition from API (fresh)
        let documentDefinition = await this.getDocDefinitionFromAPI()
        // extract form definition values and building specific contents, like type &/or format
        let formDefinitionValues = await this.extractFieldValueFromFormDefinition(this.formDefinition)

        // update document definition based on form definition values
        let updatedDocumentDefinition = await this.updateDocumentDefinitionBasedOnFormDefinitionContent(documentDefinition, formDefinitionValues)
        // create pdf using pdfmake
        let createdPdf = pdfMake.createPdf(updatedDocumentDefinition)

        // put converted base64 value to component data
        this.base64PreviewSrc = await this.getPDFInBase64(createdPdf)
      } catch (error) {
        console.log('error', error)
        throw error
      }
    },

    /**
     * Build doc definition via API
     * - simulate if doc definition
     *   building is done via API
     */
    getDocDefinitionFromAPI () {
      // target behaviour is that we send field id & value
      // along with form id or something...
      // & backend api will auto build the doc definition along with content
      return axios
        .get(`/static/sample-data/json/docDefinition/${this.formName}.json`)
        .then(result => {
          return result.data
        })
    },

    testExtractFormContent () {
      (async () => {
        let extractedFormDefinition = await this.extractFieldValueFromFormDefinition(this.formDefinition)
        console.log('extractedFormDefinition', extractedFormDefinition)
      })()
    },

    /**
     * Build doc definition using builder
     * indicated on client local services
     * // under construction
     */
    getDocDefinitionFromForm () {
      return new Promise((resolve, reject) => {
        // convert formDefinition to documentDefinition
        Promise.all([
          this.getDocumentHeaderDefinition(this.formDefinition),
          this.getDocumentContentDefinition(this.formDefinition),
          this.getDocumentFooterDefinition(this.formDefinition)
        ]).then(definitions => {
          let headerDefinition = definitions[0]
          let contentDefinition = definitions[1]
          let footerDefinition = definitions[2]

          let docDefinition = {
            pageMargins: [20, 80, 20, 60],
            header: headerDefinition,
            content: contentDefinition,
            footer: footerDefinition
          }
          return resolve(docDefinition)
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
