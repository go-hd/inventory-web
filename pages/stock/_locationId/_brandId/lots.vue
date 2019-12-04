<template>
  <div class="wrapper page product">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <span class="sub-title">
              </span><br />
              <span class="main-title">ロット在庫一覧</span>
            </div>
            <!-- /ヘッダー -->
            <div class="d-flex align-items-stretch">
              <template v-for="(product, index) in products">
                <div class="p-2 w-30" v-bind:key="index">
                  <div>{{ product.jan_code }}</div>
                  <div class="d-flex flex-column">
                    <template v-for="(lot) in product.lots">
                      <div class="card text-white bg-secondary mb-3 p-2" v-bind:key="lot.name"
                           @click="showModal('stock', lot.id, lot.name)">
                        <div class="card-body">
                          <h4 class="card-title">{{ lot.name }}</h4>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </b-card>
        </b-col>
        <StockModal
          v-if="showModalStock"
          @close="closeModal('stock')"
          :locationId="$route.params.locationId"
          :locationName="location.name"
          :lotId="showModalLotId"
          :lotName="showModalLotName"
          :stockHistoryTypes="stockHistoryTypes"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import StockModal from '~/components/Modal/StockModal'

  export default {
    name: 'Lots',
    components: {
      StockModal,
    },
    data () {
      return {
        showModalStock: false,
        showModalLotId: null,
        showModalLocationName: null,
      }
    },
    /**
     * データ取得
     */
    async asyncData({ store, params }) {
      await store.dispatch('products/fetchProducts', {brand_id: params.brandId});
      await store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id});
      await store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id});
      await store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id});
      await store.dispatch('stock_history_types/fetchStockHistoryTypes', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * IDにひもづく拠点を取得
       *
       * @returns {[]}
       */
      location() {
        return cloneDeep(this.locations.find(data => data.id == this.$route.params.locationId));
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('locations', ['locations']),
      ...mapGetters('stock_history_types', ['stockHistoryTypes']),
    },
    methods: {
      async showModal(type, lot_id = null, lot_name = null) {
        switch (type) {
          case 'stock':
            this.showModalStock = true;
            this.showModalLotId = lot_id;
            this.showModalLotName = lot_name;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'stock':
            this.showModalStock = false;
            this.showModalLotId = null;
            break;
          default:
            break;
        }
      },
    }
  }
</script>

