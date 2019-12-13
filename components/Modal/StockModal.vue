<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>ロット在庫情報更新</h3>
            <nav v-if="id !== null" class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item" v-bind:class="{ 'active': isStockEdit }">
                    <a class="nav-link" @click="onClickStockEdit">ロット在庫情報</a>
                  </li>
                  <li class="nav-item" v-bind:class="{ 'active': isRequest }">
                    <a class="nav-link" @click="onClickRequest">発注依頼</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- ロット在庫情報 -->
              <div v-if="isStockEdit">
                <div>
                  <b-alert v-if="stockAlertMessage" show :variant="stockAlertStatus">{{ stockAlertMessage }}
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
                      <div v-for="(error, index) in stockErrors.stock_history_type_id" v-bind:key="index"
                           v-bind:value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="quantity">個数</label>
                      <b-form-input type="number" id="quantity" placeholder="個数" v-model="formData.quantity"
                                    v-bind:class="{ 'is-invalid': stockErrors.quantity }"
                                    class="form-control"></b-form-input>
                      <div v-for="(error, index) in stockErrors.quantity" v-bind:key="index" v-bind:value="error"
                           class="invalid-feedback">
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
                              v-bind:class="{ 'is-invalid': stockErrors.note }"
                      ></b-form-textarea>
                      <div v-for="(error, index) in stockErrors.note" v-bind:key="index" v-bind:value="error"
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
              <!-- 発注依頼 -->
              <div v-if="isRequest">
                <div>
                  <b-alert v-if="requestAlertMessage" show :variant="requestAlertStatus">{{ requestAlertMessage }}
                  </b-alert>
                </div>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label for="child_lot_id">依頼拠点</label>
                      <b-form-select id="location_id" :options="getLocationOptions"
                                     v-model="formDataRequest.shipping_location_id"
                                     v-bind:class="{ 'is-invalid': requestErrors.shipping_location_id }"></b-form-select>
                      <div v-for="(error, index) in requestErrors.shipping_location_id" v-bind:key="index"
                           v-bind:value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="quantity">個数</label>
                      <b-form-input type="number" id="quantity" placeholder="個数" v-model="formDataRequest.quantity"
                                    v-bind:class="{ 'is-invalid': requestErrors.quantity }"
                                    class="form-control"></b-form-input>
                      <div v-for="(error, index) in requestErrors.quantity" v-bind:key="index" v-bind:value="error"
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
  import {mapGetters, mapActions} from 'vuex'
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
      locations: {
        default: [],
      },
    },
    data() {
      return {
        formData: {
          company_id: this.$store.$auth.user.company.id,
          location_id: this.locationId,
          lot_id: this.lotId,
          stock_history_type_id: '',
          quantity: 0,
          note: '',
        },
        formDataRequest: {
          shipping_location_id: '',
          recieving_location_id: this.locationId,
          lot_id: this.lotId,
          quantity: 0,
        },
        totalQuantity: 0,
        isStockEdit: true,
        isRequest: false,
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
      /**
       * セレクトボックス用の拠点一覧を取得
       *
       * @returns []
       */
      getLocationOptions() {
        let options = [];
        options.push([]);
        this.locations.map(location => {
          if (location.id != this.locationId) {
            options.push({value: location.id, text: location.name});
          }
        });
        return options;
      },
      ...mapGetters({
        stockErrors: 'stock_histories/errors',
        stockAlertMessage: 'stock_histories/alertMessage',
        stockAlertStatus: 'stock_histories/alertStatus',
        requestErrors: 'stock_moves/errors',
        requestAlertMessage: 'stock_moves/alertMessage',
        requestAlertStatus: 'stock_moves/alertStatus',
      }),
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
        .then(({data}) => {
          this.totalQuantity = data.totalQuantity;
        }).catch(err => {
        console.log(err.response);
      });
    },
    methods: {
      /**
       * ロット在庫情報タブ押下時
       */
      async onClickStockEdit() {
        this.isStockEdit = true;
        this.isRequest = false;
      },
      /**
       * 発注依頼タブ押下時
       */
      async onClickRequest() {
        this.isStockEdit = false;
        this.isRequest = true;
      },
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
          this.resetStock();
          this.$emit('close');
        }
      },
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
          this.resetRequest();
          this.$emit('close');
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetStock();
        this.resetRequest();
        this.$emit('close');
      },
      ...mapActions('stock_histories', ['createStockHistory']),
      ...mapActions('stock_moves', ['createStockMove']),
      ...mapActions({
        resetStock: 'stock_histories/reset',
        resetRequest: 'stock_moves/reset',
      }),
    },
  }
</script>
