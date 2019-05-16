import moment from '~/plugins/moment'

export const state = () => ({
  locationTypes: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  locationTypes: state => state.locationTypes,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { locationType }) {
    state.locationTypes.push(locationType);
  },
  update(state, { locationType }) {
    state.locationTypes = state.locationTypes.map(data => (data.id === locationType.id ? locationType : data));
  },
  delete(state, { locationType }) {
    for(let i = 0; i < state.locationTypes.length; i++) {
      const l = state.locationTypes[i];
      if(l.id === locationType.id) {
        state.locationTypes.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.locationTypes = [];
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
  async fetchLocationTypes({ commit }) {
    const locationTypes = await this.$axios.$get('http://localhost:8000/location_types');
    commit('clear');
    Object.entries(locationTypes || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          locationType: {
            id,
            ...content,
          }
        })
      )
  },
  async createLocationType({ commit }, { locationType }) {
    const result = await this.$axios.$post(`http://localhost:8000/location_types/`, locationType).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { locationType: locationType });
      commit('showAlert', { alertMessage: '拠点種別を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '拠点種別を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateLocationType({ commit }, { locationType }) {
    const result = await this.$axios.$put(`http://localhost:8000/location_types/${locationType.id}`, locationType).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { locationType: locationType });
      commit('showAlert', { alertMessage: '拠点種別を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '拠点種別を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteLocationType({ commit }, { locationType }) {
    const result = await this.$axios.$delete(`http://localhost:8000/location_types/${locationType.id}`);
    if (result.status === 'OK') {
      commit('delete', { locationType: locationType });
      commit('showAlert', { alertMessage: '拠点種別を削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: '拠点種別を削除できませんでした。', alertStatus: 'danger' });
    }
  },
};
