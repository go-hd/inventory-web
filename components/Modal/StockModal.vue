<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>ロット在庫情報更新</h3>
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
                    <label>拠点</label>
                    <div>
                      {{ locationName }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label>ロット</label>
                    <div>
                      {{ lotName }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label>在庫数</label>
                    <div>
                      {{ totalQuantity }}個
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="child_lot_id">種別</label>
                    <b-form-select id="child_lot_id" :options="getStockHistoryTypeOptions"
                                   v-model="formData.stock_history_type_id"></b-form-select>
                    <div v-for="(error, index) in errors.stock_history_type_id" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="quantity">個数</label>
                    <b-form-input type="number" id="quantity" placeholder="個数" v-model="formData.quantity"
                                  v-bind:class="{ 'is-invalid': errors.quantity }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.quantity" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="note">備考</label>
                    <b-form-textarea
                            id="note"
                            placeholder="備考"
                            v-model="formData.note"
                            rows="3"
                            max-rows="6"
                            v-bind:class="{ 'is-invalid': errors.note }"
                    ></b-form-textarea>
                    <div v-for="(error, index) in errors.note" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-actions float-right">
                <b-button type="submit" variant="primary" @click="onClickUpdate()">
                  登録する
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
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'stock-modal',
    props: {
      locationId: {
        type: Number,
        default: null
      },
      locationName: {
        type: String,
        default: null
      },
      lotId: {
        type: Number,
        default: null
      },
      lotName: {
        type: String,
        default: null
      },
      stockHistoryTypes: {
        default: [],
      },
    },
    data () {
      return {
        formData: {
          company_id: this.$store.$auth.user.company.id,
          location_id: this.locationId,
          lot_id: this.lotId,
          stock_history_type_id: '',
          quantity: 0,
          note: '',
        },
        totalQuantity: 0,
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
      ...mapGetters('stock_histories', ['errors', 'alertMessage', 'alertStatus'])
    },
    mounted() {
      if (this.brand !== undefined) {
        this.formData.name = this.brand.name;
        this.formData.code = this.brand.code;
        this.formData.note = this.brand.note;
      }
      // 在庫数を取得する
      this.$axios
        .get("/stock_histories/get_quantity/" + this.locationId + "/" + this.lotId)
        .then(({ data }) => {
          this.totalQuantity = data.totalQuantity;
        }).catch(err => {
        console.log(err.response);
        });
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { stock_history: this.formData };
        // 更新処理
        const response = await this.createStockHistory(cloneDeep(data));
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
      ...mapActions('stock_histories', ['createStockHistory', 'reset', 'resetErrors']),
    },
  }
</script>
