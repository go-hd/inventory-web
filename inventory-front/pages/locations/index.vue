<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>拠点管理</strong>
              <b-button variant="primary" class="float-right" href="/locations/new"><i class="fa fa-plus"></i> 新規追加</b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
            </div>
            <!-- 一覧 -->
            <b-table responsive="sm" :items="showLocations" :fields="fields" :current-page="currentPage" :per-page="perPage">
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
    name: 'Locations',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('locations/fetchLocations');
    },
    computed: {
      /**
       * テーブル用の拠点一覧を取得
       *
       * @returns {[]}
       */
      showLocations() {
        return this.locations.map(location => {
          return {
            'id': location.id,
            '名称': location.name,
            '会社名': location.company.name,
            '拠点種別名': location.location_type.name,
            '更新日': location.updated_at
          };
        })
      },
      ...mapGetters('locations', ['locations', 'alertMessage', 'alertStatus']),
    },
    data () {
      return {
        fields: ['id', '名称', '会社名', '拠点種別名', '更新日', 'controls'],
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
        return this.locations.length
      },
      /**
       * 編集ボタン押下時
       *
       * @param location
       */
      onClickEdit(location) {
        // 編集画面へ遷移する
        this.$router.push(`/locations/${location.id}`)
      },
      /**
       * 削除ボタン押下時
       *
       * @param location
       */
      onClickDestroy(location) {
        if (confirm('本当に削除してもよろしいでしょうか。')) {
          const data = { location: location };
          // 削除処理
          this.deleteLocation(cloneDeep(data));
        }
      },
      ...mapActions('locations', ['deleteLocation'])
    }
  }
</script>

