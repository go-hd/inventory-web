<template>
  <div class="wrapper page stock">
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
                <div class="p-2 w-30" :key="`product-${index}`">
                  <div>{{ product.jan_code }}</div>
                  <div class="d-flex flex-column card-columns">
                    <template v-for="(lot, lot_index) in product.lots">
                      <div class="card text-white bg-secondary mb-3 p-2" :key="`lot-${lot_index}`">
                        <div class="card-body" @click.self="showModal('stock', lot)">
                          <h4 class="card-title">{{ lot.name }}</h4>
                          <span class="quantity">{{ lot.stock_quantity }}</span>個
                          <div class="status">
                            <div
                              v-if="lot.shipping_tasks && lot.shipping_tasks.length !== 0"
                              class="label bg-danger text-white"
                              @click="showModal('shipping', lot)"
                            >
                              出庫待ち<br>確認
                            </div>
                            <div
                              v-if="lot.recieving_tasks && lot.recieving_tasks.length !== 0"
                              class="label bg-info text-white"
                              @click="showModal('recieving', lot)"
                            >
                              入庫確認待ち<br>確認
                            </div>
                          </div>
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
          :location="location"
          :lot="showModalLot"
          :stockHistoryTypes="stockHistoryTypes"
          :locations="locations"
          @update="updateStock"
        />
        <ShippingModal
          v-if="showModalShipping"
          @close="closeModal('shipping')"
          :locationId="$route.params.locationId"
          :lot="showModalShippingLot"
          @update="updateStock"
        />
        <RecievingModal
          v-if="showModalRecieving"
          @close="closeModal('recieving')"
          :locationId="$route.params.locationId"
          :lot="showModalRecievingLot"
          @update="updateStock"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import StockModal from '~/components/Modal/StockModal'
  import ShippingModal from '~/components/Modal/ShippingModal'
  import RecievingModal from '~/components/Modal/RecievingModal'

  export default {
    name: 'Lots',
    components: {
      StockModal,
      ShippingModal,
      RecievingModal,
    },
    data () {
      return {
        showModalStock: false,
        showModalLot: null,
        showModalShipping: false,
        showModalShippingLot: null,
        showModalRecieving: false,
        showModalRecievingLot: null,
      }
    },
    /**
     * データ取得
     */
    async asyncData({ store, params }) {
      await store.dispatch('products/fetchProductsWithStock', {brand_id: params.brandId, location_id: params.locationId});
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
      async showModal(type, lot = null) {
        switch (type) {
          case 'stock':
            this.showModalStock = true;
            this.showModalLot = lot;
            break;
          case 'shipping':
            this.showModalShipping = true;
            this.showModalShippingLot = lot;
            break;
          case 'recieving':
            this.showModalRecieving = true;
            this.showModalRecievingLot = lot;
            break;
          default:
            break;
        }
      },
      async updateStock() {
        await this.$store.dispatch('products/fetchProductsWithStock',
          {brand_id: this.$route.params.brandId, location_id: this.$route.params.locationId});
      },
      closeModal(type) {
        switch (type) {
          case 'stock':
            this.showModalStock = false;
            this.showModalLot = null;
            break;
          case 'shipping':
            this.showModalShipping = false;
            this.showModalShippingLot = null;
            break;
          case 'recieving':
            this.showModalRecieving = false;
            this.showModalRecievingLot = null;
            break;
          default:
            break;
        }
      },
    }
  }
</script>

