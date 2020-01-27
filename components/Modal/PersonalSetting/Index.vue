<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <template slot="header">
      <h3>個人設定</h3>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link">基本情報</a>
            </li>
          </ul>
        </div>
      </nav>
    </template>
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
    name: 'personal-setting-modal-index',
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
      ...mapActions('users', ['reset']),
    }
  }
</script>
