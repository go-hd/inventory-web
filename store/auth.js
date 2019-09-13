import moment from '~/plugins/moment'

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
