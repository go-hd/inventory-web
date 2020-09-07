export const state = () => ({
  products: [],
  alertMessage: null,
  alertStatus: null,
  errors: [],
});

export const getters = {
  products: state => state.products,
  alertMessage: state => state.alertMessage,
  alertStatus: state => state.alertStatus,
  errors: state => state.errors,
  productsByBrand: state => {
    return state.products.reduce((sub, product) => {
      if (!sub.hasOwnProperty(product.brand_id)) {
        sub[product.brand_id] = []
      }
      sub[product.brand_id].push(product)
      return sub
    }, {})
  }
};

export const mutations = {
  add(state, { product }) {
    state.products.push(product);
  },
  update(state, { product }) {
    state.products = state.products.map(data => (data.id === product.id ? product : data));
  },
  delete(state, { product }) {
    for(let i = 0; i < state.products.length; i++) {
      const b = state.products[i];
      if(b.id === product.id) {
        state.products.splice(i, 1);
        return;
      }
    }
  },
  clear(state) {
    state.errors = [];
    state.alertMessage = null;
    state.alertStatus = null;
  },
  clearProducts(state) {
    state.products = [];
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
  async fetchProducts({ commit }, params) {
    let products = [];
    if (params.brand_id) {
      products = await this.$axios.$get('products?brand_id=' + params.brand_id);
    } else if (params.company_id) {
      products = await this.$axios.$get('products?company_id=' + params.company_id);
    }

    commit('clearProducts');
    Object.entries(products || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          product: {
            id,
            ...content
          }
        })
      )
  },
  async fetchProductsWithStock({ commit }, params) {
    let products = [];
    products = await this.$axios.$get(
      'products?with_stock=1&brand_id=' + params.brand_id
      + '&location_id=' + params.location_id);

    commit('clearProducts');
    Object.entries(products || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('add', {
          product: {
            id,
            ...content
          }
        })
      )
  },
  async createProduct({ commit }, { product }) {
    const result = await this.$axios.$post(`products/`, product).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('add', { product: result.product });
      commit('showAlert', { alertMessage: '商品を作成しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '商品を作成できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async updateProduct({ commit }, { product }) {
    const result = await this.$axios.$put(`products/${product.id}`, product).catch(err => {
      return {
        'errors' : err.response.data,
        'status' : false
      };
    });
    if (result.status === 'OK') {
      commit('update', { product: result.product });
      commit('showAlert', { alertMessage: '商品を更新しました。', alertStatus: 'success' });
    } else if (result['errors']) {
      commit('showAlert', { alertMessage: '入力内容をご確認ください。', alertStatus: 'danger' });
      commit('showErrors', { errors: result['errors'] });
    } else {
      commit('showAlert', { alertMessage: '商品を更新できませんでした。', alertStatus: 'danger' });
    }
    return result;
  },
  async deleteProduct({ commit }, { product }) {
    const result = await this.$axios.$delete(`products/${product.id}`);
    if (result.status === 'OK') {
      commit('delete', { product: product });
      commit('showAlert', { alertMessage: '商品を削除しました。', alertStatus: 'success' });
    } else {
      commit('showAlert', { alertMessage: '商品を削除できませんでした。', alertStatus: 'danger' });
    }
  },
  resetErrors({ commit }) {
    commit('clearErrors');
  },
  reset({ commit }) {
    commit('clear');
  },
};
