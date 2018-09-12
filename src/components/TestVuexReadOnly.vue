<template lang="pug">
    div
        h1 Test Vuex 2 (Read Only)
        div
           p count {{count}}
           p {{doneTodosCount}}
           p {{doneTodos}}
           p {{addLocalCount}}
           p Imported Store count {{importedStoreCount}}
        div
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import store from '@/stores/index'

export default {
  name: 'TestVuexReadOnly',
  computed: {
    importedStoreCount () {
      return store.state.countModuleB.count
    },
    ...mapGetters('countModule', ['doneTodosCount', 'doneTodos']),
    ...mapState('countModule', {
      count: 'count',
      addLocalCount (state) {
        return state.count + this.localCount
      }
    })
  },
  data () {
    return {
      localCount: 3
    }
  }
}

</script>

<style scoped>
</style>
