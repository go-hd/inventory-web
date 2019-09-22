<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div>
        <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
      </div>
      <b-row>
        <b-col sm="8">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-plus"></i> <strong>招待する</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- フォーム -->
            <b-form-group>
              <b-input-group>
                <b-form-input type="email" placeholder="メールアドレス" v-model="formData.email"
                              v-bind:class="{ 'is-invalid': errors.email }" class="form-control"></b-form-input>
                <!-- Attach Right button -->
                <b-input-group-append>
                  <b-button variant="primary" @click="onClickInviteUser()">招待</b-button>
                </b-input-group-append>
                <div v-for="(error, index) in errors.email" v-bind:key="index" v-bind:value="error"
                     class="invalid-feedback">
                  {{ error }}
                </div>
              </b-input-group>
            </b-form-group>
            <!-- /フォーム -->
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>ユーザー管理</strong>
<!--              <b-button variant="primary" class="float-right" href="/users/new"><i class="fa fa-plus"></i> 新規追加</b-button>-->
            </div>
            <!-- /ヘッダー -->
            <!-- 一覧 -->
            <b-table responsive="sm" :items="showUsers" :fields="fields" :current-page="currentPage" :per-page="perPage">
              <template slot="controls" slot-scope="data">
                <b-button variant="success" @click="onClickEdit(data.item)"><i class="fa fa-pencil"></i> 編集</b-button>
                <b-button variant="danger" @click="onClickDestroy(data.item)"><i class="fa fa-trash"></i> 削除</b-button>
              </template>
            </b-table>
            <!-- /一覧 -->
            <!-- ページネーション -->
            <nav>
              <b-pagination :total-rows="getRowCount()" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
            </nav>
            <!-- /ページネーション -->
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'Users',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('users/fetchUsers', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * テーブル用のユーザー一覧を取得
       *
       * @returns {[]}
       */
      showUsers() {
        return this.users.map(user => {
          return {
            'id': user.id,
            '名称': user.name,
            '拠点名': user.location.name,
            'メールアドレス': user.email,
            '更新日': user.updated_at
          };
        })
      },
      ...mapGetters('users', ['users', 'errors', 'alertMessage', 'alertStatus']),
    },
    data () {
      return {
        fields: ['id', '名称', '拠点名', 'メールアドレス', '更新日', 'controls'],
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        formData: {
          email: '',
          company_id: this.$store.$auth.user.company.id,
        }
      }
    },
    methods: {
      /**
       * データ数取得
       * @returns {number}
       */
      getRowCount() {
        return this.users.length
      },
      /**
       * 編集ボタン押下時
       *
       * @param user
       */
      onClickEdit(user) {
        // 編集画面へ遷移する
        this.$router.push(`/users/${user.id}`)
      },
      /**
       * 削除ボタン押下時
       *
       * @param user
       */
      onClickDestroy(user) {
        if (confirm('本当に削除してもよろしいでしょうか。')) {
          const data = { user: user };
          // 削除処理
          this.deleteUser(cloneDeep(data));
        }
      },
      ...mapActions('users', ['deleteUser']),
      /**
       * 招待ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickInviteUser() {
        const data = { user: this.formData };
        // 登録処理
        const response = await this.inviteUser(cloneDeep(data));
        // OKであればユーザー一覧へ遷移する
        if (response.status) {
          // this.$router.push('/users');
        }
      },
      ...mapActions('users', ['inviteUser'])
    }
  }
</script>

