<template>
  <div>
    <div>
      <b-alert v-if="materialAlertMessage" show :variant="materialAlertStatus">
        {{ materialAlertMessage }}
      </b-alert>
    </div>
    <b-row>
      <b-col sm="12">
        <label class="label-with-button font-xl mb-3">
          材料設定
          <!-- 列追加ボタン -->
          <b-button variant="primary" class="float-right ml-3" @click="onAddMaterial">
            <i class="fa fa-plus"></i>
          </b-button>
          <!-- /列追加ボタン -->
        </label>
        <div v-if="materialErrors.message">
          <p class="error-text">{{ materialErrors.message }}</p>
        </div>
        <div v-else v-for="(errors, index) in materialErrors" :key="index">
          <div v-for="(error, i) in errors" :key="i">
            <p class="error-text">{{ error }}</p>
          </div>
        </div>
        <!-- 登録されている材料一覧を表示する -->
        <b-row v-for="(material, index) in formDataMaterials.materials" :key="index">
          <b-col sm="1">
            <b-form-group>
              <label></label>
              <!-- 削除ボタン -->
              <b-button variant="danger" @click="onDeleteMaterial(formDataMaterials.materials[index].id)">
                <i class="fa fa-minus"></i>
              </b-button>
              <!-- /削除ボタン -->
            </b-form-group>
          </b-col>
          <b-col sm="7">
            <!-- 子ロット -->
            <b-form-group>
              <label for="child_lot_id">子ロット</label>
              <v-select id="child_lot_id" :options="getLotOptions"
                label="name"
                :reduce="data => data.value"
                v-model="formDataMaterials.materials[index].child_lot_id">
              </v-select>
            </b-form-group>
            <!-- /子ロット -->
          </b-col>
          <b-col sm="4">
            <!-- 個数 -->
            <b-form-group>
              <label>個数</label>
              <b-form-input
                type="number"
                id="amount"
                v-model="formDataMaterials.materials[index].amount">
              </b-form-input>
            </b-form-group>
            <!-- /個数 -->
          </b-col>
        </b-row>
        <!-- /登録されている材料一覧を表示する -->
      </b-col>
    </b-row>
    <div class="form-actions float-right">
      <b-button type="submit" variant="primary" @click="onClickUpdateMaterial()" v-if="id !== null">
        更新する
      </b-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import vSelect from 'vue-select';
  import 'vue-select/dist/vue-select.css';

  export default {
    name: 'lot-modal-material-form',
    components: {
      vSelect,
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
      lots: {
        default: [],
      },
    },
    data () {
      return {
        formDataMaterials: {
          materials: [
            {
              id: null,
              parent_lot_id: this.id,
              child_lot_id: null,
              amount: 0,
            }
          ],
        },
      }
    },
    computed: {
      /**
       * セレクトボックス用のロット一覧を取得
       *
       * @returns []
       */
      getLotOptions() {
        let options = [];
        options.push([]);
        this.lots.map(lot => {
          options.push({value: lot.id, name: lot.name});
        });
        return options;
      },
      ...mapGetters({
        materials: 'materials/materials',
        materialErrors: 'materials/errors',
        materialAlertMessage: 'materials/alertMessage',
        materialAlertStatus: 'materials/alertStatus',
      }),
    },
    mounted() {
      if (this.materials.length !== 0) {
        this.formDataMaterials.materials = cloneDeep(this.materials);
      }
    },
    methods: {
      /**
       * [材料設定] 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdateMaterial() {
        const data = { materials: this.formDataMaterials };
        // 登録処理
        await this.updateMaterials(cloneDeep(data));
      },
      /**
       * 材料を追加ボタン押下時
       */
      onAddMaterial() {
        this.formDataMaterials.materials.push({
          id: null,
          parent_lot_id: this.id,
          child_lot_id: null,
          amount: 0,
        })
      },
      /**
       * 材料を削除ボタン押下時
       */
      onDeleteMaterial(id) {
        this.delete(id);
        this.formDataMaterials.materials = cloneDeep(this.materials);
      },
      ...mapActions('materials', ['updateMaterials', 'delete']),
    },
  }
</script>
