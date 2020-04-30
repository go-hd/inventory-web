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
            v-if="Number(formData.is_ten_days_notation) !== 1"
          />
          <div v-if="Number(formData.is_ten_days_notation) === 1">
            <b-form-select
              v-model="formData.ordered_at_month"
              :value="formData.ordered_at_month"
              :plain="true"
              :options="[1,2,3,4,5,6,7,8,9,10,11,12]">
            </b-form-select>
            <br>
            <b-form-select
              v-model="formData.ordered_at_ten_days_notation"
              :value="formData.ordered_at_ten_days_notation"
              :plain="true"
              :options="['上旬', '中旬', '下旬']">
            </b-form-select>
          </div>
          <div class="form-control" :class="{ 'is-invalid': lotErrors.ordered_at }" style="display: none;"></div>
          <div v-for="(error, index) in lotErrors.ordered_at" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>旬間で指定</label>
          <b-form-checkbox
            id="is_ten_days_notation"
            v-model="formData.is_ten_days_notation"
            value=1
            unchecked-value=0
            :class="{ 'is-invalid': lotErrors.is_ten_days_notation }">
          </b-form-checkbox>
          <div v-for="(error, index) in lotErrors.is_ten_days_notation" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>発注数</label>
          <b-form-input
            type="number"
            id="ordered_quantity"
            placeholder="発注数"
            v-model="formData.ordered_quantity"
            :class="{ 'is-invalid': lotErrors.ordered_quantity }"
            class="form-control">
          </b-form-input>

          <div v-for="(error, index) in lotErrors.ordered_quantity" :key="index" :value="error"
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
          user_id: this.$store.$auth.user.id,
          product_id: this.$route.params.id,
          lot_number: this.getRandomLotNumber,
          name: '',
          expiration_date: '',
          ordered_at: '',
          is_ten_days_notation: '',
          ordered_quantity: 0,
          ordered_at_month: 1,
          ordered_at_ten_days_notation: '上旬',
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
        this.formData.ordered_quantity = this.lot.ordered_quantity ? this.lot.ordered_quantity : 0;
        this.formData.ordered_at_month = this.lot.ordered_at_month;
        this.formData.ordered_at_ten_days_notation = this.lot.ordered_at_ten_days_notation;
      } else {
        // 新規登録の場合はランダムなロットナンバーを生成する
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
        let formData = cloneDeep(this.formData);
        formData.ordered_at = this.getOrderedAt();
        // 登録処理
        const response = await this.createLot({lot: formData, sort: this.sort});
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
        let formData = cloneDeep(this.formData);
        formData.ordered_at = this.getOrderedAt();
        // 更新処理
        const response = await this.updateLot({lot: formData});
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
      getOrderedAt() {
        if (Number(this.formData.is_ten_days_notation) === 1) {
          // 旬間から日付を算出する
          let day = 1;
          if (this.formData.ordered_at_ten_days_notation === '中旬') {
            day = 11;
          } else if (this.formData.ordered_at_ten_days_notation === '下旬') {
            day = 21;
          }
          return new Date().getFullYear() + "-" + this.formData.ordered_at_month + "-" + day;
        }
        return this.formData.ordered_at;
      },
      ...mapActions('lots', ['createLot', 'updateLot']),
    },
  }
</script>
