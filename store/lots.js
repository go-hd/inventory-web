import moment from '~/plugins/moment'

export const state = () => ({
  lots: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  lots: state => state.lots,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { lot }) {
    state.lots.push(lot);
  },
  update(state, { lot }) {
    state.lots = state.lots.map(data => (data.id === lot.id ? lot : data));
  },
  delete(state, { lot }) {
    for(let i = 0; i < state.lots.length; i++) {
      const b = state.lots[i];
      if(b.id === lot.id) {
        state.lots.splice(i, 1);
        return;
      }
    }
  },
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
  clearLots(state) {
    state.lots = [];
  }
};

export const actions = {
  async fetchLots({ commit }, params) {
    let lots = [];
    if (params.company_id) {
      lots = await this.$axios.$get('http://localhost:8000/lots?company_id=' + params.company_id);
    } else if (params.product_id) {
      lots = await this.$axios.$get('http://localhost:8000/lots?product_id=' + params.product_id);
    }

    commit('clearLots');
    Object.entries(lots || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          lot: {
            id,
            ...content
          }
        })
      )
  },
  async createLot({ commit }, { lot }) {
    const result = await this.$axios.$post(`http://localhost:8000/lots/`, lot).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { lot: lot });
      commit('showAlert', { alertMessage: 'ロットを作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ロットを作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateLot({ commit }, { lot }) {
    const result = await this.$axios.$put(`http://localhost:8000/lots/${lot.id}`, lot).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { lot: lot });
      commit('showAlert', { alertMessage: 'ロットを更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ロットを更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteLot({ commit }, { lot }) {
    const result = await this.$axios.$delete(`http://localhost:8000/lots/${lot.id}`);
    if (result.status === 'OK') {
      commit('delete', { lot: lot });
      commit('showAlert', { alertMessage: 'ロットを削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: 'ロットを削除できませんでした。', alertStatus: 'danger' });
    }
  },
  resetErrors({ commit }) {
    commit('clearErrors');
  },
  reset({ commit }) {
    commit('clear');
  },
};
