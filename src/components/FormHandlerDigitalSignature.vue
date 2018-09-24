<template lang="pug">
    section.form-handler-digital-signature
       canvas(:id='canvasId')
       button(@click.prevent='clearSignature' v-if="signaturePad && !signaturePad.isEmpty()") clear
       button(@click.prevent='saveSignature' v-if="signaturePad && !signaturePad.isEmpty()") save
       button(@click.prevent='resetSignature' v-if="signaturePad && signaturePad.isEmpty() && formDefinition.value") reset
       div(v-if='formDefinition.value' class="preview")
        span saved signature
        button(@click.prevent='deleteSignature') delete
        img(:src='formDefinition.value')
</template>

<script>
import SignaturePad from 'signature_pad'

export default {
  name: 'FormHandlerDigitalSignature',
  props: ['formDefinition'],
  mounted () {
    // on load, initialize signature pad
    let canvas = document.getElementById(this.canvasId)
    this.signaturePad = new SignaturePad(canvas)

    // adjust based on canvas size
    // var ratio = Math.max(window.devicePixelRatio || 1, 1)
    // canvas.width = canvas.offsetWidth * ratio
    // canvas.height = canvas.offsetHeight * ratio
    // canvas.getContext('2d').scale(ratio, ratio)
    // this.signaturePad.clear()
    // if has initial value, then preload & save
    if (this.formDefinition.value) {
      this.resetSignature()
    }
  },
  data () {
    return {
      canvasId: `canvas-id-${this.formDefinition.ref_id}`,
      signaturePad: null,
      initialSignature: null
    }
  },
  methods: {
    clearSignature () {
      this.signaturePad.clear()
    },
    saveSignature () {
      this.formDefinition.value = this.signaturePad.toDataURL()
    },
    resetSignature () {
      this.signaturePad.fromDataURL(this.formDefinition.value)
    },
    deleteSignature () {
      this.formDefinition.value = null
    }
  }
}
</script>

<style scoped>
canvas {
  margin-top: 20px;
  border: 1px solid;
}
.preview > * {
  margin-top: 10px;
  display: block;
}
.preview img {
  background-color: #e4e4e4;
}
</style>
