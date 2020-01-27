<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">{{ palette.type }} パレット個数更新</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
     <Form
       :id="id"
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
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import ModalWrapper from '../../ModalWrapper'
  import Form from './Form'

  export default {
    name: 'palette-modal-move-index',
    components: {
      ModalWrapper,
      Form,
    },
    props: {
      id: {
        type: Number,
        default: null
      },
    },
    computed: {
      palette() {
        return cloneDeep(this.palettes.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('palettes', ['palettes']),
    },
    methods: {
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('palettes', ['reset']),
    },
  }
</script>
