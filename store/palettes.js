import moment from '~/plugins/moment'

export const state = () => ({
  palettes: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  palettes: state => state.palettes,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { palette }) {
    state.palettes.push(palette);
  },
  update(state, { palette }) {
    state.palettes = state.palettes.map(data => (data.id === palette.id ? palette : data));
  },
  delete(state, { palette }) {
    for(let i = 0; i < state.palettes.length; i++) {
      const b = state.palettes[i];
      if(b.id === palette.id) {
        state.palettes.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.errors = [];
    state.alertMessage = null;
    state.alertStatus = null;
  },
  clearPalettes(state) {
    state.palettes = [];
  },
  showAlert(state, { alertMessage, alertStatus }) {
    state.alertMessage = alertMessage;
    state.alertStatus = alertStatus;
  },
  showErrors(state, { errors }) {
    state.errors = errors;
  },
};

export const actions = {
  async fetchPalettes({ commit }, params) {
    const palettes = await this.$axios.$get('palettes?company_id=' + params.company_id);
    commit('clearPalettes');
    Object.entries(palettes || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          palette: {
            id,
            ...content
          }
        })
      )
  },
  async createPalette({ commit }, { palette }) {
    const result = await this.$axios.$post(`palettes/`, palette).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { palette: result.palette });
      commit('showAlert', { alertMessage: 'パレットを作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'パレットを作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updatePalette({ commit }, { palette }) {
    const result = await this.$axios.$put(`palettes/${palette.id}`, palette).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { palette: result['palette'] });
      commit('showAlert', { alertMessage: 'パレットを更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'パレットを更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateLocationPalette({ commit }, { locationPalette }) {
    const result = await this.$axios.$post('location_palettes/move', locationPalette).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { palette: result['palette'] });
      commit('showAlert', { alertMessage: 'パレット個数を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'パレット個数を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deletePalette({ commit }, { palette }) {
    const result = await this.$axios.$delete(`palettes/${palette.id}`);
    if (result.status === 'OK') {
      commit('delete', { palette: palette });
      commit('showAlert', { alertMessage: 'パレットを削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: 'パレットを削除できませんでした。', alertStatus: 'danger' });
    }
  },
  reset({ commit }) {
    commit('clear');
  },
};
