<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">商品情報更新</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <Form
        :id="id"
        :brand_id="brand_id"
        @close="onClickClose"
      ></Form>
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
    name: 'product-modal-index',
    components: {
      ModalWrapper,
      Form,
    },
    props: {
      brand_id: {
        type: Number,
        default: null
      },
      id: {
        type: Number,
        default: null
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
      ...mapActions('products', ['reset']),
    },
  }
</script>
