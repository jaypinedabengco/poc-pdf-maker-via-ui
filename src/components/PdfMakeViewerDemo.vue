<template lang="pug">
    div
        h1 PDFMake Viewer Demo
        div#pdf-form-container(v-if="formDefinition")
            form
                form-builder(:form-definition="formDefinition")
            button(@click="updatePDFPreview") update
        div#pdf-form-preview-container
            iframe(v-if="base64PreviewSrc" type="application/pdf" :src="base64PreviewSrc" width="100%;" height="800px;")
            div(v-else) building
</template>

<script>
import * as pdfMake from "pdfmake/build/pdfmake.js";
import vfsFonts from "pdfmake/build/vfs_fonts";
import pdfMakeBuilderMixin from "@/mixins/pdfMakeBuilderMixin";
import axios from "axios";
import FormBuilder from "@/components/FormBuilder";

// initialize vfsFonts, there seems
// to be an issue with loading fonts
// NOTE: try to find a better fix for this.
let { vfs } = vfsFonts.pdfMake;
pdfMake.vfs = vfs;

export default {
  name: "PdfMakeViewerDemo",
  mixins: [pdfMakeBuilderMixin],
  components: {
    "form-builder": FormBuilder
  },

  // -- DATA
  data() {
    return {
      formName: null,
      formDefinition: null,
      baseDefinition: null,
      base64PreviewSrc: null
    };
  },

  // -- CREATED
  created() {
    // set formName
    this.formName = this.$route.params.form_name;

    // get form data
    this.getFormDefinition(this.formName)
      // set data form definition
      .then(formDefinition => (this.formDefinition = formDefinition))
      //trigger form build
      .then(() => this.updatePDFPreview())
      .then(() => console.log("successfully built form"))
      .catch(err => {
        this.formDefinition = null;
        console.log("something went wrong", err);
        alert(err);
      });
  },

  // -- METHODS
  methods: {
    getFormDefinition(form_name) {
      // get form
      return axios
        .get(`/static/sample-data/json/formDefinition/${form_name}.json`)
        .then(result => {
          return result.data;
        });
    },

    /**
     *
     */
    updatePDFPreview() {
      return new Promise((resolve, reject) => {
        return (
          Promise.resolve()
            // will use api
            .then(() => this.getDocDefinitionFromAPI())
            .then(docDefinition => {
              return this.getPDFInBase64(pdfMake.createPdf(docDefinition));
            })
            // set to 'pdfInBase64' data
            .then(pdfInBase64 => (this.base64PreviewSrc = pdfInBase64))
            .then(resolve)
            .catch(reject)
        );
      });
    },

    /**
     * Build doc definition via API
     * - simulate if doc definition
     *   building is done via API
     */
    getDocDefinitionFromAPI() {
      // target behaviour is that we send field id & value
      // along with form id or something...
      // & backend api will auto build the doc definition along with content
      return axios
        .get(`/static/sample-data/json/docDefinition/${this.formName}.json`)
        .then(result => {
          return result.data;
        });
    },

    /**
     * Build doc definition using builder
     * indicated on client local services
     * // under construction
     */
    getDocDefinitionFromForm() {
      return new Promise((resolve, reject) => {
        // convert formDefinition to documentDefinition
        Promise.all([
          this.getDocumentHeaderDefinition(this.formDefinition),
          this.getDocumentContentDefinition(this.formDefinition),
          this.getDocumentFooterDefinition(this.formDefinition)
        ]).then(definitions => {
          let headerDefinition = definitions[0];
          let contentDefinition = definitions[1];
          let footerDefinition = definitions[2];

          let docDefinition = {
            pageMargins: [20, 80, 20, 60],
            header: headerDefinition,
            content: contentDefinition,
            footer: footerDefinition
          };
          return resolve(docDefinition);
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
