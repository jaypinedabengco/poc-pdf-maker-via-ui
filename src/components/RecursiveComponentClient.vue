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
        ref_id: "abc-1",
        type: "container",
        children: [
          {
            ref_id: "abc-2",
            type: "text",
            value: ""
          },
          {
            ref_id: "abc-3",
            type: "container",
            children: [
              {
                ref_id: "abc-4",
                type: "label",
                value: "hello"
              },
              {
                ref_id: "abc-5",
                type: "text",
                value: ""
              }
            ]
          },
          {
            ref_id: "abc-6",
            type: "container",
            children: [
              {
                ref_id: "abc-7",
                type: "label",
                value: "Hello Sub Label",
                children: [
                  {
                    ref_id: "abc-8",
                    type: "text",
                    value: "Sub Text"
                  },
                  {
                    ref_id: "abc-9",
                    type: "container",
                    children: [
                      {
                        ref_id: "abc-10",
                        type: "container",
                        children: [
                          {
                            ref_id: "abc-11",
                            type: "label",
                            value: "1st checkbox"
                          }
                        ]
                      },
                      {
                        ref_id: "abc-12",
                        type: "container",
                        children: [
                          {
                            ref_id: "abc-13",
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
