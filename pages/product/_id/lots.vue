<template>
  <div class="wrapper page product">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <span class="sub-title">
                brand: {{ brand.name }} <i class="icon-pencil edit-icon" @click="showModal('brand', brand.id)"></i>
                / jan_code: {{ product.jan_code }} <i class="icon-pencil edit-icon" @click="showModal('product', product.id)"></i>
              </span><br />
              <span class="main-title">ロット一覧</span>
              <b-button variant="primary" class="float-right w-25" @click="showModal('lot')"><i class="fa fa-plus"></i></b-button>
            </div>
            <!-- /ヘッダー -->
            <div class="d-flex align-items-stretch container">
              <div class="p-2">
                <div class="card-columns">
                  <template v-for="(lot, index) in lots">
                    <div class="card text-white bg-secondary mb-3 p-2" :key="index" @click="showModal('lot', lot.id)">
                      <div class="card-body">
                        <h4 class="card-title">{{ lot.name }}</h4>
                        <div class="info">
                          ordered_at: {{ lot.ordered_at }}<br>
                          lot_number: {{ lot.lot_number }}<br>
                          expiration_date: {{ lot.expiration_date }}<br>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </b-card>
        </b-col>
        <BrandModal
          v-if="showModalBrand"
          @close="closeModal('brand')"
          :id="showModalId"
        />
        <ProductModal
          v-if="showModalProduct"
          @close="closeModal('product')"
          :id="showModalId"
        />
        <LotModal
          v-if="showModalLot"
          @close="closeModal('lot')"
          :id="showModalId"
          :lots="lotsByCompany"
          @update="update"
        />
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
      await store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id});
      await store.dispatch('lots/fetchLots', {product_id: params.id});
      await store.dispatch('lots/fetchLotsByCompany', {company_id: store.state.auth.user.company.id});
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
      /**
       * IDにひもづくブランドを取得
       *
       * @returns {[]}
       */
      brand() {
        return cloneDeep(this.brands.find(data => data.id == this.product.brand_id));
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('lots', ['lots', 'lotsByCompany', 'alertMessage', 'alertStatus']),
      ...mapGetters('brands', ['brands']),
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarProduct', this.brand.id, this.product.id)
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
      async update() {
        await this.$store.dispatch('lots/fetchLotsByCompany', {company_id: this.$store.state.auth.user.company.id});
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

