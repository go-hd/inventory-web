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
         <label>ブランド</label>
         <b-form-select
             id="brand_id"
             :options="getBrandOptions"
             v-model="formDataRequest.brand_id"
             :class="{ 'is-invalid': errors.brand_id }">
         </b-form-select>
         <div v-for="(error, index) in errors.brand_id" :key="index"
              :value="error"
              class="invalid-feedback">
           {{ error }}
         </div>
       </b-form-group>
       <b-form-group>
         <label>商品</label>
         <b-form-select
             id="product_id"
             :options="getProductOptions"
             v-model="formDataRequest.product_id"
             :class="{ 'is-invalid': errors.product_id }">
         </b-form-select>
         <div v-for="(error, index) in errors.product_id" :key="index"
              :value="error"
              class="invalid-feedback">
           {{ error }}
         </div>
       </b-form-group>
       <b-form-group>
         <label>ロット</label>
         <b-form-select
             id="lot_id"
             :options="getLotOptions"
             v-model="formDataRequest.lot_id"
             :class="{ 'is-invalid': errors.lot_id }">
         </b-form-select>
         <div v-for="(error, index) in errors.lot_id" :key="index"
              :value="error"
              class="invalid-feedback">
           {{ error }}
         </div>
       </b-form-group>
       <b-form-group>
         <label>依頼拠点</label>
         <b-form-select
             id="location_id"
             :options="getLocationOptions"
             v-model="formDataRequest.shipping_location_id"
             :class="{ 'is-invalid': errors.shipping_location_id }">
         </b-form-select>
         <div v-for="(error, index) in errors.shipping_location_id" :key="index"
              :value="error"
              class="invalid-feedback">
           {{ error }}
         </div>
       </b-form-group>
       <b-form-group>
         <label>個数</label>
         <b-form-input
             type="number"
             id="request-quantity"
             placeholder="個数"
             v-model="formDataRequest.quantity"
             :class="{ 'is-invalid': errors.quantity }"
             class="form-control">
         </b-form-input>
         <div v-for="(error, index) in errors.quantity" :key="index" :value="error"
              class="invalid-feedback">
           {{ error }}
         </div>
       </b-form-group>
       <b-form-group>
         <label>材料から生産する</label>
         <b-form-checkbox
             id="is_ten_days_notation"
             v-model="formDataRequest.is_from_material"
             value=1
             unchecked-value=0>
         </b-form-checkbox>
       </b-form-group>
     </b-col>
   </b-row>
   <div class="form-actions float-right">
     <b-button type="submit" variant="primary" @click="onClickCreateRequest()">
       発注する
     </b-button>
   </div>
 </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'stock-order-modal-form',
    data () {
      return {
        formDataRequest: {
          brand_id: '',
          product_id: '',
          lot_id: '',
          shipping_location_id: '',
          receiving_location_id: this.$store.$auth.user.location.id,
          quantity: 0,
          is_from_material: false,
        },
      }
    },
    computed: {
      /**
       * セレクトボックス用のブランド一覧を取得
       *
       * @returns []
       */
      getBrandOptions() {
        let options = [];
        options.push({value: '', text: ''});
        this.brands.map(brand => {
          options.push({value: brand.id, text: brand.name});
        });
        return options;
      },
      /**
       * セレクトボックス用の製品一覧を取得
       *
       * @returns []
       */
      getProductOptions() {
        let options = [];
        options.push({value: '', text: ''});
        if (this.formDataRequest.brand_id !== '') {
          this.products.map(product => {
            if (product.brand_id == this.formDataRequest.brand_id) {
              options.push({value: product.id, text: product.jan_code});
            }
          });
        }
        return options;
      },
      /**
       * セレクトボックス用のロット一覧を取得
       *
       * @returns []
       */
      getLotOptions() {
        let options = [];
        options.push({value: '', text: ''});
        if (this.formDataRequest.product_id !== '') {
          this.lotsByCompany.map(lot => {
            if (lot.product_id == this.formDataRequest.product_id) {
              options.push({value: lot.id, text: lot.name});
            }
          });
        }
        return options;
      },
      /**
       * セレクトボックス用の拠点一覧を取得
       *
       * @returns []
       */
      getLocationOptions() {
        let options = [];
        options.push([]);
        this.locations.map(location => {
          if (location.id != this.$store.$auth.user.location.id) {
            options.push({value: location.id, text: location.name});
          }
        });
        return options;
      },
      ...mapGetters('stock_moves', ['alertMessage', 'errors', 'alertStatus']),
      ...mapGetters('locations', ['locations']),
      ...mapGetters('brands', ['brands']),
      ...mapGetters('products', ['products']),
      ...mapGetters('lots', ['lotsByCompany']),
    },
    methods: {
      /**
       * 発注依頼：登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateRequest() {
        const data = {stock_move: this.formDataRequest};
        // 更新処理
        const response = await this.createStockMove(cloneDeep(data));
        if (response.status) {
          this.reset();
        }
      },
      reset() {
        this.formDataRequest = {
          brand_id: '',
          product_id: '',
          lot_id: '',
          shipping_location_id: '',
          receiving_location_id: this.$store.$auth.user.location.id,
          quantity: 0,
          is_from_material: false,
        }
      },
      ...mapActions('stock_moves', ['createStockMove']),
    }
  }
</script>
