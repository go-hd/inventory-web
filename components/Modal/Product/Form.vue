<template>
  <div>
    <div>
      <b-alert v-if="alertMessage" show :variant="alertStatus">
        {{ alertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>JANコード</label>
          <b-form-input
            type="text"
            id="jan_code"
            placeholder="JANコード"
            v-model="formData.jan_code"
            :class="{ 'is-invalid': errors.jan_code }"
            class="form-control">
          </b-form-input>
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
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import ModalWrapper from '../ModalWrapper'

  export default {
    name: 'product-modal-form',
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
          this.$emit('close');
        }
      },
      ...mapActions('products', ['createProduct', 'updateProduct']),
    },
  }
</script>
