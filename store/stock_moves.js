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
  async createStockMove({ commit }, { stock_move }) {
    const result = await this.$axios.$post(`http://localhost:8000/stock_moves/`, stock_move).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { lot: result.lot });
      commit('showAlert', { alertMessage: '発注依頼を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '発注依頼を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async shipped({ commit }, id) {
    const result = await this.$axios.$post(`http://localhost:8000/stock_moves/shipped/` + id).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('showAlert', { alertMessage: '出庫を完了しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '出庫を完了できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async recieved({ commit }, id) {
    const result = await this.$axios.$post(`http://localhost:8000/stock_moves/recieved/` + id).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('showAlert', { alertMessage: '入庫確認を完了しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '入庫確認を完了できませんでした。', alertStatus: 'danger' });
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
