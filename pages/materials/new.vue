<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>材料管理 | 新規登録</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-form-group>
              <label for="parent_lot_id">親ロット</label>
              <b-form-select id="parent_lot_id" :options="getLotOptions" v-model="formData.parent_lot_id"
                             v-bind:class="{ 'is-invalid': errors.parent_lot_id }"></b-form-select>
              <div v-for="(error, index) in errors.parent_lot_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="child_lot_id">子ロット</label>
              <b-form-select id="child_lot_id" :options="getLotOptions" v-model="formData.child_lot_id"
                             v-bind:class="{ 'is-invalid': errors.child_lot_id }"></b-form-select>
              <div v-for="(error, index) in errors.child_lot_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="note">備考</label>
              <b-form-textarea
                      id="note"
                      placeholder="備考"
                      v-model="formData.note"
                      rows="3"
                      max-rows="6"
                      v-bind:class="{ 'is-invalid': errors.note }"
              ></b-form-textarea>
              <div v-for="(error, index) in errors.note" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickCreateMaterial()">登録する</b-button>
              <b-button type="button" variant="secondary" href="/materials">一覧に戻る</b-button>
            </div>
            <!-- /フォーム -->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'Companies',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('lots/fetchLots');
    },
    computed: {
      /**
       * セレクトボックス用のロット一覧を取得
       *
       * @returns []
       */
      getLotOptions() {
        let options = [];
        options.push([]);
        this.lots.map(lot => {
          options.push({value: lot.id, text: lot.name});
        });
        return options;
      },
      ...mapGetters('materials', ['errors']),
      ...mapGetters('lots', ['lots']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/materials',
        },{
          text: '新規登録',
          href: '#',
          active: true
        }],
        formData: {
          name: '',
          parent_lot_id: '',
          child_lot_id: '',
          note: '',
        }
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateMaterial() {
        const data = { material: this.formData };
        // 登録処理
        const response = await this.createMaterial(cloneDeep(data));
        // OKであれば材料一覧へ遷移する
        if (response.status) {
          this.$router.push('/materials');
        }
      },
      ...mapActions('materials', ['createMaterial'])
    }
  }
</script>

