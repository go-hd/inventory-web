import moment from '~/plugins/moment'

export const state = () => ({
  stockHistoryTypes: [],
});

export const getters = {
  stockHistoryTypes: state => state.stockHistoryTypes,
};

export const mutations = {
  add(state, { stockHistoryType }) {
    state.stockHistoryTypes.push(stockHistoryType);
  },
  clear(state) {
    state.stockHistoryTypes = [];
  },
};

export const actions = {
  async fetchStockHistoryTypes({ commit }) {
    const stockHistoryTypes = await this.$axios.$get('stock_history_types');
    commit('clear');
    Object.entries(stockHistoryTypes || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          stockHistoryType: {
            id,
            ...content,
          }
        })
      )
  },
};
