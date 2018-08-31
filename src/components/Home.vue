<template lang="pug">
  div
    h1 PDF to HTMLs
    ul
      li(v-for="demo in demos" v-bind:key="demo.name") 
        router-link(:to="demo.route") {{demo.title}}
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      demos: [
        {
          name: "jsPDF",
          title: "jsPDF Base Demo",
          route: "/jspdf/base-demo"
        },
        {
          name: "pdfMake View",
          title: "pdfMake View",
          route: "/pdfmake/view"
        },
        {
          name: "pdfMake Create",
          title: "pdfMake Create",
          route: "/pdfmake/create"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
