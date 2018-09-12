<template lang="pug">
    div
        h1 Test Vuex
        div
           p(@click="add") clickMe
           p count {{count}}
           p {{doneTodosCount}}
           p {{doneTodos}}
           p Local Count {{addLocalCount}}
        div
          test-vuex-read-only
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import TestVuexReadOnly from '@/components/TestVuexReadOnly'

export default {
  name: 'TestVuex',
  components: {
    'test-vuex-read-only': TestVuexReadOnly
  },
  computed: {
    ...mapState('countModule', ['count']),
    ...mapState('countModule', {
      addLocalCount (state) {
        console.log('state', state, this.localCount)
        return state.count + this.localCount
      }
    }),
    ...mapGetters('countModule', ['doneTodosCount', 'doneTodos'])
  },
  data () {
    return {
      localCount: 5
    }
  },
  methods: {
    ...mapActions('countModule', {
      add: 'increment'
    })
  }
}

</script>

<style scoped>
</style>
