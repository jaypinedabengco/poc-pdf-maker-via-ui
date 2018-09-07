<template lang="pug">
    div
        h1 PDFMake Viewer Demo
        router-link(:to="`/pdfmake/view`") Go Back to List
        h3 for Form {{formName}}
        div#pdf-form-container(v-if="formDefinition")
            form
                form-builder(:form-definition="formDefinition")
            button(@click="updatePDFPreview") update preview
            button(@click="saveOrUpdateForm") {{formDefinition.storageDefinition ? 'update' : 'save'}}
            |  {{saveOrUpdateMessage}}
        div#pdf-form-preview-container
            iframe(v-if="base64PreviewSrc" type="application/pdf" :src="base64PreviewSrc" width="100%;" height="800px;")
            div(v-else) building
</template>

<script>
import * as pdfMake from 'pdfmake/build/pdfmake.js'
import vfsFonts from 'pdfmake/build/vfs_fonts'
import pdfMakeBuilderMixin from '@/mixins/pdfMakeBuilderMixin'
import pdfMakeDemoCRUDMixin from '@/mixins/pdfMakeDemoCRUDMixin'
import axios from 'axios'
import FormBuilder from '@/components/FormBuilder'

// initialize vfsFonts, there seems
// to be an issue with loading fonts
// NOTE: try to find a better fix for this.
let { vfs } = vfsFonts.pdfMake
pdfMake.vfs = vfs

export default {
  name: 'PdfMakeViewerDemoBackup',
  mixins: [pdfMakeBuilderMixin, pdfMakeDemoCRUDMixin],
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
      isChangeOngoing: false,
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
  created () {
    // set formName
    this.formName = this.$route.params.form_name
    // if has form id, then edit mode
    if (this.$route.params.form_id) {
      this.formId = this.$route.params.form_id
    }

    // get form definition , if no id, then get via api (fresh), if has one, then get from crud storage
    let getFormDefinitionRequest = !this.formId ? this.getFreshFormDefinition(this.formName) : this.getFormDefinition(this.formId)

    // get form data
    getFormDefinitionRequest
      // set data form definition
      .then(formDefinition => (this.formDefinition = formDefinition))
      .then(() => console.log('successfully fetched form'))
      .catch(err => {
        this.formDefinition = null
        console.log('something went wrong', err)
        alert(err)
      })
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
    saveOrUpdateForm () {
      this.saveOrUpdateFormDefinition(this.formName, this.formDefinition).then(
        updatedFormDefinition => {
          this.$set(this.formDefinition['storageDefinition'], updatedFormDefinition.storageDefinition)
          this.$forceUpdate()
          this.saveOrUpdateMessage = 'updated!'
        }
      )
    },

    /**
     *
     */
    updatePDFPreview () {
      return new Promise((resolve, reject) => {
        return (
          Promise.resolve()
            // will use api
            .then(() => this.getDocDefinitionFromAPI())
            .then(docDefinition =>
              this.updateDocumentDefinitionBasedOnFormDefinition(
                docDefinition,
                this.formDefinition
              )
            )
            .then(docDefinition => {
              return this.getPDFInBase64(pdfMake.createPdf(docDefinition))
            })
            // set to 'pdfInBase64' data
            .then(pdfInBase64 => (this.base64PreviewSrc = pdfInBase64))
            .then(resolve)
            .catch(reject)
        )
      })
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
