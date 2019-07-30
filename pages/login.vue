<template>
  <div class="container">
    <div>
      <b-alert v-if="alertMessage" show variant="danger">{{ alertMessage }}</b-alert>
    </div>
    <b-row class="justify-content-center mt-5">
      <b-col md="5">
        <b-form-group>
          <b-form-input type="text" id="email" placeholder="email" v-model="user.email" class="form-control"></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input type="text" id="password" placeholder="password" v-model="user.password" class="form-control"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" @click="passwordGrantLogin()" class="btn-block">Login</b-button>
        <a class="pull-right" href="/register/search">新規登録</a>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  layout: 'guest',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      alertMessage: ''
    }
  },
  methods: {
    async passwordGrantLogin() {
      try {
        await this.$auth.loginWith('password_grant', {
          data: {
            grant_type: 'password',
            client_id: process.env.PASSPORT_PASSWORD_GRANT_ID,
            client_secret: process.env.PASSPORT_PASSWORD_GRANT_SECRET,
            scope: '',
            username: this.user.email,
            password: this.user.password
          }
        })
        .then(() => this.$router.push('/'));
      } catch (e) {
        this.alertMessage = '認証に失敗しました。';
      }
    }
  }
}
</script>
