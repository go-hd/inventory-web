<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>メンバー招待</h3>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div>
                <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}</b-alert>
              </div>
              <b-row>
                <b-col sm="12">
                  <!-- フォーム -->
                  <b-form-group>
                    <b-input-group>
                      <b-form-input
                        type="email"
                        placeholder="メールアドレス"
                        v-model="formData.email"
                        :class="{ 'is-invalid': errors.email }"
                        class="form-control" />
                      <!-- Attach Right button -->
                      <b-input-group-append>
                        <b-button variant="primary" @click="onClickInviteUser()">招待</b-button>
                      </b-input-group-append>
                      <div v-for="(error, index) in errors.email" :key="index" :value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-input-group>
                  </b-form-group>
                  <!-- /フォーム -->
                </b-col>
              </b-row>
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
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'invite-modal',
    data () {
      return {
        formData: {
          email: '',
          company_id: this.$store.$auth.user.company.id,
        }
      }
    },
    computed: {
      ...mapGetters('users', ['errors', 'alertMessage', 'alertStatus']),
    },
    methods: {
      /**
       * 招待ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickInviteUser() {
        const data = { user: this.formData };
        // 登録処理
        const response = await this.inviteUser(cloneDeep(data));
        // OKの場合
        if (response.status) {
          this.formData.email = '';
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('users', ['inviteUser', 'reset'])
    }
  }
</script>
