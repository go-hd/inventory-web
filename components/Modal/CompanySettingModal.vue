<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>会社設定</h3>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item" v-bind:class="{ 'active': isBase }">
                    <a class="nav-link" @click="onClickBaseEdit">基本情報</a>
                  </li>
                  <li class="nav-item" v-bind:class="{ 'active': isLocationType }">
                    <a class="nav-link" @click="onClickLocationTypeEdit">拠点種別</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div v-if="isBase">
                <div>
                  <b-alert v-if="companyAlertMessage" show :variant="companyAlertStatus">{{ companyAlertMessage }}</b-alert>
                </div>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label for="name">会社名</label>
                      <b-form-input type="text" id="name" placeholder="会社名" v-model="formData.base.name" v-bind:class="{ 'is-invalid': companyErrors.name }" class="form-control"></b-form-input>
                      <div v-for="(error, index) in companyErrors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="name">会社コード</label>
                      <b-form-input type="text" id="company_code" placeholder="会社コード" v-model="formData.base.company_code" v-bind:class="{ 'is-invalid': companyErrors.company_code }" class="form-control"></b-form-input>
                      <div v-for="(error, index) in companyErrors.company_code" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="form-actions float-right">
                  <b-button type="submit" variant="primary" @click="onClickUpdateBase()">更新する</b-button>
                </div>
              </div>

              <div v-if="isLocationType">
                <div>
                  <b-alert v-if="locayionTypeAlertMessage" show :variant="locayionTypeAlertStatus">{{ locayionTypeAlertMessage }}</b-alert>
                </div>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label for="name">拠点種別名</label>
                      <b-form-input type="text" placeholder="拠点種別名" v-model="formData.locationType.name" v-bind:class="{ 'is-invalid': locationTypeErrors.name }" class="form-control"></b-form-input>
                      <div v-for="(error, index) in locationTypeErrors.name" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="note">備考</label>
                      <b-form-textarea
                              id="note"
                              v-model="formData.locationType.note"
                              rows="3"
                              max-rows="6"
                              v-bind:class="{ 'is-invalid': locationTypeErrors.note }"
                      ></b-form-textarea>
                      <div v-for="(error, index) in locationTypeErrors.note" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="form-actions float-right">
                  <b-button type="submit" variant="primary" @click="onClickUpdateLocationType()">更新する</b-button>
                </div>
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
    name: 'company-setting-modal',
    data () {
      return {
        formData: {
          base: {
            id: this.$store.$auth.user.company.id,
            name: this.$store.$auth.user.company.name,
            company_code: this.$store.$auth.user.company.company_code,
          },
          locationType: {
            id: this.$store.$auth.user.location.location_type.id,
            company_id: this.$store.$auth.user.company.id,
            name: this.$store.$auth.user.location.location_type.name,
            note: this.$store.$auth.user.location.location_type.note,
          }
        },
        isBase: true,
        isLocationType: false,
      }
    },
    computed: {
      ...mapGetters({
        companyErrors: 'companies/errors',
        companyAlertMessage: 'companies/alertMessage',
        companyAlertStatus: 'companies/alertStatus',
      }),
      ...mapGetters({
        locationTypeErrors: 'location_types/errors',
        locayionTypeAlertMessage: 'location_types/alertMessage',
        locayionTypeAlertStatus: 'location_types/alertStatus',
      }),
    },
    methods: {
      /**
       * 基本情報タブ押下時
       */
      async onClickBaseEdit() {
       this.isBase = true;
       this.isLocationType = false;
      },
      /**
       * 拠点種別タブ押下時
       */
      async onClickLocationTypeEdit() {
        this.isBase = false;
        this.isLocationType = true;
      },
      /**
       * 基本情報更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdateBase() {
        const data = { company: this.formData.base };
        // 更新処理
        const response = await this.updateCompany(cloneDeep(data));
        if (response.status) {
          this.resetCompany();
        }
      },
      /**
       * 拠点種別更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdateLocationType() {
        const data = { locationType: this.formData.locationType };
        // 更新処理
        const response = await this.updateLocationType(cloneDeep(data));
        if (response.status) {
          this.resetLocationType();
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetCompany();
        this.resetLocationType();
        this.$emit('close');
      },
      ...mapActions('companies', ['updateCompany']),
      ...mapActions('location_types', ['updateLocationType']),
      ...mapActions({
        resetCompany: 'companies/reset',
        resetLocationType: 'location_types/reset',
      }),
    }
  }
</script>
