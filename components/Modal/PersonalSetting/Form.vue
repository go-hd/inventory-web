<template>
  <div>
    <div>
      <b-alert v-if="alertMessage" show :variant="alertStatus">
        {{ alertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>ユーザー名</label>
          <b-form-input
                  type="text"
                  id="name"
                  placeholder="ユーザー名"
                  v-model="formData.name"
                  :class="{ 'is-invalid': errors.name }"
                  class="form-control" />
          <div v-for="(error, index) in errors.name" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>メールアドレス</label>
          <b-form-input
                  type="text"
                  id="company_code"
                  placeholder="メールアドレス"
                  v-model="formData.email"
                  :class="{ 'is-invalid': errors.email }"
                  class="form-control" />
          <div v-for="(error, index) in errors.email" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>パスワード</label>
          <b-form-input
                  type="password"
                  id="password"
                  placeholder="パスワード"
                  v-model="formData.password"
                  :class="{ 'is-invalid': errors.password }"
                  class="form-control" />
          <div v-for="(error, index) in errors.password" :key="index" :value="error"
               class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'personal-setting-modal-form',
    data () {
      return {
        formData: {
          id: this.$store.$auth.user.id,
          name: this.$store.$auth.user.name,
          email: this.$store.$auth.user.email,
          password: '',
        },
      }
    },
    computed: {
      ...mapGetters('users', ['errors', 'alertMessage', 'alertStatus']),
    },
    methods: {
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        this.reset();
        const data = { user: this.formData };
        // 更新処理
        const response = await this.updateUser(cloneDeep(data));
        if (response.status) {
          this.resetErrors();
        }
      },
      ...mapActions('users', ['updateUser', 'reset', 'resetErrors']),
    }
  }
</script>
