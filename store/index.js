import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
		_curid: 0
	},
    mutations: {
		changeCurid(state, data) {
			state._curid = data;
		}
	},
    actions: {
		changeCurid({ commit }, data) {
			commit('changeCurid', data);
		}
	}
});
export default store;