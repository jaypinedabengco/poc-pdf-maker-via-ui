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
  name: 'HelloWorld',
  data () {
    return {
      demos: [
        {
          name: 'jsPDF', 
          title: 'jsPDF Base Demo', 
          route: '/jspdf/base-demo'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
