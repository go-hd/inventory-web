<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">入庫確認待ち一覧</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <div>
        <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}
        </b-alert>
      </div>
      <b-row>
        <b-col sm="12">
          <b-table
                  :hover="hover"
                  :striped="striped"
                  :bordered="bordered"
                  :small="small"
                  :fixed="fixed"
                  responsive="sm"
                  :items="getReceivingTasks"
                  :fields="fields"
                  :current-page="currentPage"
                  :per-page="perPage"
          >
            <template slot="入庫確認完了" slot-scope="data">
              <b-button variant="primary" @click="onClickReceived(data.item.id)">入庫確認完了</b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </template>
    <!-- ボディ -->
    <!-- フッター -->
    <b-button variant="default" @click="onClickClose" slot="footer">
      閉じる
    </b-button>
    <!-- /フッター -->
  </ModalWrapper>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ModalWrapper from './ModalWrapper'

  export default {
    name: 'receiving-modal',
    components: {
      ModalWrapper,
    },
    props: {
      locationId: {
        type: Number,
        default: null
      },
      lot: {
        default: [],
      },
    },
    data () {
      return {
        formData: {
          id: this.id,
          type: '',
          location_id: '',
        },
        fields: [
          {key: '出庫元拠点'},
          {key: '個数'},
          {key: '入庫確認完了'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0
      }
    },
    computed: {
      /**
       * テーブル用の入庫確認待ちデータを取得
       *
       * @returns []
       */
      getReceivingTasks() {
        let datas = [];
        this.lot.receiving_tasks.map(receiving_task => {
          datas.push({
            id: receiving_task.id,
            出庫元拠点: receiving_task.shipping_location.name,
            個数: receiving_task.quantity
          });
        });
        return datas;
      },
      ...mapGetters('stock_moves', ['errors', 'alertMessage', 'alertStatus']),
    },
    methods: {
      /**
       * 入庫確認完了ボタン押下時
       */
      async onClickReceived(id) {
        this.reset();
        // 更新処理
        const response = await this.received(id);
        // OK
        if (response.status) {
          this.$emit('update');
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('stock_moves', ['received', 'reset']),
    },
  }
</script>
