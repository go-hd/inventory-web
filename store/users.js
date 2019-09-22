import moment from '~/plugins/moment'

export const state = () => ({
  users: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  users: state => state.users,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { user }) {
    state.users.push(user);
  },
  update(state, { user }) {
    state.users = state.users.map(data => (data.id === user.id ? user : data));
  },
  delete(state, { user }) {
    for(let i = 0; i < state.users.length; i++) {
      const b = state.users[i];
      if(b.id === user.id) {
        state.users.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.users = [];
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
    state.alertMessage = null;
    state.alertStatus = null;
  },
};

export const actions = {
  async fetchUsers({ commit }, params) {
    const users = await this.$axios.$get('http://localhost:8000/users?company_id=' + params.company_id);
    commit('clear');
    Object.entries(users || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          user: {
            id,
            ...content
          }
        })
      )
  },
  async validateUser({ commit }, { user }) {
    const result = await this.$axios.$post(`http://localhost:8000/users/validate`, user).catch(err => {
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
  async inviteUser({ commit }, { user }) {
    commit('clearErrors');
    const result = await this.$axios.$post(`http://localhost:8000/users/invite`, user).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('showAlert', { alertMessage: user.email + 'に招待メールを送信しました！', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ユーザーを招待できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async registerUser({ commit }, { data }) {
    commit('clearErrors');
    const result = await this.$axios.$post(`http://localhost:8000/register/invited`, data).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result['errors']) {
      if (result['errors']['status'] === 'NG') {
        commit('showAlert', { alertMessage: '処理に失敗しました。', alertStatus: 'danger' });
      } else {
        commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
        commit('showErrors', { errors: result['errors'] });
      }
    }
    return result;
  },
  async createUser({ commit }, { user }) {
    const result = await this.$axios.$post(`http://localhost:8000/users/`, user).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { user: user });
      commit('showAlert', { alertMessage: 'ユーザーを作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ユーザーを作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateUser({ commit }, { user }) {
    const result = await this.$axios.$put(`http://localhost:8000/users/${user.id}`, user).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { user: user });
      commit('showAlert', { alertMessage: 'ユーザーを更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ユーザーを更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteUser({ commit }, { user }) {
    const result = await this.$axios.$delete(`http://localhost:8000/users/${user.id}`);
    if (result.status === 'OK') {
      commit('delete', { user: user });
      commit('showAlert', { alertMessage: 'ユーザーを削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: 'ユーザーを削除できませんでした。', alertStatus: 'danger' });
    }
  },
  reset({ commit }) {
    commit('clear');
  }
};
