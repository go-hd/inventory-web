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
  async fetchUsers({ commit }) {
    const users = await this.$axios.$get('http://localhost:8000/users');
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
};
