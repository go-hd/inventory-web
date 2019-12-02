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
              <span class="main-title">ロット一覧</span>
              <b-button variant="primary" class="float-right w-25" @click="showModal('lot')"><i class="fa fa-plus"></i></b-button>
            </div>
            <!-- /ヘッダー -->
            <div class="d-flex align-items-stretch">
              <template v-for="(product, index) in products">
                <div class="p-2 w-30" v-bind:key="index">
                  <div>{{ product.jan_code }}</div>
                  <div class="d-flex flex-column">
                    <template v-for="(lot) in product.lots">
                      <div class="card text-white bg-secondary mb-3 p-2" v-bind:key="lot.name"
                           @click="showModal('lot', lot.id)">
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
        <BrandModal v-if="showModalBrand" @close="closeModal('brand')" v-bind:id="showModalId" />
        <ProductModal v-if="showModalProduct" @close="closeModal('product')" v-bind:id="showModalId" />
        <LotModal v-if="showModalLot" @close="closeModal('lot')" v-bind:id="showModalId" :lots="lotsByCompany" />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import BrandModal from '~/components/Modal/BrandModal'
  import ProductModal from '~/components/Modal/ProductModal'
  import LotModal from '~/components/Modal/LotModal'

  export default {
    name: 'Lots',
    components: {
      BrandModal,
      ProductModal,
      LotModal,
    },
    data () {
      return {
        showModalBrand: false,
        showModalProduct: false,
        showModalLot: false,
        showModalId: null,
      }
    },
    /**
     * データ取得
     */
    async asyncData({ store, params }) {
      await store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id});
      await store.dispatch('products/fetchProducts', {brand_id: params.brandId});
      await store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id});
      await store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id});
      await store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * IDにひもづくブランドを取得
       *
       * @returns {[]}
       */
      brand() {
        return cloneDeep(this.brands.find(data => data.id == this.$route.params.brandId));
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('brands', ['brands']),
    },
    methods: {
      async showModal(type, id = null) {
        switch (type) {
          case 'brand':
            this.showModalBrand = true;
            this.showModalId = id;
            break;
          case 'product':
            this.showModalProduct = true;
            this.showModalId = id;
            break;
          case 'lot':
            await this.$store.dispatch('materials/fetchMaterials', { parent_lot_id: id });
            this.showModalLot = true;
            this.showModalId = id;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'brand':
            this.showModalBrand = false;
            this.showModalId = null;
            break;
          case 'product':
            this.showModalProduct = false;
            this.showModalId = null;
            break;
          case 'lot':
            this.showModalLot = false;
            this.showModalId = null;
            break;
          default:
            break;
        }
      },
    }
  }
</script>

