import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    }
  },
  actions: {
    updateLoading({ commit }, status) {
      commit('LOADING', status);
    }
  },
  getters: {
    isLoading: state => {
      return state.isLoading
    }
  }
});