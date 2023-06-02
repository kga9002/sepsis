import { createStore } from 'vuex'

// const getIPAddress = async () => {
//   const response = await fetch('https://api.ipify.org?format=json')
//   const data = await response.json()
//   return data.ip
// }

export default createStore({
  state: {
    searchQuery: '',
    token:''
  },
  getters: {},
  mutations: {
    // 데이터 가져오기
    setSearchQuery(state, query) {
      state.searchQuery = query
    },
    setToken(state, token) {
      state.token = token
    },
  },
  actions: {
    // 데이터 가져오기
    setSearchQuery({ commit }, query) {
      commit('setSearchQuery', query)
    },
    setToken({ commit }, token) {
      commit('setToken', token)
    },
},
  modules: {},
  created() {
  },
  
})

// import { createStore } from 'vuex';

// export default createStore({
//   state: {
//     searchQuery: '',
//   },
//   getters: {},
//   mutations: {
//     // 데이터 가져오기
//     setSearchQuery(state, query) {
//       state.searchQuery = query;
//     },
//   },
//   actions: {
//     // 데이터 가져오기
//     setSearchQuery({ commit }, query) {
//       commit('setSearchQuery', query);
//     },
//     },
//   modules: {},
// });
