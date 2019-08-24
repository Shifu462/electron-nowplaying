const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state: any) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state: any) {
    state.main++
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
