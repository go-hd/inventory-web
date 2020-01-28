<template>
  <div>
    <div>
      <b-alert v-if="locayionTypeAlertMessage" show :variant="locayionTypeAlertStatus">
        {{ locayionTypeAlertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>拠点種別名</label>
          <b-form-input
            type="text"
            placeholder="拠点種別名"
            v-model="formData.locationType.name"
            :class="{ 'is-invalid': locationTypeErrors.name }"
            class="form-control">
          </b-form-input>
          <div v-for="(error, index) in locationTypeErrors.name" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>備考</label>
          <b-form-textarea
            id="note"
            v-model="formData.locationType.note"
            rows="3"
            max-rows="6"
            :class="{ 'is-invalid': locationTypeErrors.note }">
          </b-form-textarea>
          <div v-for="(error, index) in locationTypeErrors.note" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickUpdateLocationType()">更新する</b-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'company-setting-modal-location-type-form',
    data () {
      return {
        formData: {
          locationType: {
            id: this.$store.$auth.user.location.location_type.id,
            company_id: this.$store.$auth.user.company.id,
            name: this.$store.$auth.user.location.location_type.name,
            note: this.$store.$auth.user.location.location_type.note,
          }
        },
      }
    },
    computed: {
      ...mapGetters({
        locationTypeErrors: 'location_types/errors',
        locayionTypeAlertMessage: 'location_types/alertMessage',
        locayionTypeAlertStatus: 'location_types/alertStatus',
      }),
    },
    methods: {
      /**
       * 拠点種別更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdateLocationType() {
        this.resetLocationType();
        const data = { locationType: this.formData.locationType };
        // 更新処理
        const response = await this.updateLocationType(cloneDeep(data));
        if (response.status) {
          this.resetLocationTypeErrors();
        }
      },
      ...mapActions('location_types', ['updateLocationType']),
      ...mapActions({
        resetLocationType: 'location_types/reset',
        resetLocationTypeErrors: 'location_types/resetErrors',
      }),
    }
  }
</script>
