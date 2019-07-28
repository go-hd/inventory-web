<template>
  <div class="container">
    <div>
      <b-alert v-if="alertMessage" show variant="danger">{{ alertMessage }}</b-alert>
    </div>
    <div class="row justify-content-center mt-5">
      <div class="col-md-5">
        <form>
          <div class="form-group">
            <input
                    v-model="user.email"
                    class="form-control"
                    placeholder="email"
            >
          </div>
          <div class="form-group">
            <input
                    v-model="user.password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
            >
          </div>
          <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  @click.prevent="passwordGrantLogin"
          >Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  middleware: 'guest',
  layout: 'login',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      alertMessage: ''
    }
  },
  mounted() {
    // console.log(this.$auth.loggedIn);
    // console.log(process.env.PASSPORT_PASSWORD_GRANT_SECRET);
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
