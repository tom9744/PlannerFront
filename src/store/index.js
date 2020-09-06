import Vue from "vue";
import Vuex from "vuex";
import authStore from "./modules/authStore.js";
import mypage from "./modules/mypage.js";
import weather from "./modules/weather.js";
import todolist from "./modules/todolist.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},

  mutations: {},

  actions: {},

  getters: {},

  modules: {
    authStore,
    mypage,
    weather,
    todolist
  }
});

export default store;
