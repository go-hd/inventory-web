<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>商品情報更新</h3>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div>
                <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}
                </b-alert>
              </div>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="jan_code">JANコード</label>
                    <b-form-input type="text" id="jan_code" placeholder="JANコード" v-model="formData.jan_code"
                                  v-bind:class="{ 'is-invalid': errors.jan_code }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.jan_code" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-actions float-right">
                <b-button type="submit" variant="primary" @click="onClickCreat()" v-if="id === null">
                  登録する
                </b-button>
                <b-button type="submit" variant="primary" @click="onClickUpdate()" v-if="id !== null">
                  更新する
                </b-button>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <b-button variant="default" @click="onClickClose">
              閉じる
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'brand-modal',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['products/products'].find(data => data.id === this.id)) {
        return
      }
      await store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id});
    },
    props: {
      brand_id: {
        type: Number,
        default: null
      },
      id: {
        type: Number,
        default: null
      },
    },
    data () {
      return {
        formData: {
          id: this.id,
          brand_id: this.brand_id,
          jan_code: '',
        },
      }
    },
    computed: {
      product() {
        return cloneDeep(this.products.find(data => data.id == this.id));
      },
      ...mapGetters('products', ['products', 'errors', 'alertMessage', 'alertStatus'])
    },
    mounted() {
      if (this.product !== undefined) {
        this.formData.brand_id = this.product.brand_id;
        this.formData.jan_code = this.product.jan_code;
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        const data = { product: this.formData };
        // 登録処理
        const response = await this.createProduct(cloneDeep(data));
        // OK
        if (response.status) {
          this.formData.jan_code = '';
          this.reset();
          this.$emit('close');
        }
      },
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { product: this.formData };
        // 更新処理
        const response = await this.updateProduct(cloneDeep(data));
        // OK
        if (response.status) {
          this.reset();
          this.$emit('close');
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('products', ['createProduct', 'updateProduct', 'reset', 'resetErrors']),
    },
  }
</script>
