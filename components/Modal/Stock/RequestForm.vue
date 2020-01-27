<template>
  <div>
    <div>
      <b-alert v-if="requestAlertMessage" show :variant="requestAlertStatus">{{ requestAlertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>依頼拠点</label>
          <b-form-select
                  id="location_id"
                  :options="getLocationOptions"
                  v-model="formDataRequest.shipping_location_id"
                  :class="{ 'is-invalid': requestErrors.shipping_location_id }" />
          <div v-for="(error, index) in requestErrors.shipping_location_id" :key="index"
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
                  :class="{ 'is-invalid': requestErrors.quantity }"
                  class="form-control" />
          <div v-for="(error, index) in requestErrors.quantity" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickCreateRequest()">
        登録する
      </b-button>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'stock-modal-request-form',
    props: {
      location: {
        default: [],
      },
      lot: {
        default: [],
      },
      locations: {
        default: [],
      },
    },
    data() {
      return {
        formDataRequest: {
          shipping_location_id: '',
          receiving_location_id: this.location.id,
          lot_id: this.lot.id,
          quantity: 0,
        },
      }
    },
    computed: {
      /**
       * セレクトボックス用の拠点一覧を取得
       *
       * @returns []
       */
      getLocationOptions() {
        let options = [];
        options.push([]);
        this.locations.map(location => {
          if (location.id != this.location.id) {
            options.push({value: location.id, text: location.name});
          }
        });
        return options;
      },
      ...mapGetters({
        requestErrors: 'stock_moves/errors',
        requestAlertMessage: 'stock_moves/alertMessage',
        requestAlertStatus: 'stock_moves/alertStatus',
      }),
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
        // OK
        if (response.status) {
          this.$emit('close');
        }
      },
      ...mapActions('stock_moves', ['createStockMove']),
    },
  }
</script>
