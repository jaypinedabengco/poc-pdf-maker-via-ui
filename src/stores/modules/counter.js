// state
const state = {
  count: 0,
  todos: [
    { id: 1, text: '...', done: true },
    { id: 2, text: '...', done: false }
  ]
}

// getters
const getters = {
  doneTodos: state => {
    return state.todos.filter(todo => todo.done)
  },
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  },
  getTodoById: state => id => {
    return state.todos.find(todo => todo.id === id)
  }
}

// mutations
const mutations = {
  increment (state) {
    state.count++
  }
}

// actions
const actions = {
  increment ({ commit }) {
    console.log('clicked')
    commit('increment')
  },
  incrementWithLog ({ commit, state }) {
    commit('increment')
    console.log('count', state.count)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
