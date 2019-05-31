<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>会社管理 | 新規登録</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label for="name">会社名</label>
                  <b-form-input type="text" id="name" placeholder="会社名" v-model="formData.name" v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
                  <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                    {{ error }}
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickCreateCompany()">登録する</b-button>
              <b-button type="button" variant="secondary" href="/companies">一覧に戻る</b-button>
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
    computed: {
      ...mapGetters('companies', ['errors']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/companies',
        },{
          text: '新規登録',
          href: '#',
          active: true
        }],
        formData: {
          name: '',
        }
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreateCompany() {
        const data = { company: this.formData };
        // 登録処理
        const response = await this.createCompany(cloneDeep(data));
        // OKであれば会社一覧へ遷移する
        if (response.status) {
          this.$router.push('/companies');
        }
      },
      ...mapActions('companies', ['createCompany'])
    }
  }
</script>

