<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>パレット管理 | 編集</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">種別</label>
                  <b-form-input type="text" id="type" placeholder="種別" v-model="palette.type" v-bind:class="{ 'is-invalid': errors.type }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.type" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="location_id">拠点</label>
                  <b-form-select id="location_id" :options="getLocationOptions" v-model="palette.location_id"
                                 v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
                  <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
                       class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              <b-button type="button" variant="secondary" href="/palettes">一覧に戻る</b-button>
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
    name: 'Palettes',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['palettes/palettes'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id});
      await store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id});
      await store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * IDにひもづくパレットを取得
       *
       * @returns {[]}
       */
      palette() {
        return cloneDeep(this.palettes.find(data => data.id == this.$route.params.id));
      },
      /**
       * セレクトボックス用の拠点一覧を取得
       *
       * @returns []
       */
      getLocationOptions() {
        let options = [];
        options.push([]);
        this.locations.map(location => {
          options.push({value: location.id, text: location.name});
        });
        return options;
      },
      ...mapGetters('palettes', ['palettes', 'errors']),
      ...mapGetters('locations', ['locations']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/palettes',
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
        const data = { palette: this.palette };
        // 更新処理
        const response = await this.updatePalette(cloneDeep(data));
        // OKであればパレット一覧へ遷移する
        if (response.status) {
          this.$router.push('/palettes');
        }
      },
      ...mapActions('palettes', ['updatePalette'])
    },
  }
</script>

