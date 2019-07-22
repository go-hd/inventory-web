import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

    state: () => ({
        authUser: null
    }),

    mutations: {
        SET_USER: function (state, user) {
            state.authUser = user
        }
    },

    actions: {
        async logout() {
            const result = await this.$axios.$post(`http://localhost:8000/api/logout/`).catch(err => {
                return {
                    'errors' : err.response.data,
                    'status' : false
                };
            });

            return result;
        },
    }

})

export default store
