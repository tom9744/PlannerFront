import Vue from "vue";
import Vuex from "vuex";
import authStore from "./modules/authStore.js";
import weather from "./modules/weather.js";
import todolist from "./modules/todo-list.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {

  },

  mutations: {

  },

  actions: {
   
  },

  getters: {

  },

  modules: {
    authStore,
    weather,
    todolist
  }
});

export default store