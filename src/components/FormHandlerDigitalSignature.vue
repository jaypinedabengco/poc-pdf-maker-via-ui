<template lang="pug">
    section.form-handler-digital-signature
       canvas(:id='canvasId')
       button(@click.prevent='clearSignature' v-if="signaturePad && !signaturePad.isEmpty()") clear
       button(@click.prevent='saveSignature' v-if="signaturePad && !signaturePad.isEmpty()") save
       button(@click.prevent='resetSignature' v-if="signaturePad && signaturePad.isEmpty() && formDefinition.value") reset
       div(v-if='formDefinition.value')
        span saved signature
        img(:src='formDefinition.value')
        button(@click.prevent='deleteSignature') delete
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

    // if has initial value, then preload & save
    if (this.formDefinition.value) {
      setTimeout(() => {
        this.resetSignature()
      }, 1000)
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
</style>
