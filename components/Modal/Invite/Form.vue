<template>
 <div>
   <div>
     <b-alert v-if="alertMessage" show :variant="alertStatus">
       {{ alertMessage }}
     </b-alert>
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
             class="form-control">
           </b-form-input>
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
 </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'invite-modal-form',
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
      ...mapActions('users', ['inviteUser'])
    }
  }
</script>
