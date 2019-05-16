<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>パレット管理 | 新規登録</strong>
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
                  <b-form-input type="text" id="type" placeholder="種別" v-model="formData.type" v-bind:class="{ 'is-invalid': errors.type }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.type" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
                <b-form-group>
                  <label for="location_id">拠点</label>
                  <b-form-select id="location_id" :options="getLocationOptions" v-model="formData.location_id"
                                 v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
                  <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
                       class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickCreatePalette()">登録する</b-button>
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
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'Users',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('locations/fetchLocations');
    },
    computed: {
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
      ...mapGetters('palettes', ['errors']),
      ...mapGetters('locations', ['locations']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/palettes',
        },{
          text: '新規登録',
          href: '#',
          active: true
        }],
        formData: {
          type: '',
          location_id: '',
        }
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreatePalette() {
        const data = { palette: this.formData };
        // 登録処理
        const response = await this.createPalette(cloneDeep(data));
        // OKであればパレット一覧へ遷移する
        if (response.status) {
          this.$router.push('/palettes');
        }
      },
      ...mapActions('palettes', ['createPalette'])
    }
  }
</script>

