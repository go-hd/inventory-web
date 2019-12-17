<template>
  <div class="container">
    <b-row class="justify-content-center mt-5">
      <b-col md="5">
        <div>
          <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
        </div>

        <div>{{ formData.company_code }}へ参加する</div>

        <b-form-group>
          <b-form-input type="text" placeholder="名前を入力" v-model="formData.name" :class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
          <div v-for="(error, index) in errors.name" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>

        <b-form-group>
          <b-form-input type="text" placeholder="パスワードを入力" v-model="formData.password" :class="{ 'is-invalid': errors.password }" class="form-control"></b-form-input>
          <div v-for="(error, index) in errors.password" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>

        <div class="form-actions float-right">
          <b-button
            type="submit"
            variant="primary"
            @click="onClickRegister()"
          >
            登録する
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    layout: 'guest',
    computed: {
      ...mapGetters('users', ['errors', 'alertMessage', 'alertStatus']),
    },
    data() {
      return {
        formData: {
          email: this.$route.query.email,
          token: this.$route.query.token,
          company_code: this.$route.params.code,
          name: '',
          password: '',
        },
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       */
      async onClickRegister() {
        const register = { data: this.formData };
        // 更新処理
        const response = await this.registerUser(cloneDeep(register));
        if (response.status === 'OK') {
          // ログインさせる
          try {
            await this.$auth.loginWith('password_grant', {
              data: {
                grant_type: 'password',
                client_id: process.env.PASSPORT_PASSWORD_GRANT_ID,
                client_secret: process.env.PASSPORT_PASSWORD_GRANT_SECRET,
                scope: '',
                username: this.formData.email,
                password: this.formData.password
              }
            }).then(() => this.$router.push('/'));
          } catch (e) {
            this.alertMessage = '処理に失敗しました。';
          }
        }
      },
      ...mapActions('users', ['registerUser'])
    }
  }
</script>
