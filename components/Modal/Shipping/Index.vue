<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">出庫待ち一覧</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
     <Form
       :locationId="locationId"
       :lot="lot"
       @close="onClickClose"
     >
     </Form>
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
  import { mapActions } from 'vuex'
  import ModalWrapper from '../ModalWrapper'
  import Form from './Form'

  export default {
    name: 'shipping-modal-index',
    components: {
      ModalWrapper,
      Form,
    },
    props: {
      locationId: {
        type: String,
        default: null
      },
      lot: {
        default: [],
      },
    },
    methods: {
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('stock_moves', ['reset']),
    },
  }
</script>
