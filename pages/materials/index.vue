<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>材料管理</strong>
              <b-button variant="primary" class="float-right" href="/materials/new"><i class="fa fa-plus"></i> 新規追加</b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
            </div>
            <!-- 一覧 -->
            <b-table responsive="sm" :items="showMaterials" :fields="fields" :current-page="currentPage" :per-page="perPage">
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
    name: 'Materials',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('materials/fetchMaterials');
    },
    computed: {
      /**
       * テーブル用の材料一覧を取得
       *
       * @returns {[]}
       */
      showMaterials() {
        return this.materials.map(material => {
          return {
            'id': material.id,
            '親ロット名': material.parent_lot.name,
            '子ロット名': material.child_lot.name,
            '更新日': material.updated_at
          };
        })
      },
      ...mapGetters('materials', ['materials', 'alertMessage', 'alertStatus']),
    },
    data () {
      return {
        fields: ['id', '親ロット名', '子ロット名', '更新日', 'controls'],
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
        return this.materials.length
      },
      /**
       * 編集ボタン押下時
       *
       * @param material
       */
      onClickEdit(material) {
        // 編集画面へ遷移する
        this.$router.push(`/materials/${material.id}`)
      },
      /**
       * 削除ボタン押下時
       *
       * @param material
       */
      onClickDestroy(material) {
        if (confirm('本当に削除してもよろしいでしょうか。')) {
          const data = { material: material };
          // 削除処理
          this.deleteMaterial(cloneDeep(data));
        }
      },
      ...mapActions('materials', ['deleteMaterial'])
    }
  }
</script>

