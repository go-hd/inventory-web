<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>ロット管理 | 新規登録</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-form-group>
              <label for="lot_number">ロットナンバー</label>
              <b-form-input type="text" id="lot_number" placeholder="ロットナンバー" v-model="formData.lot_number"
                            v-bind:class="{ 'is-invalid': errors.lot_number }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.lot_number" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="name">ロット名</label>
              <b-form-input type="text" id="name" placeholder="ロット名" v-model="formData.name"
                            v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="jan_code">JANコード</label>
              <b-form-input type="text" id="jan_code" placeholder="JANコード" v-model="formData.jan_code"
                            v-bind:class="{ 'is-invalid': errors.jan_code }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.jan_code" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="expiration_date">賞味期限</label>
              <datepicker id="expiration_date"
                          placeholder="賞味期限"
                          value="formData.expiration_date"
                          :format="DatePickerFormat"
                          :clear-button="true"
                          :input-class="form-control"
                          :bootstrap-styling="true"
                          :typeable="true"
                          v-on:selected="setExpirationDate"
              >
              </datepicker>
              <div class="form-control" v-bind:class="{ 'is-invalid': errors.jan_code }" style="display: none;"></div>
              <div v-for="(error, index) in errors.expiration_date" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="ordered_at">発注日</label>
              <datepicker id="ordered_at"
                          placeholder="発注日"
                          value="formData.ordered_at"
                          :format="DatePickerFormat"
                          :clear-button="true"
                          :input-class="form-control"
                          :bootstrap-styling="true"
                          :typeable="true"
                          v-on:selected="setOrderedAtDate"
              >
              </datepicker>
              <div class="form-control" v-bind:class="{ 'is-invalid': errors.jan_code }" style="display: none;"></div>
              <div v-for="(error, index) in errors.ordered_at" v-bind:key="index" v-bind:value="error"
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
                      v-bind:class="{ 'is-invalid': errors.is_ten_days_notation }"
              >
              </b-form-checkbox>
              <div v-for="(error, index) in errors.is_ten_days_notation" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="location_id">拠点</label>
              <b-form-select id="location_id" :options="getLocationOptions" v-model="formData.location_id"
                             v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
              <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="brand_id">ブランド</label>
              <b-form-select id="brand_id" :options="getBrandOptions" v-model="formData.brand_id"
                             v-bind:class="{ 'is-invalid': errors.brand_id }"></b-form-select>
              <div v-for="(error, index) in errors.brand_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickCreateLot()">登録する</b-button>
              <b-button type="button" variant="secondary" href="/lots">一覧に戻る</b-button>
            </div>
            <!-- /フォーム -->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';

  export default {
    name: 'Companies',
    components: {
      Datepicker,
      moment
    },
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('locations/fetchLocations');
      await store.dispatch('brands/fetchBrands');
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
          options.push({value: location.id, text: location.name});
        });
        return options;
      },
      /**
       * セレクトボックス用のブランド一覧を取得
       *
       * @returns []
       */
      getBrandOptions() {
        let options = [];
        options.push([]);
        this.brands.map(brand => {
          options.push({value: brand.id, text: brand.name});
        });
        return options;
      },
      ...mapGetters('lots', ['errors']),
      ...mapGetters('locations', ['locations']),
      ...mapGetters('brands', ['brands']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/lots',
        },{
          text: '新規登録',
          href: '#',
          active: true
        }],
        formData: {
          lot_number: '',
          name: '',
          jan_code: '',
          expiration_date: '',
          ordered_at: '',
          is_ten_days_notation: '',
          location_id: '',
          brand_id: '',
        },
        DatePickerFormat: 'yyyy-MM-dd'
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateLot() {
        const data = { lot: this.formData };
        // 登録処理
        const response = await this.createLot(cloneDeep(data));
        // OKであればロット一覧へ遷移する
        if (response.status) {
          this.$router.push('/lots');
        }
      },
      async setOrderedAtDate(date) {
        this.formData.ordered_at = moment(date).format('YYYY-MM-DD');
      },
      async setExpirationDate(date) {
        this.formData.expiration_date = moment(date).format('YYYY-MM-DD');
      },
      ...mapActions('lots', ['createLot'])
    }
  }
</script>
