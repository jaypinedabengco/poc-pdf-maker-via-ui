<template>
  <div>
    <h1>PDFMake Viewer Demo</h1>

    <div v-if="formDefinition" id="pdf-form-container">
        <form>
            <div v-for="(form_input) in formDefinition.form_body" v-bind:key="form_input.id">
                <label :for="form_input.id">{{form_input.label.value}}</label>
                <input @change="updateFromForm" v-model="form_input.value" v-if="form_input.type == 'text'" type="text" :name="form_input.id"/>
            </div>
        </form>

        <button @click="updateFromForm">update</button>
    </div>

    <div id="pdf-form-preview-container">
        <iframe v-if="base64PreviewSrc" type="application/pdf" :src="base64PreviewSrc" width="100%" height="500px;">
        </iframe>
        <div v-else>Building....</div>
    </div>
  </div>
</template>

<script>
import * as pdfMake from "pdfmake/build/pdfmake.js";
import vfsFonts from "pdfmake/build/vfs_fonts";
import pdfMakeBuilderMixin from "@/mixins/pdfMakeBuilderMixin.ts";

// initialize vfsFonts, there seems
// to be an issue with loading fonts
// NOTE: try to find a better fix for this.
let { vfs } = vfsFonts.pdfMake;
pdfMake.vfs = vfs;

export default {
  name: "PdfMakeViewerDemo",
  mixins: [pdfMakeBuilderMixin],

  // -- DATA
  data() {
    return {
      formDefinition: null,
      base64PreviewSrc: null
    };
  },

  // -- CREATED
  created() {
    // get form data
    this.getFormDefinition()
      // set data form definition
      .then(formDefinition => (this.formDefinition = formDefinition))
      //trigger form build
      .then(() => this.updateFromForm())
      .then(() => console.log("successfully built form"))
      .catch(err => console.log("something went wrong", err));
  },

  // -- METHODS
  methods: {
    getFormDefinition() {
      return new Promise((resolve, reject) => {
        // build
        let formDefinition = {
          form_body: [
            {
              id: "123-firstname",
              type: "text",
              width: "500",
              label: {
                value: "Firstname",
                margin: [0, 0, 0, 0],
                bold: true
              },
              inputLine: {
                type: "box"
              }
            },
            {
              id: "123-lastname",
              type: "text",
              width: "500",
              label: {
                value: "Lastname",
                margin: [0, 0, 0, 0]
              },
              inputLine: {
                type: "dotted"
              }
            }
          ]
        };
        resolve(formDefinition);
      });
    },
    updateFromForm() {
      return new Promise((resolve, reject) => {
        // convert formDefinition to documentDefinition
        Promise.all([
          this.getDocumentHeaderDefinition(this.formDefinition),
          this.getDocumentContentDefinition(this.formDefinition),
          this.getDocumentFooterDefinition(this.formDefinition)
        ])
          .then(definitions => {
            let headerDefinition = definitions[0];
            let contentDefinition = definitions[1];
            let footerDefinition = definitions[2];

            let docDefinition = {
              pageMargins: [20, 80, 20, 60],
              header: headerDefinition,
              content: contentDefinition,
              footer: footerDefinition
            };

            return pdfMake.createPdf(docDefinition).getDataUrl(dataUrl => {
              this.base64PreviewSrc = dataUrl;
              resolve(dataUrl);
            });
          })
          .then(() => console.log("successfully updated"))
          .catch(err => console.log("issue", err));
      });
    }
  }
};
</script>

<style scoped>
</style>
