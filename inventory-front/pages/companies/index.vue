<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>会社管理</strong>
              <b-button variant="primary" class="float-right" href="/companies/new"><i class="fa fa-plus"></i> 新規追加</b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
            </div>
            <!-- 一覧 -->
            <b-table responsive="sm" :items="showCompanies" :fields="fields" :current-page="currentPage" :per-page="perPage">
              <template slot="controls" slot-scope="data">
                <b-button variant="success" @click="onClickEdit(data.item)"><i class="fa fa-pencil"></i> 編集</b-button>
                <b-button variant="danger" @click="onClickDestroy(data.item)"><i class="fa fa-trash"></i> 削除</b-button>
              </template>
            </b-table>
            <!-- /一覧 -->
            <!-- ページネーション -->
            <nav>
              <b-pagination :total-rows="getRowCount()" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
            <!-- /ページネーション -->
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
    },
    computed: {
      /**
       * データ整形したければここで行う
       *
       * @returns {[]}
       */
      showCompanies() {
        return this.companies.map(company => {
          return company
        })
      },
      ...mapGetters('companies', ['companies', 'alertMessage', 'alertStatus']),
    },
    data () {
      return {
        fields: [
          { key: 'id' },
          { key: 'name' },
          { key: 'updated_at' },
          { key: 'controls' },
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
      }
    },
    methods: {
      /**
       * データ数取得
       * @returns {number}
       */
      getRowCount() {
        return this.companies.length
      },
      /**
       * 編集ボタン押下時
       *
       * @param company
       */
      onClickEdit(company) {
        this.$router.push(`/companies/${company.id}`)
      },
      /**
       * 削除ボタン押下時
       *
       * @param company
       */
      onClickDestroy(company) {
        if (confirm('本当に削除してもよろしいでしょうか。')) {
          const data = { company: company };
          this.deleteCompany(cloneDeep(data));
        }
      },
      ...mapActions('companies', ['deleteCompany'])
    }
  }
</script>

