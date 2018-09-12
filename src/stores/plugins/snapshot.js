const plugin = store => {
  let prevState = { ...store.state }
  store.subscribe((mutation, state) => {
    //  let nextState = { ...state }
    console.log('snapshot plugin')
    // compare `prevState` and `nextState`...

    // save state for next mutation
    //  prevState = nextStates
  })
  console.log(prevState)
}

export default plugin
