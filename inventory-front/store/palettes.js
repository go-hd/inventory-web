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
    state.palettes = [];
    state.errors = [];
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
  async fetchPalettes({ commit }) {
    const palettes = await this.$axios.$get('http://localhost:8000/palettes');
    commit('clear');
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
    const result = await this.$axios.$post(`http://localhost:8000/palettes/`, palette).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { palette: palette });
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
    const result = await this.$axios.$put(`http://localhost:8000/palettes/${palette.id}`, palette).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { palette: palette });
      commit('showAlert', { alertMessage: 'パレットを更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'パレットを更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deletePalette({ commit }, { palette }) {
    const result = await this.$axios.$delete(`http://localhost:8000/palettes/${palette.id}`);
    if (result.status === 'OK') {
      commit('delete', { palette: palette });
      commit('showAlert', { alertMessage: 'パレットを削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: 'パレットを削除できませんでした。', alertStatus: 'danger' });
    }
  },
};
