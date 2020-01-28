<template>
  <div>
    <div>
      <b-alert v-if="alertMessage" show :variant="alertStatus">
        {{ alertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-table
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
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'receiving-modal-form',
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
      ...mapActions('stock_moves', ['received', 'reset']),
    },
  }
</script>
