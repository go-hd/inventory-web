<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>拠点種別管理</strong>
              <b-button variant="primary" class="float-right" href="/location_types/new"><i class="fa fa-plus"></i> 新規登録</b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
            </div>
            <!-- 一覧 -->
            <b-table responsive="sm" :items="showLocationTypes" :fields="fields" :current-page="currentPage" :per-page="perPage">
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
    name: 'LocationTypes',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('location_types/fetchLocationTypes');
    },
    computed: {
      /**
       * テーブル用の拠点種別一覧を取得
       *
       * @returns {[]}
       */
      showLocationTypes() {
        return this.locationTypes.map(locationType => {
          return {
            'id': locationType.id,
            '名称': locationType.name,
            '会社名': locationType.company.name,
            '備考': locationType.note,
            '更新日': locationType.updated_at
          };
        })
      },
      ...mapGetters('location_types', ['locationTypes', 'alertMessage', 'alertStatus']),
    },
    data () {
      return {
        fields: ['id', '名称', '会社名', '備考', '更新日', 'controls'],
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
        return this.locationTypes.length
      },
      /**
       * 編集ボタン押下時
       *
       * @param locationType
       */
      onClickEdit(locationType) {
        // 編集画面へ遷移する
        this.$router.push(`/location_types/${locationType.id}`)
      },
      /**
       * 削除ボタン押下時
       *
       * @param locationType
       */
      onClickDestroy(locationType) {
        if (confirm('本当に削除してもよろしいでしょうか。')) {
          const data = { locationType: locationType };
          // 削除処理
          this.deleteLocationType(cloneDeep(data));
        }
      },
      ...mapActions('location_types', ['deleteLocationType'])
    }
  }
</script>

