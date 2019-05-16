<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <i class="fa fa-align-justify"></i> <strong>ユーザー管理 | 編集</strong>
            </div>
            <!-- /ヘッダー -->
            <!-- パン屑 -->
            <b-breadcrumb :items="breadcrumbs"/>
            <!-- /パン屑 -->
            <!-- フォーム -->
            <b-form-group>
              <label for="name">ユーザー名</label>
              <b-form-input type="text" id="name" placeholder="ユーザー名" v-model="user.name"
                            v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="location_id">拠点</label>
              <b-form-select id="location_id" :options="getLocationOptions" v-model="user.location_id"
                             v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
              <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="email">メールアドレス</label>
              <b-form-input type="text" id="email" placeholder="メールアドレス" v-model="user.email"
                            v-bind:class="{ 'is-invalid': errors.email }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.email" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <b-form-group>
              <label for="password">パスワード</label>
              <b-form-input type="text" id="password" placeholder="パスワード" v-model="user.password"
                            v-bind:class="{ 'is-invalid': errors.password }" class="form-control"></b-form-input>
              <div v-for="(error, index) in errors.password" v-bind:key="index" v-bind:value="error"
                   class="invalid-feedback">
                {{ error }}
              </div>
            </b-form-group>
            <div class="form-actions float-right">
              <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              <b-button type="button" variant="secondary" href="/users">一覧に戻る</b-button>
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
    name: 'Users',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['users/users'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('users/fetchUsers');
      await store.dispatch('locations/fetchLocations');
    },
    computed: {
      /**
       * IDにひもづくユーザーを取得
       *
       * @returns {[]}
       */
      user() {
        return cloneDeep(this.users.find(data => data.id == this.$route.params.id));
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
      ...mapGetters('users', ['users', 'errors']),
      ...mapGetters('locations', ['locations']),
    },
    data () {
      return {
        breadcrumbs: [{
          text: '一覧',
          href: '/users',
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
       */
      async onClickUpdate() {
        const data = { user: this.user };
        // 更新処理
        const response = await this.updateUser(cloneDeep(data));
        // OKであればユーザー一覧へ遷移する
        if (response.status) {
          this.$router.push('/users');
        }
      },
      ...mapActions('users', ['updateUser'])
    },
  }
</script>

