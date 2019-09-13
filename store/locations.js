import moment from '~/plugins/moment'

export const state = () => ({
  locations: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  locations: state => state.locations,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { location }) {
    state.locations.push(location);
  },
  update(state, { location }) {
    state.locations = state.locations.map(data => (data.id === location.id ? location : data));
  },
  delete(state, { location }) {
    for(let i = 0; i < state.locations.length; i++) {
      const l = state.locations[i];
      if(l.id === location.id) {
        state.locations.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.locations = [];
    state.errors = [];
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
  async fetchLocations({ commit }) {
    const locations = await this.$axios.$get('http://localhost:8000/locations');
    commit('clear');
    Object.entries(locations || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          location: {
            id,
            ...content
          }
        })
      )
  },
  async validateLocation({ commit }, { location }) {
    const result = await this.$axios.$post(`http://localhost:8000/locations/validate`, location).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('clearErrors');
    } else if (result['errors']) {
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'エラーが発生しました。', alertStatus: 'danger' });
    }
    return result;
  },
  async createLocation({ commit }, { location }) {
    const result = await this.$axios.$post(`http://localhost:8000/locations/`, location).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { location: location });
      commit('showAlert', { alertMessage: '拠点を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '拠点を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateLocation({ commit }, { location }) {
    const result = await this.$axios.$put(`http://localhost:8000/locations/${location.id}`, location).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { location: location });
      commit('showAlert', { alertMessage: '拠点を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '拠点を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteLocation({ commit }, { location }) {
    const result = await this.$axios.$delete(`http://localhost:8000/locations/${location.id}`);
    if (result.status === 'OK') {
      commit('delete', { location: location });
      commit('showAlert', { alertMessage: '拠点を削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: '拠点を削除できませんでした。', alertStatus: 'danger' });
    }
  },
};
