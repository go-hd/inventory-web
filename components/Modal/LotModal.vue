<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>ロット情報更新</h3>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div>
                <b-alert v-if="lotAlertMessage" show :variant="lotAlertStatus">{{ lotAlertMessage }}
                </b-alert>
              </div>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="lot_number">ロットナンバー</label>
                    <b-form-input type="text" id="lot_number" placeholder="ロットナンバー" v-model="formData.lot_number"
                                  v-bind:class="{ 'is-invalid': lotErrors.lot_number }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in lotErrors.lot_number" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="name">ロット名</label>
                    <b-form-input type="text" id="name" placeholder="ロット名" v-model="formData.name"
                                  v-bind:class="{ 'is-invalid': lotErrors.name }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in lotErrors.name" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="expiration_date">賞味期限</label>
                    <datepicker id="expiration_date"
                                placeholder="賞味期限"
                                :value="formData.expiration_date"
                                :format="DatePickerFormat"
                                :clear-button="true"
                                :bootstrap-styling="true"
                                :typeable="true"
                                v-on:selected="setExpirationDate"
                    >
                    </datepicker>
                    <div class="form-control" v-bind:class="{ 'is-invalid': lotErrors.expiration_date }" style="display: none;"></div>
                    <div v-for="(error, index) in lotErrors.expiration_date" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="ordered_at">発注日</label>
                    <datepicker id="ordered_at"
                                placeholder="発注日"
                                :value="formData.ordered_at"
                                :format="DatePickerFormat"
                                :clear-button="true"
                                :bootstrap-styling="true"
                                :typeable="true"
                                v-on:selected="setOrderedAtDate"
                    >
                    </datepicker>
                    <div class="form-control" v-bind:class="{ 'is-invalid': lotErrors.ordered_at }" style="display: none;"></div>
                    <div v-for="(error, index) in lotErrors.ordered_at" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="is_ten_days_notation">発注日時期表記フラグ</label>
                    <b-form-checkbox
                            id="is_ten_days_notation"
                            v-model="formData.is_ten_days_notation"
                            value="1"
                            unchecked-value="0"
                            v-bind:class="{ 'is-invalid': lotErrors.is_ten_days_notation }"
                    >
                    </b-form-checkbox>
                    <div v-for="(error, index) in lotErrors.is_ten_days_notation" v-bind:key="index" v-bind:value="error"
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
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';

  export default {
    name: 'lot-modal',
    components: {
      Datepicker,
      moment
    },
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['lots/lots'].find(data => data.id === this.id)) {
        return
      }
      await store.dispatch('lots/fetchLots');

    },
    props: {
      id: {
        type: Number,
        default: null
      },
    },
    data () {
      return {
        formData: {
          id: this.id,
          product_id: this.$route.params.id,
          lot_number: '',
          name: '',
          expiration_date: '',
          ordered_at: '',
          is_ten_days_notation: '',
        },
        DatePickerFormat: 'yyyy-MM-dd'
      }
    },
    computed: {
      lot() {
        return cloneDeep(this.lots.find(data => data.id == this.id));
      },
      ...mapGetters({
        lots: 'lots/lots',
        lotErrors: 'lots/errors',
        lotAlertMessage: 'lots/alertMessage',
        lotAlertStatus: 'lots/alertStatus',
      }),
    },
    mounted() {
      if (this.lot !== undefined) {
        this.formData.lot_number = this.lot.lot_number;
        this.formData.name = this.lot.name;
        this.formData.expiration_date = this.lot.expiration_date;
        this.formData.ordered_at = this.lot.ordered_at;
        this.formData.is_ten_days_notation = this.lot.is_ten_days_notation;
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        const data = { lot: this.formData };
        // 登録処理
        const response = await this.createLot(cloneDeep(data));
        // OK
        if (response.status) {
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
        const data = { lot: this.formData };
        // 更新処理
        const response = await this.updateLot(cloneDeep(data));
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
      async setOrderedAtDate(date) {
        this.formData.ordered_at = moment(date).format('YYYY-MM-DD');
      },
      async setExpirationDate(date) {
        this.formData.expiration_date = moment(date).format('YYYY-MM-DD');
      },
      ...mapActions('lots', ['createLot', 'updateLot', 'reset', 'resetErrors']),
    },
  }
</script>
