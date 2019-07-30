<template>
  <div class="container">
    <div>
      <b-alert v-if="alertMessage" show variant="danger">{{ alertMessage }}</b-alert>
    </div>
    <b-row class="justify-content-center mt-5">
      <b-col md="5">
        <div>ようこそ</div>
        <div>{{ this.company.name }}さん</div>
        <b-form-group>
          <b-input-group>
            <b-form-input type="text" id="email" placeholder="メールアドレス" v-model="user.email" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="onClickCreate()">登録</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    layout: 'guest',
    /**
     * データ取得
     */
    async asyncData({ store, route, redirect }) {
      if (route.params.id == null) {
        redirect('/register/search');
      }
      if (store.getters['companies/companies'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('companies/fetchCompanies')
    },
    data() {
      return {
        user: {
          email: ''
        }
      }
    },
    computed: {
      /**
       * IDにひもづく会社を取得
       *
       * @returns {[]}
       */
      company() {
        return cloneDeep(this.companies.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('companies', ['companies', 'alertMessage', 'alertStatus', 'errors'])
    },
    methods: {
      /**
       * 登録ボタン押下時
       */
      async onClickCreate() {
        const data = { user: this.user };
        // 更新処理
        const response = await this.createUser(cloneDeep(data));
        // OKであればユーザー一覧へ遷移する
        // if (response.status) {
        //   this.$router.push('/users');
        // }
      },
      ...mapActions('users', ['createUser'])
    }
  }
</script>
