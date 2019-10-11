<template>
  <div class="wrapper page product">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <span class="sub-title">brand: {{ product.brand.name }} / jan_code: {{ product.jan_code }}</span><br>
              <span class="main-title">ロット一覧</span>
              <b-button variant="primary" class="float-right w-25" @click="showModal('lot')"><i class="fa fa-plus"></i></b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <div class="card-columns">
                <template v-for="(lot, index) in lots">
                  <div class="card text-white bg-secondary mb-3" v-bind:key="index">
                    <div class="card-body">
                      <h4 class="card-title">{{ lot.name }}</h4>
                      <div class="info">
                        ordered_at: {{ lot.ordered_at }}<br>
                        lot_number: {{ lot.lot_number }}<br>
                        expiration_date: {{ lot.expiration_dat }}<br>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </b-card>
        </b-col>
        <LotModal v-if="showModalLot" @close="closeModal('lot')" />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'
  import LotModal from '~/components/Modal/LotModal'

  export default {
    name: 'Lots',
    components: {
      LotModal,
    },
    data () {
      return {
        showModalLot: false,
      }
    },
    /**
     * データ取得
     */
    async asyncData({ store, params }) {
      // if (store.getters['products/products'].find(data => data.id === route.params.id)) {
      //   return
      // }
      await store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id});
      await store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id});
      await store.dispatch('lots/fetchLots', {product_id: params.id});
    },
    computed: {
      /**
       * IDにひもづく商品を取得
       *
       * @returns {[]}
       */
      product() {
        return cloneDeep(this.products.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('lots', ['lots', 'alertMessage', 'alertStatus']),
    },
    methods: {
      showModal(type, brand_id = null) {
        switch (type) {
          case 'lot':
            this.showModalLot = true;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'lot':
            this.showModalLot = false;
            break;
          default:
            break;
        }
      },
    }
  }
</script>

