<template>
  <ModalWrapper @close="onClickClose()">
    <!-- ヘッダー -->
    <h3 slot="header">ブランド情報更新</h3>
    <!-- /ヘッダー -->
    <!-- ボディ -->
    <template slot="body">
      <div>
        <b-alert v-if="alertMessage" show :variant="alertStatus">{{ alertMessage }}
        </b-alert>
      </div>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <label for="name">ブランド名</label>
            <b-form-input
                    type="text"
                    id="name"
                    placeholder="ブランド名"
                    v-model="formData.name"
                    :class="{ 'is-invalid': errors.name }"
                    class="form-control" />
            <div v-for="(error, index) in errors.name" :key="index" :value="error"
                 class="invalid-feedback">
              {{ error }}
            </div>
          </b-form-group>
          <b-form-group>
            <label for="code">コード</label>
            <b-form-input
                    type="text"
                    id="code"
                    placeholder="コード"
                    v-model="formData.code"
                    :class="{ 'is-invalid': errors.code }"
                    class="form-control" />
            <div v-for="(error, index) in errors.code" :key="index" :value="error"
                 class="invalid-feedback">
              {{ error }}
            </div>
          </b-form-group>
          <b-form-group>
            <label for="note">備考</label>
            <b-form-textarea
                    id="note"
                    placeholder="備考"
                    v-model="formData.note"
                    rows="3"
                    max-rows="6"
                    :class="{ 'is-invalid': errors.note }"
            />
            <div v-for="(error, index) in errors.note" :key="index" :value="error"
                 class="invalid-feedback">
              {{ error }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <div class="form-actions float-right">
        <b-button type="submit" variant="primary" @click="onClickCreat()" v-if="id === null">
          登録する
        </b-button>
        <b-button type="submit" variant="primary" @click="onClickUpdate()" v-if="id !== null">
          更新する
        </b-button>
      </div>
    </template>
    <!-- /ボディ -->
    <!-- フッター -->
    <b-button variant="default" @click="onClickClose" slot="footer">
      閉じる
    </b-button>
    <!-- /フッター -->
  </ModalWrapper>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import ModalWrapper from './ModalWrapper'

  export default {
    name: 'brand-modal',
    components: {
      ModalWrapper,
    },
    props: {
      id: {
        type: Number,
        default: null
      },
    },
    data () {
      return {
        formData: {
          id: this.id,
          company_id: this.$store.$auth.user.company.id,
          name: '',
          code: '',
          note: '',
        },
      }
    },
    computed: {
      brand() {
        return cloneDeep(this.brands.find(data => data.id == this.id));
      },
      ...mapGetters('brands', ['brands', 'errors', 'alertMessage', 'alertStatus'])
    },
    mounted() {
      if (this.brand !== undefined) {
        this.formData.name = this.brand.name;
        this.formData.code = this.brand.code;
        this.formData.note = this.brand.note;
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        const data = { brand: this.formData };
        // 登録処理
        const response = await this.createBrand(cloneDeep(data));
        // OK
        if (response.status) {
          this.formData.name = '';
          this.formData.code = '';
          this.formData.note = '';
          this.reset();
          this.$emit('close');
        }
      },
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { brand: this.formData };
        // 更新処理
        const response = await this.updateBrand(cloneDeep(data));
        // OK
        if (response.status) {
          this.reset();
          this.$emit('close');
        }
      },
      /**
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.reset();
        this.$emit('close');
      },
      ...mapActions('brands', ['createBrand', 'updateBrand', 'reset', 'resetErrors']),
    },
  }
</script>
