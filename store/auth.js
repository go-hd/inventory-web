import moment from '~/plugins/moment'

export const state = () => ({
  authUser: null
});

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  }
};

export const actions = {
  async logout() {
    const result = await this.$axios.$post(`api/logout/`).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    return result;
  },
};
