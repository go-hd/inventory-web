<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>拠点管理 | 新規登録</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-form-group>
              <label for="name">拠点名</label>
              <b-form-input type="text" id="name" placeholder="拠点名" v-model="formData.name"
                            v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="company_id">会社</label>
              <b-form-select id="company_id" :options="getCompanyOptions" v-model="formData.company_id"
                             v-bind:class="{ 'is-invalid': errors.company_id }"></b-form-select>
              <div v-for="(error, index) in errors.company_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="location_type_id">拠点種別</label>
              <b-form-select id="company_id" :options="getLocationTypeOptions" v-model="formData.location_type_id" v-bind:class="{ 'is-invalid': errors.location_type_id }"></b-form-select>
              <div v-for="(error, index) in errors.location_type_id" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickCreateLocation()">登録する</b-button>
              <b-button type="button" variant="secondary" href="/locations">一覧に戻る</b-button>
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

  export default {
    name: 'Companies',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('companies/fetchCompanies');
      await store.dispatch('location_types/fetchLocationTypes');
    },
    computed: {
      /**
       * セレクトボックス用の会社一覧を取得
       *
       * @returns []
       */
      getCompanyOptions() {
        let options = [];
        options.push([]);
        this.companies.map(company => {
          options.push({value: company.id, text: company.name});
        });
        return options;
      },
      /**
       * セレクトボックス用の拠点種別一覧を取得
       *
       * @returns []
       */
      getLocationTypeOptions() {
        let options = [];
        options.push([]);
        this.locationTypes.map(locationType => {
          options.push({value: locationType.id, text: locationType.name});
        });
        return options;
      },
      ...mapGetters('locations', ['errors']),
      ...mapGetters('companies', ['companies']),
      ...mapGetters('location_types', ['locationTypes']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/locations',
        },{
          text: '新規登録',
          href: '#',
          active: true
        }],
        formData: {
          name: '',
          company_id: '',
          location_type_id: '',
        }
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateLocation() {
        const data = { location: this.formData };
        // 登録処理
        const response = await this.createLocation(cloneDeep(data));
        // OKであれば拠点一覧へ遷移する
        if (response.status) {
          this.$router.push('/locations');
        }
      },
      ...mapActions('locations', ['createLocation'])
    }
  }
</script>

