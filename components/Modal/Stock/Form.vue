<template>
  <div>
    <div>
      <b-alert v-if="stockAlertMessage" show :variant="stockAlertStatus">
        {{ stockAlertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>拠点</label>
          <div>
            {{ location.name }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>ロット</label>
          <div>
            {{ lot.name }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>在庫数</label>
          <div>
            {{ lot.stock_quantity }}個
          </div>
        </b-form-group>
        <b-form-group>
          <label>種別</label>
          <b-form-select
            id="child_lot_id"
            :options="getStockHistoryTypeOptions"
            v-model="formData.stock_history_type_id">
          </b-form-select>
          <div v-for="(error, index) in stockErrors.stock_history_type_id" :key="index"
               :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>個数</label>
          <b-form-input
            type="number"
            id="lot-quantity"
            placeholder="個数"
            v-model="formData.quantity"
            :class="{ 'is-invalid': stockErrors.quantity }"
            class="form-control">
          </b-form-input>
          <div v-for="(error, index) in stockErrors.quantity" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>備考</label>
          <b-form-textarea
            id="note"
            placeholder="備考"
            v-model="formData.note"
            rows="3"
            max-rows="6"
            :class="{ 'is-invalid': stockErrors.note }">
          </b-form-textarea>
          <div v-for="(error, index) in stockErrors.note" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickCreateStock()">
        登録する
      </b-button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import {mapGetters} from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'stock-modal-form',
    props: {
      location: {
        default: [],
      },
      lot: {
        default: [],
      },
      stockHistoryTypes: {
        default: [],
      },
    },
    data() {
      return {
        formData: {
          company_id: this.$store.$auth.user.company.id,
          location_id: this.location.id,
          lot_id: this.lot.id,
          stock_history_type_id: '',
          quantity: 0,
          note: '',
        },
      }
    },
    computed: {
      /**
       * セレクトボックス用のロット一覧を取得
       *
       * @returns []
       */
      getStockHistoryTypeOptions() {
        let options = [];
        options.push([]);
        this.stockHistoryTypes.map(stockHistoryType => {
          options.push({value: stockHistoryType.id, text: stockHistoryType.name});
        });
        return options;
      },
      ...mapGetters({
        stockErrors: 'stock_histories/errors',
        stockAlertMessage: 'stock_histories/alertMessage',
        stockAlertStatus: 'stock_histories/alertStatus',
      }),
    },
    mounted() {
      if (this.brand !== undefined) {
        this.formData.name = this.brand.name;
        this.formData.code = this.brand.code;
        this.formData.note = this.brand.note;
      }
    },
    methods: {
      /**
       * ロット在庫情報：登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateStock() {
        const data = {stock_history: this.formData};
        // 更新処理
        const response = await this.createStockHistory(cloneDeep(data));
        // OK
        if (response.status) {
          this.$emit('update');
          this.$emit('close');
        }
      },
      ...mapActions('stock_histories', ['createStockHistory']),
    },
  }
</script>
