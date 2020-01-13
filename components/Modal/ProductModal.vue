<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">商品情報更新</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <div>
        <b-alert v-if="alertMessage" show :variant="alertStatus">
          {{ alertMessage }}
        </b-alert>
      </div>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <label for="jan_code">JANコード</label>
            <b-form-input
                    type="text"
                    id="jan_code"
                    placeholder="JANコード"
                    v-model="formData.jan_code"
                    :class="{ 'is-invalid': errors.jan_code }"
                    class="form-control" />
            <div v-for="(error, index) in errors.jan_code" :key="index" :value="error"
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
    </template>
    <!-- ボディ -->
    <!-- フッター -->
    <b-button variant="default" @click="onClickClose" slot="footer">
      閉じる
    </b-button>
    <!-- /フッター -->
  </ModalWrapper>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import ModalWrapper from './ModalWrapper'

  export default {
    name: 'product-modal',
    components: {
      ModalWrapper,
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
