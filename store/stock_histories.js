import moment from '~/plugins/moment'

export const state = () => ({
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  clear(state) {
    state.errors = [];
    state.alertMessage = null;
    state.alertStatus = null;
  },
  showAlert(state, { alertMessage, alertStatus }) {
    state.alertMessage = alertMessage;
    state.alertStatus = alertStatus;
  },
  showErrors(state, { errors }) {
    state.errors = errors;
  },
  clearErrors(state) {
    state.errors = [];
  },
};

export const actions = {
  async createStockHistory({ commit }, { stock_history }) {
    const result = await this.$axios.$post(`http://localhost:8000/stock_histories/`, stock_history).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { lot: result.lot });
      commit('showAlert', { alertMessage: '在庫を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '在庫を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  resetErrors({ commit }) {
    commit('clearErrors');
  },
  reset({ commit }) {
    commit('clear');
  },
};
