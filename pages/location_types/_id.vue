<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>拠点種別管理 | 編集</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">拠点種別名</label>
                  <b-form-input type="text" id="name" placeholder="拠点種別名" v-model="locationType.name" v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="company_id">会社</label>
                  <b-form-select id="company_id" :options="getCompanyOptions" v-model="locationType.company_id" v-bind:class="{ 'is-invalid': errors.company_id }"></b-form-select>
                  <div v-for="(error, index) in errors.company_id" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="note">備考</label>
                  <b-form-textarea
                          id="note"
                          v-model="locationType.note"
                          rows="3"
                          max-rows="6"
                          v-bind:class="{ 'is-invalid': errors.note }"
                  ></b-form-textarea>
                  <div v-for="(error, index) in errors.note" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              <b-button type="button" variant="secondary" href="/location_types">一覧に戻る</b-button>
            </div>
            <!-- /フォーム -->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'LocationTypes',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['location_types/locationTypes'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('location_types/fetchLocationTypes');
      await store.dispatch('companies/fetchCompanies');
    },
    computed: {
      /**
       * IDにひもづく拠点種別を取得
       *
       * @returns {[]}
       */
      locationType() {
        return cloneDeep(this.locationTypes.find(data => data.id == this.$route.params.id));
      },
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
      ...mapGetters('location_types', ['locationTypes', 'alertMessage', 'alertStatus', 'errors']),
      ...mapGetters('companies', ['companies']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/location_types',
        },{
          text: '編集',
          href: '#',
          active: true
        }],
      }
    },
    methods: {
      /**
       * 更新ボタン押下時
       */
      async onClickUpdate() {
        const data = { locationType: this.locationType };
        // 更新処理
        const response = await this.updateLocationType(cloneDeep(data));
        // OKであれば拠点種別一覧へ遷移する
        if (response.status) {
          this.$router.push('/location_types');
        }
      },
      ...mapActions('location_types', ['updateLocationType'])
    },
  }
</script>

