<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>ロット情報更新</h3>
            <nav v-if="id !== null" class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item" :class="{ 'active': isLot }">
                    <a class="nav-link" @click="onClickLotEdit">ロット情報</a>
                  </li>
                  <li class="nav-item" :class="{ 'active': isMaterial }">
                    <a class="nav-link" @click="onClickMaterialEdit">材料設定</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- ロット設定 -->
              <div v-if="isLot">
                <div>
                  <b-alert v-if="lotAlertMessage" show :variant="lotAlertStatus">{{ lotAlertMessage }}
                  </b-alert>
                </div>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label for="lot_number">ロットナンバー</label>
                      <b-form-input
                        type="text"
                        id="lot_number"
                        placeholder="ロットナンバー"
                        v-model="formData.lot_number"
                        :class="{ 'is-invalid': lotErrors.lot_number }"
                        class="form-control" />
                      <div v-for="(error, index) in lotErrors.lot_number" :key="index" :value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="name">ロット名</label>
                      <b-form-input
                        type="text"
                        id="name"
                        placeholder="ロット名"
                        v-model="formData.name"
                        :class="{ 'is-invalid': lotErrors.name }"
                        class="form-control" />
                      <div v-for="(error, index) in lotErrors.name" :key="index" :value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label>賞味期限</label>
                      <datepicker
                        id="expiration_date"
                        placeholder="賞味期限"
                        :value="formData.expiration_date"
                        :format="DatePickerFormat"
                        :clear-button="true"
                        :bootstrap-styling="true"
                        :typeable="true"
                        v-on:selected="setExpirationDate"
                       />
                      <div class="form-control" :class="{ 'is-invalid': lotErrors.expiration_date }" style="display: none;"></div>
                      <div v-for="(error, index) in lotErrors.expiration_date" :key="index" :value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label>発注日</label>
                      <datepicker id="ordered_at"
                        placeholder="発注日"
                        :value="formData.ordered_at"
                        :format="DatePickerFormat"
                        :clear-button="true"
                        :bootstrap-styling="true"
                        :typeable="true"
                        v-on:selected="setOrderedAtDate"
                       />
                      <div class="form-control" :class="{ 'is-invalid': lotErrors.ordered_at }" style="display: none;"></div>
                      <div v-for="(error, index) in lotErrors.ordered_at" :key="index" :value="error"
                           class="invalid-feedback">
                        {{ error }}
                      </div>
                    </b-form-group>
                    <b-form-group>
                      <label for="is_ten_days_notation">発注日時期表記フラグ</label>
                      <b-form-checkbox
                        id="is_ten_days_notation"
                        v-model="formData.is_ten_days_notation"
                        value="1"
                        unchecked-value="0"
                       :class="{ 'is-invalid': lotErrors.is_ten_days_notation }"
                       />
                      <div v-for="(error, index) in lotErrors.is_ten_days_notation" :key="index" :value="error"
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
              <!-- /ロット設定 -->
              <!-- 材料設定 -->
              <div v-if="isMaterial">
                <div>
                  <b-alert v-if="materialAlertMessage" show :variant="materialAlertStatus">{{ materialAlertMessage }}
                  </b-alert>
                </div>
                <b-row>
                  <b-col sm="12">
                    <label for="lot_number" class="label-with-button font-xl mb-3">
                      材料設定
                      <b-button variant="primary" class="float-right ml-3" @click="onAddMaterial">
                        <i class="fa fa-plus"></i>
                      </b-button>
                    </label>
                    <div v-if="materialErrors.message">
                      <p class="error-text">{{ materialErrors.message }}</p>
                    </div>
                    <div v-else v-for="(errors, index) in materialErrors" :key="index">
                      <div v-for="(error, i) in errors" :key="i">
                        <p class="error-text">{{ error }}</p>
                      </div>
                    </div>
                    <b-row v-for="(material, index) in formDataMaterials.materials" :key="index">
                      <b-col sm="8">
                        <b-form-group>
                          <label for="child_lot_id">子ロット</label>
                          <b-form-select
                            id="child_lot_id"
                            :options="getLotOptions"
                            v-model="formDataMaterials.materials[index].child_lot_id" />
                        </b-form-group>
                      </b-col>
                      <b-col sm="4">
                        <b-form-group>
                          <label for="amount">個数</label>
                          <b-form-input
                            type="number"
                            id="amount"
                            v-model="formDataMaterials.materials[index].amount" />
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <div class="form-actions float-right">
                  <b-button type="submit" variant="primary" @click="onClickUpdateMaterial()" v-if="id !== null">
                    更新する
                  </b-button>
                </div>
              </div>
              <!-- /材料設定 -->
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
  import { mapGetters, mapActions } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';

  export default {
    name: 'lot-modal',
    components: {
      Datepicker,
      moment
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
        formData: {
          id: this.id,
          product_id: this.$route.params.id,
          lot_number: '',
          name: '',
          expiration_date: '',
          ordered_at: '',
          is_ten_days_notation: '',
        },
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
        DatePickerFormat: 'yyyy-MM-dd',
        isLot: true,
        isMaterial: false,
      }
    },
    computed: {
      lot() {
        return cloneDeep(this.lots.find(data => data.id == this.id));
      },
      /**
       * セレクトボックス用のロット一覧を取得
       *
       * @returns []
       */
      getLotOptions() {
        let options = [];
        options.push([]);
        this.lots.map(lot => {
          options.push({value: lot.id, text: lot.name});
        });
        return options;
      },
      ...mapGetters({
        lotErrors: 'lots/errors',
        lotAlertMessage: 'lots/alertMessage',
        lotAlertStatus: 'lots/alertStatus',
        materials: 'materials/materials',
        materialErrors: 'materials/errors',
        materialAlertMessage: 'materials/alertMessage',
        materialAlertStatus: 'materials/alertStatus',
      }),
    },
    mounted() {
      if (this.lot !== undefined) {
        this.formData.lot_number = this.lot.lot_number;
        this.formData.name = this.lot.name;
        this.formData.expiration_date = this.lot.expiration_date;
        this.formData.ordered_at = this.lot.ordered_at;
        this.formData.is_ten_days_notation = this.lot.is_ten_days_notation;
      }
      if (this.materials.length !== 0) {
        this.formDataMaterials.materials = cloneDeep(this.materials);
      }
    },
    methods: {
      /**
       * ロット情報タブ押下時
       */
      async onClickLotEdit() {
        this.isLot = true;
        this.isMaterial = false;
      },
      /**
       * 材料設定タブ押下時
       */
      async onClickMaterialEdit() {
        this.isLot = false;
        this.isMaterial = true;
      },
      /**
       * [ロット情報] 登録ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickCreat() {
        const data = { lot: this.formData };
        // 登録処理
        const response = await this.createLot(cloneDeep(data));
        // OK
        if (response.status) {
          this.resetLots();
          this.$emit('update');
          this.$emit('close');
        }
      },
      /**
       * [ロット情報] 更新ボタン押下時
       *
       * @returns {Promise<void>}
       */
      async onClickUpdate() {
        const data = { lot: this.formData };
        // 更新処理
        const response = await this.updateLot(cloneDeep(data));
        // OK
        if (response.status) {
          this.resetLots();
          this.$emit('update');
          this.$emit('close');
        }
      },
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
       * 閉じるボタン押下時
       */
      onClickClose() {
        this.resetLots();
        this.resetMaterials();
        this.$emit('close');
      },
      async setOrderedAtDate(date) {
        this.formData.ordered_at = moment(date).format('YYYY-MM-DD');
      },
      async setExpirationDate(date) {
        this.formData.expiration_date = moment(date).format('YYYY-MM-DD');
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
      ...mapActions('lots', ['createLot', 'updateLot']),
      ...mapActions('materials', ['updateMaterials']),
      ...mapActions({
        resetLots: 'lots/reset',
        resetMaterials: 'materials/reset',
      }),
    },
  }
</script>
