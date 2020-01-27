<template>
  <div>
    <div>
      <b-alert v-if="companyAlertMessage" show :variant="companyAlertStatus">{{ companyAlertMessage }}</b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>会社名</label>
          <b-form-input
                  type="text"
                  id="name"
                  placeholder="会社名"
                  v-model="formData.base.name"
                  :class="{ 'is-invalid': companyErrors.name }"
                  class="form-control" />
          <div v-for="(error, index) in companyErrors.name" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>会社コード</label>
          <b-form-input
                  type="text"
                  id="company_code"
                  placeholder="会社コード"
                  v-model="formData.base.company_code"
                  :class="{ 'is-invalid': companyErrors.company_code }"
                  class="form-control" />
          <div v-for="(error, index) in companyErrors.company_code" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickUpdateBase()">更新する</b-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'company-setting-modal-form',
    data () {
      return {
        formData: {
          base: {
            id: this.$store.$auth.user.company.id,
            name: this.$store.$auth.user.company.name,
            company_code: this.$store.$auth.user.company.company_code,
          },
        },
      }
    },
    computed: {
      ...mapGetters({
        companyErrors: 'companies/errors',
        companyAlertMessage: 'companies/alertMessage',
        companyAlertStatus: 'companies/alertStatus',
      }),
    },
    methods: {
      /**
       * 基本情報更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdateBase() {
        this.resetCompany();
        const data = { company: this.formData.base };
        // 更新処理
        const response = await this.updateCompany(cloneDeep(data));
        if (response.status) {
          this.resetCompanyErrors();
        }
      },
      ...mapActions('companies', ['updateCompany']),
      ...mapActions({
        resetCompany: 'companies/reset',
        resetCompanyErrors: 'companies/resetErrors',
      }),
    }
  }
</script>
