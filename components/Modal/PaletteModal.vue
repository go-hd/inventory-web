<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>パレット情報更新</h3>
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
                    <label for="type">種別</label>
                    <b-form-input type="text" id="type" placeholder="種別" v-model="formData.type"
                                  v-bind:class="{ 'is-invalid': errors.type }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.type" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <label for="location_id">拠点</label>
                    <b-form-select id="location_id" :options="getLocationOptions" v-model="formData.location_id"
                                   v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
                    <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
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
    name: 'palette-modal',
    components: {
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
          type: '',
          location_id: '',
        },
      }
    },
    computed: {
      /**
       * セレクトボックス用の拠点一覧を取得
       *
       * @returns []
       */
      getLocationOptions() {
        let options = [];
        options.push([]);
        this.locations.map(location => {
          options.push({value: location.id, text: location.name});
        });
        return options;
      },
      ...mapGetters('locations', ['locations']),
      lot() {
        return cloneDeep(this.palettes.find(data => data.id == this.id));
      },
      ...mapGetters('palettes', ['palettes', 'errors', 'alertMessage', 'alertStatus']),
    },
    mounted() {
      if (this.palette !== undefined) {
        this.formData.type = this.palette.type;
        this.formData.location_id = this.palette.location_id;
      }
    },
    methods: {
      /**
       * 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        const data = { palette: this.formData };
        // 登録処理
        const response = await this.createPalette(cloneDeep(data));
        // OK
        if (response.status) {
          this.formData.type = '';
          this.formData.location_id = '';
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
        const data = { palette: this.formData };
        // 更新処理
        const response = await this.updatePalette(cloneDeep(data));
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
      ...mapActions('palettes', ['createPalette', 'updatePalette', 'reset']),
    },
  }
</script>
