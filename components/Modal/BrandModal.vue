<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>ブランド情報更新</h3>
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
                    <label for="name">ブランド名</label>
                    <b-form-input type="text" id="name" placeholder="ブランド名" v-model="formData.name"
                                  v-bind:class="{ 'is-invalid': errors.name }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.name" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="code">コード</label>
                    <b-form-input type="text" id="code" placeholder="コード" v-model="formData.code"
                                  v-bind:class="{ 'is-invalid': errors.code }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.code" v-bind:key="index" v-bind:value="error"
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
                            v-bind:class="{ 'is-invalid': errors.note }"
                    ></b-form-textarea>
                    <div v-for="(error, index) in errors.note" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-actions float-right">
                <b-button type="submit" variant="primary" @click="onClickCreat()" v-if="brand_id === 0">
                  登録する
                </b-button>
                <b-button type="submit" variant="primary" @click="onClickUpdate()" v-if="brand_id !== 0">
                  更新する
                </b-button>
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
    name: 'brand-modal',
    /**
     * データ取得
     */
    async asyncData({ store, route }) {
      if (store.getters['brands/brands'].find(data => data.id === route.params.id)) {
        return
      }
      await store.dispatch('brands/fetchBrands');
    },
    props: {
      brand_id: {
        type: Number,
        default: 0
      },
    },
    data () {
      return {
        formData: {
          id: this.brand_id,
          company_id: this.$store.$auth.user.company.id,
          name: '',
          code: '',
          note: '',
        },
      }
    },
    computed: {
      brand() {
        return cloneDeep(this.brands.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('brands', ['brands', 'errors', 'alertMessage', 'alertStatus'])
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
          this.resetErrors();
          this.formData.name = '';
          this.formData.code = '';
          this.formData.note = '';
        }
      },
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { brand: this.brand };
        // 更新処理
        const response = await this.updateBrand(cloneDeep(data));
        // OKであればブランド一覧へ遷移する
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
      ...mapActions('brands', ['createBrand', 'updateBrand', 'reset', 'resetErrors']),
    },
  }
</script>
