<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>個人設定</h3>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item active">
                    <a class="nav-link">基本情報</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div>
                <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}
                </b-alert>
              </div>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="name">ユーザー名</label>
                    <b-form-input type="text" id="name" placeholder="ユーザー名" v-model="formData.name"
                                  v-bind:class="{ 'is-invalid': errors.name }"
                                  class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="name">メールアドレス</label>
                    <b-form-input type="text" id="company_code" placeholder="メールアドレス" v-model="formData.email"
                                  v-bind:class="{ 'is-invalid': errors.email }"
                                  class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.email" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="name">パスワード</label>
                    <b-form-input type="password" id="password" placeholder="パスワード" v-model="formData.password"
                                  v-bind:class="{ 'is-invalid': errors.password }"
                                  class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.password" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-actions float-right">
                <b-button type="submit" variant="primary" @click="onClickUpdate()">更新する</b-button>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <b-button variant="default" @click="onClickClose">
              閉じる
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'personal-setting-modal',
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
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('users', ['updateUser', 'reset', 'resetErrors']),
    }
  }
</script>
