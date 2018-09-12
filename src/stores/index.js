import Vue from 'vue'
import Vuex from 'vuex'
import counter from './modules/counter'
import logger from './plugins/logger'

Vue.use(Vuex)

// do none production specific stuff
const debug = process.env.NODE_ENV !== 'production'

let plugins = []

// dev specific plugins
if (debug) {
  plugins.push(logger)
}

export default new Vuex.Store({
  strict: debug, // strict is expensive, that is why it should be turned of on production
  modules: {
    countModule: counter,
    countModuleB: counter
  },
  plugins: plugins
})
