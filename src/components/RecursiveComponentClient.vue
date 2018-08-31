<template lang="pug">
    div
        h1 Recursive Client
        p {{recursiveData}}
        recursive-component(:recursive-data="recursiveData")
</template>

<script>
import RecursiveComponentVue from "@/components/RecursiveComponent";

export default {
  name: "RecursiveComponentClient",
  components: {
    "recursive-component": RecursiveComponentVue
  },
  data() {
    return {
      recursiveData: {
        type: "container",
        children: [
          {
            type: "text",
            value: ""
          },
          {
            type: "container",
            children: [
              {
                type: "label",
                value: "hello"
              },
              {
                type: "text",
                value: ""
              }
            ]
          },
          {
            type: "container",
            children: [
              {
                type: "label",
                value: "Hello Sub Label",
                children: [
                  {
                    type: "text",
                    value: "Sub Text"
                  },
                  {
                    type: "container",
                    children: [
                      {
                        type: "container",
                        children: [
                          {
                            type: "label",
                            value: "1st checkbox"
                          }
                        ]
                      },
                      {
                        type: "container",
                        children: [
                          {
                            type: "label",
                            value: "2nd checkbox"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
