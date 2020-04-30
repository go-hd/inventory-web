<template>
  <div class="wrapper page stock">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <slot name="header">
              <span class="sub-title">
              </span><br />
              <span class="main-title">ロット在庫一覧</span>
              <a class="float-right m-4 sort-btn" @click="sortList">
                <i v-if="sort === 'asc'" class="fa fa-sort-amount-desc fa-lg"></i>
                <i v-if="sort === 'desc'" class="fa fa-sort-amount-asc fa-lg"></i>
              </a>
            </slot>
            <!-- /ヘッダー -->
            <div class="d-flex align-items-stretch container list">
              <template v-for="(product, index) in products">
                <div class="p-2 card-item" :key="`product-${index}`">
                  <h4>{{ product.current_lot.name }}</h4>
                  <div class="d-flex flex-column card-columns">
                    <template v-for="(lot, lot_index) in getLotsBySort(index)">
                      <div class="card text-white bg-secondary mb-3 p-2" :key="`lot-${lot_index}`">
                        <div class="card-body" @click.self="showModal('stock', lot)">
                          <div class="card-title order-date">{{ lot.ordered_at }} 発注分</div>
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
                              v-if="lot.receiving_tasks && lot.receiving_tasks.length !== 0"
                              class="label bg-info text-white"
                              @click="showModal('receiving', lot)"
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
        <ReceivingModal
          v-if="showModalReceiving"
          @close="closeModal('receiving')"
          :locationId="$route.params.locationId"
          :lot="showModalReceivingLot"
          @update="updateStock"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import StockModal from '~/components/Modal/Stock/Index'
  import ShippingModal from '~/components/Modal/Shipping/Index'
  import ReceivingModal from '~/components/Modal/Receiving/Index'

  export default {
    name: 'Lots',
    components: {
      StockModal,
      ShippingModal,
      ReceivingModal,
    },
    data () {
      return {
        showModalStock: false,
        showModalLot: null,
        showModalShipping: false,
        showModalShippingLot: null,
        showModalReceiving: false,
        showModalReceivingLot: null,
        sort: 'desc',
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
      brand() {
        return cloneDeep(this.brandsHasLots.find(data => data.id == this.$route.params.brandId));
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('locations', ['locations']),
      ...mapGetters('stock_history_types', ['stockHistoryTypes']),
      ...mapGetters('brands', ['brandsHasLots']),
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarStock', this.location.id, this.brand.id, 0)
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
          case 'receiving':
            this.showModalReceiving = true;
            this.showModalReceivingLot = lot;
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
          case 'receiving':
            this.showModalReceiving = false;
            this.showModalReceivingLot = null;
            break;
          default:
            break;
        }
      },
      /**
       * ソートしたロット一覧を取得
       */
      getLotsBySort(index) {
        const lotsBySort = cloneDeep(this.products[index].lots);
        return this.sort === 'asc' ? lotsBySort.reverse() : this.products[index].lots;
      },
      /**
       * ソートステータスを更新する
       */
      sortList() {
        this.sort = this.sort === 'desc' ? 'asc' : 'desc'
      },
    }
  }
</script>

