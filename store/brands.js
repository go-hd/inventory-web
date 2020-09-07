import moment from '~/plugins/moment'

export const state = () => ({
  brands: [],
  brandsHasLots: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  brands: state => state.brands,
  brandsHasLots: state => state.brandsHasLots,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
};

export const mutations = {
  add(state, { brand }) {
    state.brands.push(brand);
  },
  setBrandHasLots(state, brands) {
    state.brandsHasLots = brands;
  },
  update(state, { brand }) {
    state.brands = state.brands.map(data => (data.id === brand.id ? brand : data));
  },
  delete(state, { brand }) {
    for(let i = 0; i < state.brands.length; i++) {
      const b = state.brands[i];
      if(b.id === brand.id) {
        state.brands.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.errors = [];
    state.alertMessage = null;
    state.alertStatus = null;
  },
  clearBrands(state) {
    state.brands = [];
  },
  clearBrandsHasLots(state) {
    state.brandsHasLots = [];
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
  async fetchBrands({ commit }, params) {
    const brands = await this.$axios.$get('brands?company_id=' + params.company_id);
    commit('clearBrands');
    Object.entries(brands || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          brand: {
            id,
            ...content
          }
        })
      )
  },
  /**
   * 拠点にひもづくロットがあるブランドを取得する
   *
   * @param commit
   * @param params
   * @returns {Promise<void>}
   */
  async fetchBrandsHasLots({ commit }, params) {
    const brandsHasLots =
      await this.$axios.$get(
        'brands/get_has_lots?group_by_location=1&company_id=' + params.company_id
      );
    commit('clearBrandsHasLots');
    commit('setBrandHasLots', brandsHasLots)
  },
  async createBrand({ commit }, { brand }) {
    const result = await this.$axios.$post(`brands/`, brand).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { brand: result.brand });
      commit('showAlert', { alertMessage: 'ブランドを作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ブランドを作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateBrand({ commit }, { brand }) {
    const result = await this.$axios.$put(`brands/${brand.id}`, brand).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { brand: brand });
      commit('showAlert', { alertMessage: 'ブランドを更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: 'ブランドを更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteBrand({ commit }, { brand }) {
    const result = await this.$axios.$delete(`brands/${brand.id}`);
    if (result.status === 'OK') {
      commit('delete', { brand: brand });
      commit('showAlert', { alertMessage: 'ブランドを削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: 'ブランドを削除できませんでした。', alertStatus: 'danger' });
    }
  },
  resetErrors({ commit }) {
    commit('clearErrors');
  },
  reset({ commit }) {
    commit('clear');
  },
};
