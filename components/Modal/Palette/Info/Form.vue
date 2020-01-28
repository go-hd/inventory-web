<template>
  <div>
    <div>
      <b-alert v-if="alertMessage" show :variant="alertStatus">
        {{ alertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <b-form-group>
          <label>種別</label>
          <b-form-input
            type="text"
            id="type"
            placeholder="種別"
            v-model="formData.type"
            :class="{ 'is-invalid': errors.type }"
            class="form-control">
          </b-form-input>
          <div v-for="(error, index) in errors.type" :key="index" :value="error" class="invalid-feedback">
            {{ error }}
          </div>
        </b-form-group>
        <b-form-group>
          <label>拠点</label>
          <b-form-select
            id="location_id"
            :options="getLocationOptions"
            v-model="formData.location_id"
            :class="{ 'is-invalid': errors.location_id }">
          </b-form-select>
          <div v-for="(error, index) in errors.location_id" :key="index" :value="error"
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
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'palette-modal-info-form',
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
      palette() {
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
          this.$emit('close');
        }
      },
      ...mapActions('palettes', ['createPalette', 'updatePalette']),
    },
  }
</script>
