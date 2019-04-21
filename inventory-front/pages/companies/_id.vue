<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>会社管理 | 編集</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">会社名</label>
                  <b-form-input type="text" id="name" placeholder="会社名" v-model="company.name" v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              <b-button type="button" variant="secondary" href="/companies">一覧に戻る</b-button>
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
    name: 'Companies',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['companies/companies'].find(c => c.id === route.params.id)) {
        return
      }
      await store.dispatch('companies/fetchCompanies')
    },
    computed: {
      /**
       * IDにひもづくcompanyを取得
       *
       * @returns {[]}
       */
      company() {
        return this.companies.find(c => c.id == this.$route.params.id)
      },
      ...mapGetters('companies', ['companies', 'alertMessage', 'alertStatus', 'errors'])
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/companies',
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
        const data = { company: this.company };
        const response = await this.updateCompany(cloneDeep(data));

        if (response.status) {
          this.$router.push('/companies');
        }
      },
      ...mapActions('companies', ['updateCompany'])
    },
  }
</script>

