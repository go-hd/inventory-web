<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">メンバー招待</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
     <Form
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
    name: 'invite-modal-index',
    components: {
      ModalWrapper,
      Form,
    },
    methods: {
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('users', ['reset'])
    }
  }
</script>
