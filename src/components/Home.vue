<template>
  <div>
    <h1>PDF to HTMLs</h1>
    <ul>
      <li v-for="(demo) in demos" v-bind:key="demo.name">
        <router-link :to="demo.route">{{demo.title}}</router-link>
      </li>
    </ul>
  </div>
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
