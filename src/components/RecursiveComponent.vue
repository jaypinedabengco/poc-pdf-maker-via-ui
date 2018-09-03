<template lang="pug">
    span.recursive-component
        span(v-if="!recursiveData.type")
            h1 Type is required! : {{recursiveData}}
        span(v-else)
            span(v-if="recursiveData.type == 'text'")
                | im a text {{recursiveData.value}}
            span(v-else-if="recursiveData.type == 'label'")
                | im a label
            span(v-else-if="recursiveData.type == 'container'")
                | im a container
            span(v-else)
                | unknown type of {{recursiveData.type}}
            div.next-line(v-if="recursiveData.children")
                recursive-component(v-for="recursiveChildData in recursiveData.children" v-bind:key="recursiveChildData.ref_id" :recursive-data="recursiveChildData")
</template>

<script>

export default {
  name: "RecursiveComponent",
  props: ['recursiveData'],
  created(){
  },

  data() {
    return {
    };
  }, 

  methods: {
      processValue(value){
          if ( !!value ){
              return ` With value of ${value}`;
          }
          return '';
      }
  }

};
</script>

<style scoped>
    .next-line {
        margin-left: 10px;
    }
    .recursive-component {
        margin-right: 10px;
    }
</style>
