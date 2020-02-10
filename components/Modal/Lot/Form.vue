<template>
  <div>
    <div>
      <b-alert v-if="lotAlertMessage" show :variant="lotAlertStatus">
        {{ lotAlertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>ロットナンバー</label>
          <b-form-input
            type="text"
            id="lot_number"
            placeholder="ロットナンバー"
            v-model="formData.lot_number"
            :class="{ 'is-invalid': lotErrors.lot_number }"
            class="form-control">
          </b-form-input>
          <div v-for="(error, index) in lotErrors.lot_number" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>ロット名</label>
          <b-form-input
            type="text"
            id="name"
            placeholder="ロット名"
            v-model="formData.name"
            :class="{ 'is-invalid': lotErrors.name }"
            class="form-control">
          </b-form-input>
          <div v-for="(error, index) in lotErrors.name" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>賞味期限</label>
          <datepicker
            id="expiration_date"
            placeholder="賞味期限"
            :value="formData.expiration_date"
            :format="DatePickerFormat"
            :clear-button="true"
            :bootstrap-styling="true"
            :typeable="true"
            v-on:selected="setExpirationDate"
          />
          <div class="form-control" :class="{ 'is-invalid': lotErrors.expiration_date }" style="display: none;"></div>
          <div v-for="(error, index) in lotErrors.expiration_date" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>発注日</label>
          <datepicker id="ordered_at"
            placeholder="発注日"
            :value="formData.ordered_at"
            :format="DatePickerFormat"
            :clear-button="true"
            :bootstrap-styling="true"
            :typeable="true"
            v-on:selected="setOrderedAtDate"
          />
          <div class="form-control" :class="{ 'is-invalid': lotErrors.ordered_at }" style="display: none;"></div>
          <div v-for="(error, index) in lotErrors.ordered_at" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>発注日時期表記フラグ</label>
          <b-form-checkbox
            id="is_ten_days_notation"
            v-model="formData.is_ten_days_notation"
            value="1"
            unchecked-value="0"
            :class="{ 'is-invalid': lotErrors.is_ten_days_notation }">
          </b-form-checkbox>
          <div v-for="(error, index) in lotErrors.is_ten_days_notation" :key="index" :value="error"
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
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';

  export default {
    name: 'lot-modal-form',
    components: {
      Datepicker,
      moment,
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
      lots: {
        default: [],
      },
      sort: {
        default: 'desc',
      },
    },
    data () {
      return {
        formData: {
          id: this.id,
          product_id: this.$route.params.id,
          lot_number: this.getRandomLotNumber,
          name: '',
          expiration_date: '',
          ordered_at: '',
          is_ten_days_notation: '',
        },
        DatePickerFormat: 'yyyy-MM-dd',
      }
    },
    computed: {
      lot() {
        return cloneDeep(this.lots.find(data => data.id == this.id));
      },
      /**
       * ランダムなロットナンバーを取得
       * (12桁の半角英数字)
       */
      getRandomLotNumber() {
        const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = 12;
        return Array.from(Array(length)).map(() => string[Math.floor(Math.random() * string.length)]).join('');
      },
      ...mapGetters({
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
      } else {
        this.formData.lot_number = this.getRandomLotNumber;
      }
    },
    methods: {
      /**
       * [ロット情報] 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        // 登録処理
        const response = await this.createLot({lot: cloneDeep(this.formData), sort: this.sort});
        // OK
        if (response.status) {
          this.$emit('update');
          this.$emit('close');
        }
      },
      /**
       * [ロット情報] 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { lot: this.formData };
        // 更新処理
        const response = await this.updateLot(cloneDeep(data));
        // OK
        if (response.status) {
          this.$emit('update');
          this.$emit('close');
        }
      },
      /**
       * 発注日のフォーマット
       *
       * @param date
       * @returns {Promise<void>}
       */
      async setOrderedAtDate(date) {
        this.formData.ordered_at = moment(date).format('YYYY-MM-DD');
      },
      /**
       * 賞味期限のフォーマット
       *
       * @param date
       * @returns {Promise<void>}
       */
      async setExpirationDate(date) {
        this.formData.expiration_date = moment(date).format('YYYY-MM-DD');
      },
      ...mapActions('lots', ['createLot', 'updateLot']),
    },
  }
</script>
