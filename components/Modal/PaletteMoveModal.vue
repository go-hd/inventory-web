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
                    <label for="location_id">保管拠点</label>
                    <b-form-select id="location_id" :options="getLocationOptions" v-model="formData.location_id"
                                   v-bind:class="{ 'is-invalid': errors.location_id }"></b-form-select>
                    <div v-for="(error, index) in errors.location_id" v-bind:key="index" v-bind:value="error"
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
      palette() {
        return cloneDeep(this.palettes.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('palettes', ['palettes', 'errors', 'alertMessage', 'alertStatus']),
    },
    mounted() {
      if (this.id !== null) {
        const shared_location = this.palette.shared_locations.find( (shared_location) => shared_location.id === this.id);
        this.formData.location_id = shared_location.id;
        this.formData.quantity = shared_location.quantity;
      }
      this.formData.palette_id = this.$route.params.id;
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
