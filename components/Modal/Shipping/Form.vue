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
         :items="getShippingTasks"
         :fields="fields"
         :current-page="currentPage"
         :per-page="perPage"
       >
         <template slot="出庫完了" slot-scope="data">
           <b-button variant="primary" @click="onClickShipped(data.item.id)">出庫完了</b-button>
         </template>
       </b-table>
     </b-col>
   </b-row>
 </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'shipping-modal-form',
    props: {
      locationId: {
        type: String,
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
          {key: '出庫先拠点'},
          {key: '個数'},
          {key: '出庫完了'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0
      }
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
       * テーブル用の出庫待ちデータを取得
       *
       * @returns []
       */
      getShippingTasks() {
        let datas = [];
        this.lot.shipping_tasks.map(shipping_task => {
          datas.push({
            id: shipping_task.id,
            出庫先拠点: shipping_task.receiving_location.name,
            個数: shipping_task.quantity
          });
        });
        return datas;
      },
      ...mapGetters('stock_moves', ['errors', 'alertMessage', 'alertStatus']),
    },
    methods: {
      /**
       * 出庫完了ボタン押下時
       */
      async onClickShipped(id) {
        this.reset();
        // 更新処理
        const response = await this.shipped(id);
        // OK
        if (response.status) {
          this.$emit('update');
        }
      },
      ...mapActions('stock_moves', ['shipped', 'reset']),
    },
  }
</script>
