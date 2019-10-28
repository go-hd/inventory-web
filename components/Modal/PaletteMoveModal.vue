<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ palette.type }} パレット個数更新</h3>
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
                    <label for="from_location_id">移動元拠点</label>
                    <b-form-select id="from_location_id" :options="getLocationOptions" v-model="formData.from_location_id"
                                   v-bind:class="{ 'is-invalid': errors.from_location_id }" v-bind:disabled="formData.from_location_id!==null"></b-form-select>
                    <div v-for="(error, index) in errors.from_location_id" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="to_location_id">移動先拠点</label>
                    <b-form-select id="to_location_id" :options="getLocationOptions" v-model="formData.to_location_id"
                                   v-bind:class="{ 'is-invalid': errors.to_location_id }"></b-form-select>
                    <div v-for="(error, index) in errors.to_location_id" v-bind:key="index" v-bind:value="error"
                         class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="quantity">個数</label>
                    <b-form-input type="number" id="quantity" placeholder="個数" v-model="formData.quantity"
                                  v-bind:class="{ 'is-invalid': errors.quantity }" class="form-control"></b-form-input>
                    <div v-for="(error, index) in errors.quantity" v-bind:key="index" v-bind:value="error" class="invalid-feedback">
                      {{ error }}
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="form-actions float-right">
                <b-button type="submit" variant="primary" @click="onClickUpdate()">
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
          palette_id: '',
          quantity: 0,
          from_location_id: '',
          to_location_id: '',
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
      palette() {
        return cloneDeep(this.palettes.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('palettes', ['palettes', 'errors', 'alertMessage', 'alertStatus']),
    },
    mounted() {
      this.formData.palette_id = this.$route.params.id;
      this.formData.from_location_id = this.id;
    },
    methods: {
      /**
       * 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { locationPalette: this.formData };
        // 更新処理
        const response = await this.updateLocationPalette(cloneDeep(data));
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
      ...mapActions('palettes', ['updateLocationPalette', 'reset']),
    },
  }
</script>
