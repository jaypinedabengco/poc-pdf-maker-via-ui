<template lang="pug">
    span.recursive-component
        span(v-if="!recursiveData.type")
            h1 Type is required! : {{recursiveData}}
        span(v-else)
            span(v-if="recursiveData.type == 'text'")
                | im a text {{recursiveData.value}}
            span(v-else-if="recursiveData.type == 'label'")
                | im a label
            recursive-container-handler(v-else-if="recursiveData.type == 'container'" :recursive-data="recursiveData")
                div.blah(slot="child-container")
                    | hello
            span(v-else)
                | unknown type of {{recursiveData.type}}
            div.next-line(v-if="recursiveData.children")
                recursive-component(v-if="recursiveData.children" v-for="recursiveChildData in recursiveData.children" v-bind:key="recursiveChildData.ref_id" :recursive-data="recursiveChildData")
</template>

<script>
import RecursiveContainerHandler from '@/components/RecursiveContainerHandler'

export default {
  name: 'RecursiveComponent',
  props: ['recursiveData'],
  components: {
    'recursive-container-handler': RecursiveContainerHandler
  },
  methods: {
    processValue (value) {
      if (value) {
        return ` With value of ${value}`
      }
      return ''
    }
  }
}
</script>

<style scoped>
</style>
