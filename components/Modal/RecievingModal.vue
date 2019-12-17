<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>入庫確認待ち一覧</h3>
          </div>
          <div class="modal-body">
            <slot name="body">
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
                    :items="getRecievingTasks"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                  >
                    <template slot="入庫確認完了" slot-scope="data">
                      <b-button variant="primary" @click="onClickRecieved(data.item.id)">入庫確認完了</b-button>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </slot>
          </div>

          <div class="modal-footer">
            <b-button variant="default" @click="onClickClose">
              閉じる
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'recieving-modal',
    components: {
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
      getRecievingTasks() {
        let datas = [];
        this.lot.recieving_tasks.map(recieving_task => {
          datas.push({
            id: recieving_task.id,
            出庫元拠点: recieving_task.shipping_location.name,
            個数: recieving_task.quantity
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
      async onClickRecieved(id) {
        this.reset();
        // 更新処理
        const response = await this.recieved(id);
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
      ...mapActions('stock_moves', ['recieved', 'reset']),
    },
  }
</script>
