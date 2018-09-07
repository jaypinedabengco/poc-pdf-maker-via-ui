<template>
  <div>
    <h1>JSPDF Base Demo</h1>
    <div id='html-to-pdf-container'>
        <form novalidate class='md-layout'>
           <div>
               <label for='firstname' >Firstname</label> <input name='firstname' v-bind:style='[styles.dashedInputStyle]'>
               <label for='lastname'>Lastname</label> <input name='lastname'>
               <label for='firstname' >Firstname</label> <input name='firstname' v-bind:style='[styles.dashedInputStyle]'>
               <label for='lastname'>Lastname</label> <input name='lastname'>
               <label for='firstname' >Firstname</label> <input name='firstname' v-bind:style='[styles.dashedInputStyle]'>
               <label for='lastname'>Lastname</label> <input name='lastname'>
               <label for='firstname' >Firstname</label> <input name='firstname' v-bind:style='[styles.dashedInputStyle]'>
               <label for='lastname'>Lastname</label> <input name='lastname'>
           </div>
        </form>
    </div>
    <button @click='togglePreview(false)' name='preview'>{{ showPreview ? 'Hide' : 'Show' }} Preview (via HTML2Canvas)</button>
    <button @click='togglePreview(true)' name='preview'>{{ showPreview ? 'Hide' : 'Show' }} Preview (via HTML2PDF)</button>
    <button v-show='showPreview' @click='updatePreviewPDF(false)'>Update Preview (via HTML2Canvas)</button>
    <button v-show='showPreview' @click='updatePreviewPDF(true)'>Update Preview (via HTML2PDF)</button>
    <div v-show='showPreview'>
        PREVIEW
        <iframe v-if='base64PreviewSrc' type='application/pdf' :src='base64PreviewSrc' width='100%' height='5000px;'>
        </iframe>
        <div v-else>Building....</div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import JSPDF from 'jspdf'
import pdfBuilderMixin from '@/mixins/pdfBuilderMixin.ts'

export default {
  name: 'JsPdfBaseDemo',
  mixins: [pdfBuilderMixin],
  data () {
    return {
      showPreview: false,
      base64PreviewSrc: null,
      styles: {
        dashedInputStyle: {
          outline: 'none!important',
          border: 0,
          'border-bottom': '1px dashed'
        }
      }
    }
  },
  methods: {
    togglePreview (useHtml2Pdf) {
      if (!this.showPreview) {
        return this.updatePreviewPDF(useHtml2Pdf)
      }
      this.showPreview = false
    },
    buildPDF () {
      console.log('pdf build')
    },
    updatePreviewPDF (useHtml2Pdf) {
      let targetElement = window.document.getElementById(
        'html-to-pdf-container'
      )

      let base64Promise = useHtml2Pdf ? this.getBase64viaHTML2PDF(targetElement) : this.getBase64viaHTML2Canvas(targetElement)

      base64Promise.then(base64 => {
        this.base64PreviewSrc = base64
        this.showPreview = true
      })
        .catch(err => {
          console.log('something happened on update preview pdf', err)
        })
    },
    /**
     * Library is in beta
     * https://github.com/eKoopmans/html2pdf
     */
    getBase64viaHTML2PDF (targetElement) {
      let doc = html2pdf().from(targetElement)
      return this.getBase64FromJsPdf(doc)
    },
    /**
     * Having an issue with regards to
     * rendering dashed element
     */
    getBase64viaHTML2Canvas (targetElement) {
      return html2canvas(targetElement)
        // convert element to canvas
        .then(canvas => {
          let canvasWidth = canvas.width
          let canvasHeight = canvas.height
          let canvasRatio = canvasHeight / canvasWidth
          // add image to jspdf
          var imgData = canvas.toDataURL(
            'image/jpeg',
            canvasWidth,
            canvasHeight
          )
          // jspdf
          let doc = new JSPDF()
          let docWidth = doc.internal.pageSize.width
          let docHeight = docWidth * canvasRatio
          doc.addImage(imgData, 'JPEG', 0, 0, docWidth, docHeight)

          return doc
        })
        // get base 64 value
        .then(doc => this.getBase64FromJsPdf(doc))
    },
    submit () {
      console.log(this.$refs)
    }
  }
}
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
