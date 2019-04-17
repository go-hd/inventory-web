import moment from '~/plugins/moment'

export const state = () => ({
  companies: []
});

export const getters = {
  companies: state => state.companies.map(company => Object.assign({ locations: [] }, company))
};

export const mutations = {
  add(state, { company }) {
    state.companies.push(company)
  },
  update(state, { company }) {
    state.companies = state.companies.map(c => (c.id === company.id ? company : c))
  },
  delete(state, { company }) {
    state.companies.splice(state.companies.indexOf(company), 1);
  },
  clear(state) {
    state.companies = [];
  },
};

export const actions = {
  async fetchCompanies({ commit }) {
    const companies = await this.$axios.$get('http://localhost:8000/companies');
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
    const result = await this.$axios.$post(`http://localhost:8000/companies/`, company);
    if (result.status === 'OK') {
      commit('create', { company: company });
      this.$router.push('/companies')
    } else {
      // TODO: エラー処理
    }
  },
  async updateCompany({ commit }, { company }) {
    const result = await this.$axios.$put(`http://localhost:8000/companies/${company.id}`, company);
    if (result.status === 'OK') {
      commit('update', { company: company });
    } else {
      // TODO: エラー処理
    }
  },
  async deleteCompany({ commit }, { company }) {
    const result = await this.$axios.$delete(`http://localhost:8000/companies/${company.id}`);
    if (result.status === 'OK') {
      commit('delete', { company: company });
    } else {
      // TODO: エラー処理
    }
  },
};
