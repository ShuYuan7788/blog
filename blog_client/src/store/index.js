import { createStore } from 'vuex'
import SessionStorage from '../tools/session-storage'
const USER = "USER";
const TOKEN = "TOKEN";

const store = createStore({
  //变量
  state: {
    user: SessionStorage.getValue(USER) || {},
    token: SessionStorage.getValue(TOKEN) || ""
  },
  //操作方法
  //同步方法 
  mutations: {
    setUser(state, user) {
      state.user = user;
      console.log("setUser",user)
      SessionStorage.setValue(USER,user)
    },
    removeUser(state){
      SessionStorage.removeValue(USER)
      state.user = {}
    },
    setToken(state, token){
      state.token = token;
      SessionStorage.setValue(TOKEN,token)
    },
    removeToken(state){
      SessionStorage.removeValue(TOKEN)
      state.token = ""
    }
  },
  //异步方法
  actions: {
  },
  modules: {
  }
})

export default store;

//const user = computed(() => {
//   store.state.user
// })