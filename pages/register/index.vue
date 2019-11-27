<template>
  <div class="container">
    <div>
      <b-alert v-if="alertMessage" show variant="danger">{{ alertMessage }}</b-alert>
    </div>
    <b-row class="justify-content-center mt-5" v-if="dispCompanyForm">
      <b-col md="5">
        <b-form-group>
          <b-form-input type="text" placeholder="会社名を入力" v-model="formData.company.name" v-bind:class="{ 'is-invalid': companyErrors.name }" class="form-control"></b-form-input>
          <div v-for="(error, index) in companyErrors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>

        <b-form-group>
          <b-form-input type="text" placeholder="会社コードを入力" v-model="formData.company.company_code" v-bind:class="{ 'is-invalid': companyErrors.company_code }" class="form-control"></b-form-input>
          <div v-for="(error, index) in companyErrors.company_code" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>

        <div class="form-actions float-right">
          <b-button type="submit" variant="primary" @click="onClickValidationCompany()">次へ</b-button>
        </div>
      </b-col>
    </b-row>

    <b-row class="justify-content-center mt-5" v-if="dispLocationForm">
      <b-col md="5">
        <b-form-group>
          <b-form-input type="text" placeholder="本拠点名を入力" v-model="formData.location.name" v-bind:class="{ 'is-invalid': locationErrors.name }" class="form-control"></b-form-input>
          <div v-for="(error, index) in locationErrors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <div class="form-actions float-right">
          <b-button type="submit" variant="default" @click="onClickReturnCompany()">戻る</b-button>
          <b-button type="submit" variant="primary" @click="onClickValidationLocation()">次へ</b-button>
        </div>
      </b-col>
    </b-row>

    <b-row class="justify-content-center mt-5" v-if="dispUserForm">
      <b-col md="5">
        <b-form-group>
          <b-form-input type="text" placeholder="ユーザー名" v-model="formData.user.name" v-bind:class="{ 'is-invalid': userErrors.name }" class="form-control"></b-form-input>
          <div v-for="(error, index) in userErrors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <b-form-input type="text" placeholder="メールアドレス" v-model="formData.user.email" v-bind:class="{ 'is-invalid': userErrors.email }" class="form-control"></b-form-input>
          <div v-for="(error, index) in userErrors.email" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <b-form-input type="text" placeholder="パスワード" v-model="formData.user.password" v-bind:class="{ 'is-invalid': userErrors.password }" class="form-control"></b-form-input>
          <div v-for="(error, index) in userErrors.password" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <div class="form-actions float-right">
          <b-button type="submit" variant="default" @click="onClickReturnLocation()">戻る</b-button>
          <b-button type="submit" variant="primary" @click="onClickValidationUser()">登録する</b-button>
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
    data() {
      return {
        formData: {
          company: {
            name: '',
            company_code: ''
          },
          location: {
            name: ''
          },
          user: {
            email: '',
            password: '',
          },
        },
        dispCompanyForm: true,
        dispLocationForm: false,
        dispUserForm: false,
        alertMessage: null,
      }
    },
    computed: {
      ...mapGetters({companyErrors: 'companies/errors'}),
      ...mapGetters({locationErrors: 'locations/errors'}),
      ...mapGetters({userErrors: 'users/errors'}),
    },
    methods: {
      /**
       * 会社入力画面：次へボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickValidationCompany() {
        const data = { company: this.formData.company };
        // 入力項目確認処理
        const response = await this.validateCompany(cloneDeep(data));
        // OKであれば拠点情報入力へ
        if (response.status) {
          this.dispCompanyForm = false;
          this.dispLocationForm = true;
        }
      },
      async onClickReturnCompany() {
        this.dispCompanyForm = true;
        this.dispLocationForm = false;
      },
      ...mapActions('companies', ['validateCompany']),
      async onClickValidationLocation() {
        const data = { location: this.formData.location };
        // 入力項目確認処理
        const response = await this.validateLocation(cloneDeep(data));
        // OKであればユーザー情報入力へ
        if (response.status) {
          this.dispLocationForm = false;
          this.dispUserForm = true;
        }
      },
      async onClickReturnLocation() {
        this.dispLocationForm = true;
        this.dispUserForm = false;
      },
      ...mapActions('locations', ['validateLocation']),
      async onClickValidationUser() {
        const data = { user: this.formData.user };
        // 入力項目確認処理
        const response = await this.validateUser(cloneDeep(data));
        // OKであれば登録処理
        if (response.status) {
          const register = { data: this.formData };
          const result = await this.$axios.$post(`http://localhost:8000/register`, register).catch(err => {
            return {
              'errors' : err.response.data,
              'status' : false
            };
          });
          if (result.status === 'OK') {
            // ログインさせる
            try {
              await this.$auth.loginWith('password_grant', {
                data: {
                  grant_type: 'password',
                  client_id: process.env.PASSPORT_PASSWORD_GRANT_ID,
                  client_secret: process.env.PASSPORT_PASSWORD_GRANT_SECRET,
                  scope: '',
                  username: this.formData.user.email,
                  password: this.formData.user.password
                }
              }).then(() => this.$router.push('/'));
            } catch (e) {
              this.alertMessage = '認証に失敗しました。';
            }
          }
        }
      },
      ...mapActions('users', ['validateUser']),
    }
  }
</script>
