<template>
  <div>
    <h1>PDFMake Viewer Demo</h1>

    <div id="pdf-form-container">
        <form>

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
  data() {
    return {
      formDefinition: null,
      base64PreviewSrc: null
    };
  },
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
  methods: {
    getFormDefinition() {
      return new Promise((resolve, reject) => {
        // build
        let formDefinition = {
          form_body: [
            {
              id: "123-firstname",
              type: "text",
              width: "50%",
              label: "Firstname"
            },
            {
              id: "123-lastname",
              type: "text",
              width: "50%",
              label: "Lastname"
            }
          ]
        };
        resolve(formDefinition);
      });
    },
    updateFromForm() {
      return new Promise((resolve, reject) => {
        let logo_image = "/static/sample-data/images/header-logo/rta.png";
        // convert image to base64
        this.convertImageUrlToBase64ViaFileReader(logo_image)
          .then(base64_logo_image => {
            let docDefinition = {
              pageMargins: [20, 80, 20, 60],
              header: {
                margin: [20, 20, 20, 10],
                columns: [
                  {
                    stack: [
                      {
                        columns: [
                          {
                            text: "Entry notice",
                            bold: true,
                            margin: [0, 0, 5, 0],
                            fontSize: 15,
                            width: "auto"
                          },
                          {
                            text: {
                              text: "(Form 9)",
                              fontSize: 15,
                              width: "auto"
                            }
                          }
                        ]
                      },
                      {
                        text: "Residential Tenancies and Rooming Accomodation Act 2008",
                        italics: true,
                        fontSize: 8
                      },
                      {
                        text: "(Sections 192-199)",
                        italics: true,
                        fontSize: 8
                      }
                    ]
                  },
                  {
                    image: base64_logo_image,
                    width: 80,
                    alignment: "right"
                  }
                ]
              },
              content: {
                text: "hello owwlrd"
              }
            };
            pdfMake.createPdf(docDefinition).getDataUrl(dataUrl => {
              this.base64PreviewSrc = dataUrl;
              resolve(dataUrl);
            });
          })
          .catch(err => console.log("issue", err));
      });
    }
  }
};
</script>

<style scoped>
</style>
