<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <template slot="header">
      <h3>ロット在庫情報更新</h3>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'active': isStockEdit }">
              <a class="nav-link" @click="onClickStockEdit">ロット在庫情報</a>
            </li>
            <li class="nav-item" :class="{ 'active': isRequest }">
              <a class="nav-link" @click="onClickRequest">発注依頼</a>
            </li>
          </ul>
        </div>
      </nav>
    </template>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <!-- ロット在庫情報 -->
      <div v-if="isStockEdit">
        <Form
          :location="location"
          :lot="lot"
          :stockHistoryTypes="stockHistoryTypes"
          @close="onClickClose"
          @update="onUpdate"
        >
        </Form>
      </div>
      <!-- 発注依頼 -->
      <div v-if="isRequest">
        <RequestForm
          :location="location"
          :lot="lot"
          :locations="locations"
          @close="onClickClose"
        >
        </RequestForm>
      </div>
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
  import {mapActions} from 'vuex'
  import ModalWrapper from '../ModalWrapper'
  import Form from './Form'
  import RequestForm from './RequestForm'

  export default {
    name: 'stock-modal-index',
    components: {
      ModalWrapper,
      Form,
      RequestForm,
    },
    props: {
      location: {
        default: [],
      },
      lot: {
        default: [],
      },
      stockHistoryTypes: {
        default: [],
      },
      locations: {
        default: [],
      },
    },
    data() {
      return {
        isStockEdit: true,
        isRequest: false,
      }
    },
    methods: {
      /**
       * ロット在庫情報タブ押下時
       */
      async onClickStockEdit() {
        this.isStockEdit = true;
        this.isRequest = false;
      },
      /**
       * 発注依頼タブ押下時
       */
      async onClickRequest() {
        this.isStockEdit = false;
        this.isRequest = true;
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetStock();
        this.resetRequest();
        this.$emit('close');
      },
      onUpdate() {
        this.$emit('update');
      },
      ...mapActions({
        resetStock: 'stock_histories/reset',
        resetRequest: 'stock_moves/reset',
      }),
    },
  }
</script>
