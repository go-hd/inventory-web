import moment from '~/plugins/moment'
import qs from 'qs';

export const state = () => ({
  companies: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  companies: state => state.companies,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { company }) {
    state.companies.push(company);
  },
  update(state, { company }) {
    state.companies = state.companies.map(data => (data.id === company.id ? company : data));
  },
  delete(state, { company }) {
    for(let i = 0; i < state.companies.length; i++) {
      const c = state.companies[i];
      if(c.id === company.id) {
        state.companies.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.companies = [];
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
  async fetchCompanies({ commit }, params = null) {
    // objectのネスト対応
    const paramsSerializer = (params) => qs.stringify(params);
    const companies = await this.$axios.$get('http://localhost:8000/companies', { params, paramsSerializer });
    commit('clear');
    Object.entries(companies || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          company: {
            id,
            ...content
          }
        })
      )
  },
  async createCompany({ commit }, { company }) {
    const result = await this.$axios.$post(`http://localhost:8000/companies/`, company).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { company: company });
      commit('showAlert', { alertMessage: '会社を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '会社を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateCompany({ commit }, { company }) {
    const result = await this.$axios.$put(`http://localhost:8000/companies/${company.id}`, company).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { company: company });
      commit('showAlert', { alertMessage: '会社を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '会社を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteCompany({ commit }, { company }) {
    const result = await this.$axios.$delete(`http://localhost:8000/companies/${company.id}`);
    if (result.status === 'OK') {
      commit('delete', { company: company });
      commit('showAlert', { alertMessage: '会社を削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: '会社を削除できませんでした。', alertStatus: 'danger' });
    }
  },
};
