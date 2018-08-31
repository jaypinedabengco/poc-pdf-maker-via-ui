<template lang="pug">
    div
        h1 Test Pug and SCSS
        div
            p
                | Im not sure dude about this p thing, so we will try it here
            p.
                Blah blah blah
            a.foo_link(href='bout.html', target='_blank') About us
</template>

<script>

export default {
  name: "TestPugAndSass",

  // -- DATA
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
