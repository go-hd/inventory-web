<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>ブランド管理 | 編集</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">ブランド名</label>
                  <b-form-input type="text" id="name" placeholder="ブランド名" v-model="brand.name" v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="code">コード</label>
                  <b-form-input type="text" id="code" placeholder="コード" v-model="brand.code" v-bind:class="{ 'is-invalid': errors.code }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.code" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="note">備考</label>
                  <b-form-textarea
                          id="note"
                          v-model="brand.note"
                          rows="3"
                          max-rows="6"
                          v-bind:class="{ 'is-invalid': errors.note }"
                  ></b-form-textarea>
                  <div v-for="(error, index) in errors.note" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              <b-button type="button" variant="secondary" href="/brands">一覧に戻る</b-button>
            </div>
            <!-- /フォーム -->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'Brands',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['brands/brands'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('brands/fetchBrands');
    },
    computed: {
      /**
       * IDにひもづくブランドを取得
       *
       * @returns {[]}
       */
      brand() {
        return cloneDeep(this.brands.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('brands', ['brands', 'errors'])
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/brands',
        },{
          text: '編集',
          href: '#',
          active: true
        }],
      }
    },
    methods: {
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { brand: this.brand };
        // 更新処理
        const response = await this.updateBrand(cloneDeep(data));
        // OKであればブランド一覧へ遷移する
        if (response.status) {
          this.$router.push('/brands');
        }
      },
      ...mapActions('brands', ['updateBrand'])
    },
  }
</script>

