<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>会社管理 | 編集</strong>
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
                  <b-form-input type="text" id="name" placeholder="会社名" v-model="formData.name"></b-form-input>
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
  import { mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'Companies',
    asyncData({ redirect, store }) {
      return {
        formData: {
          name: '',
        }
      }
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/companies',
        },{
          text: '新規',
          href: '#',
          active: true
        }],
      }
    },
    methods: {
      async onClickCreateCompany() {
        const data = { company: this.formData };
        await this.createCompany(cloneDeep(data));
        this.$router.push('/companies');
      },
      ...mapActions('companies', ['createCompany'])
    }
  }
</script>

