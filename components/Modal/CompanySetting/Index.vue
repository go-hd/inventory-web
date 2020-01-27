<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <template slot="header">
      <h3>会社設定</h3>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'active': isBase }">
              <a class="nav-link" @click="onClickBaseEdit">基本情報</a>
            </li>
            <li class="nav-item" :class="{ 'active': isLocationType }">
              <a class="nav-link" @click="onClickLocationTypeEdit">拠点種別</a>
            </li>
          </ul>
        </div>
      </nav>
    </template>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <!-- 基本情報 -->
      <div v-if="isBase">
        <Form></Form>
      </div>
      <!-- /基本情報 -->
      <!-- 拠点種別 -->
      <div v-if="isLocationType">
        <LocationTypeForm></LocationTypeForm>
      </div>
      <!-- /拠点種別 -->
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
  import Form from './Form'
  import LocationTypeForm from './LocationTypeForm'
  import ModalWrapper from '../ModalWrapper'

  export default {
    name: 'company-setting-modal-index',
    components: {
      ModalWrapper,
      Form,
      LocationTypeForm,
    },
    data () {
      return {
        isBase: true,
        isLocationType: false,
      }
    },
    methods: {
      /**
       * 基本情報タブ押下時
       */
      async onClickBaseEdit() {
       this.isBase = true;
       this.isLocationType = false;
      },
      /**
       * 拠点種別タブ押下時
       */
      async onClickLocationTypeEdit() {
        this.isBase = false;
        this.isLocationType = true;
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetCompany();
        this.resetLocationType();
        this.$emit('close');
      },
      ...mapActions({
        resetCompany: 'companies/reset',
        resetLocationType: 'location_types/reset',
      }),
    }
  }
</script>
