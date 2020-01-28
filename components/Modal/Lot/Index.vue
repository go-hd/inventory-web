<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <template slot="header">
      <h3>ロット情報更新</h3>
      <nav v-if="id !== null" class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'active': isLot }">
              <a class="nav-link" @click="onClickLotEdit">ロット情報</a>
            </li>
            <li class="nav-item" :class="{ 'active': isMaterial }">
              <a class="nav-link" @click="onClickMaterialEdit">材料設定</a>
            </li>
          </ul>
        </div>
      </nav>
    </template>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <!-- ロット設定 -->
      <div v-if="isLot">
        <Form
          :id="id"
          :lots="lots"
          @close="onClickClose"
          @update="onUpdate"
        >
        </Form>
      </div>
      <!-- /ロット設定 -->
      <!-- 材料設定 -->
      <div v-if="isMaterial">
        <MaterialForm
          :id="id"
          :lots="lots"
        >
        </MaterialForm>
      </div>
      <!-- /材料設定 -->
    </template>
    <!-- /ボディ -->
    <!-- フッター -->
    <b-button variant="default" @click="onClickClose" slot="footer">
      閉じる
    </b-button>
    <!-- /フッター -->
  </ModalWrapper>
</template>

<script>
  import { mapActions } from 'vuex'
  import 'vue-select/dist/vue-select.css';
  import ModalWrapper from '../ModalWrapper'
  import Form from './Form'
  import MaterialForm from './MaterialForm'

  export default {
    name: 'lot-modal-index',
    components: {
      ModalWrapper,
      Form,
      MaterialForm,
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
      lots: {
        default: [],
      },
    },
    data () {
      return {
        isLot: true,
        isMaterial: false,
      }
    },
    methods: {
      /**
       * ロット情報タブ押下時
       */
      async onClickLotEdit() {
        this.isLot = true;
        this.isMaterial = false;
      },
      /**
       * 材料設定タブ押下時
       */
      async onClickMaterialEdit() {
        this.isLot = false;
        this.isMaterial = true;
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetLots();
        this.resetMaterials();
        this.$emit('close');
      },
      /**
       * 更新時
       */
      onUpdate() {
        this.$emit('update');
      },
      ...mapActions({
        resetLots: 'lots/reset',
        resetMaterials: 'materials/reset',
      }),
    },
  }
</script>
