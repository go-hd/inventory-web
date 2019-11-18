import moment from '~/plugins/moment'

export const state = () => ({
  materials: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  materials: state => state.materials,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { material }) {
    state.materials.push(material);
  },
  update(state, { material }) {
    state.materials = state.materials.map(data => (data.id === material.id ? material : data));
  },
  delete(state, { material }) {
    for(let i = 0; i < state.materials.length; i++) {
      const b = state.materials[i];
      if(b.id === material.id) {
        state.materials.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.alertMessage = null;
    state.alertStatus = null;
    state.errors = [];
  },
  clearMaterials(state) {
    state.materials = [];
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
  async fetchMaterials({ commit }, params) {
    const materials = await this.$axios.$get('http://localhost:8000/materials?parent_lot_id=' + params.parent_lot_id);
    commit('clearMaterials');
    Object.entries(materials || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          material: {
            id,
            ...content
          }
        })
      )
  },
  async createMaterial({ commit }, { material }) {
    const result = await this.$axios.$post(`http://localhost:8000/materials/`, material).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { material: material });
      commit('showAlert', { alertMessage: '材料を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '材料を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateMaterials({ commit }, { materials }) {
    commit('clear');
    const result = await this.$axios.$post(`http://localhost:8000/materials/update_multi`, materials).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });

    if (result.status === 'OK') {
      commit('showAlert', { alertMessage: '材料を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '材料を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateMaterial({ commit }, { material }) {
    const result = await this.$axios.$put(`http://localhost:8000/materials/${material.id}`, material).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { material: material });
      commit('showAlert', { alertMessage: '材料を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '材料を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteMaterial({ commit }, { material }) {
    const result = await this.$axios.$delete(`http://localhost:8000/materials/${material.id}`);
    if (result.status === 'OK') {
      commit('delete', { material: material });
      commit('showAlert', { alertMessage: '材料を削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: '材料を削除できませんでした。', alertStatus: 'danger' });
    }
  },
  reset({ commit }) {
    commit('clear');
  },
};
