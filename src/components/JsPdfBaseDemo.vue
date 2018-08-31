<template>
  <div>
    <h1>JSPDF Base Demo</h1>
    <div id="html-to-pdf-container">
        <form novalidate class="md-layout">
           <div>
               <label for="firstname" >Firstname</label> <input name="firstname" v-bind:style="[styles.dashedInputStyle]">
               <label for="lastname">Lastname</label> <input name="lastname">
               <label for="firstname" >Firstname</label> <input name="firstname" v-bind:style="[styles.dashedInputStyle]">
               <label for="lastname">Lastname</label> <input name="lastname">
               <label for="firstname" >Firstname</label> <input name="firstname" v-bind:style="[styles.dashedInputStyle]">
               <label for="lastname">Lastname</label> <input name="lastname">
               <label for="firstname" >Firstname</label> <input name="firstname" v-bind:style="[styles.dashedInputStyle]">
               <label for="lastname">Lastname</label> <input name="lastname">
           </div>
        </form>
    </div>
    
    <button @click="togglePreview(false)" name="preview">{{ showPreview ? 'Hide' : 'Show' }} Preview (via HTML2Canvas)</button>
    <button @click="togglePreview(true)" name="preview">{{ showPreview ? 'Hide' : 'Show' }} Preview (via HTML2PDF)</button>
    <button v-show="showPreview" @click="updatePreviewPDF(false)">Update Preview (via HTML2Canvas)</button>
    <button v-show="showPreview" @click="updatePreviewPDF(true)">Update Preview (via HTML2PDF)</button>
    <div v-show="showPreview">
        PREVIEW 
        <iframe v-if="base64PreviewSrc" type="application/pdf" :src="base64PreviewSrc" width="100%" height="5000px;">
        </iframe>
        <div v-else>Building....</div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import pdfBuilderMixin from "@/mixins/pdfBuilderMixin.ts";
import RecursiveComponent from "@/components/RecursiveComponent"

export default {
  name: "JsPdfBaseDemo",
  mixins: [pdfBuilderMixin],
  data() {
    return {
      showPreview: false,
      base64PreviewSrc: null,
      styles: {
        dashedInputStyle: {
          outline: "none!important",
          border: 0,
          "border-bottom": "1px dashed"
        }
      }
    };
  },
  methods: {
    togglePreview(use_html_2_pdf) {
      // if not hidden
      if (!this.showPreview) {
        return this.updatePreviewPDF(use_html_2_pdf);
      }
      this.showPreview = false;
    },
    buildPDF() {
      console.log("pdf build");
    },
    updatePreviewPDF(use_html_2_pdf) {
      let target_element = window.document.getElementById(
        "html-to-pdf-container"
      );

      let base64Promise = use_html_2_pdf
            ? this.getBase64viaHTML2PDF(target_element)
            : this.getBase64viaHTML2Canvas(target_element);

        base64Promise.then(base64 => {
          this.base64PreviewSrc = base64;
          this.showPreview = true; // show
        })
        .catch(err => {
          console.log("something happened on update preview pdf", err);
        });
    },
    /**
     * Library is in beta
     * https://github.com/eKoopmans/html2pdf
     */
    getBase64viaHTML2PDF(target_element) {
      let doc = html2pdf().from(target_element);
      return this.getBase64FromJsPdf(doc);
    },
    /**
     * Having an issue with regards to
     * rendering dashed element
     */
    getBase64viaHTML2Canvas(target_element) {
      //
      return html2canvas(target_element)
        //convert element to canvas
        .then(canvas => {
          let canvas_width = canvas.width;
          let canvas_height = canvas.height;
          let canvas_ratio = canvas_height / canvas_width;
          // add image to jspdf
          var imgData = canvas.toDataURL(
            "image/jpeg",
            canvas_width,
            canvas_height
          );

          //jspdf
          let doc = new jsPDF();
          let doc_width = doc.internal.pageSize.width;
          let doc_height = doc_width * canvas_ratio;
          doc.addImage(imgData, "JPEG", 0, 0, doc_width, doc_height);

          return doc;
        })
        //get base 64 value
        .then(doc => this.getBase64FromJsPdf(doc));
    },
    submit() {
      console.log(this.$refs);
    }
  }
};
</script>

<style scoped>
* {
  -webkit-print-color-adjust: exact;
}
/* input {
        outline: none!important;
        border: 0;
        border-bottom: 1px dashed;
    } */
</style>
