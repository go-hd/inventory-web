<template>
  <div class="wrapper page product">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <slot name="header">
              <span class="sub-title">
                brand: {{ brand.name }} <i class="icon-pencil edit-icon" @click="showModal('brand', brand.id)"></i>
                / jan_code: {{ product.jan_code }} <i class="icon-pencil edit-icon" @click="showModal('product', product.id)"></i>
              </span><br />
              <span class="main-title">ロット一覧</span>
              <b-button variant="primary" class="float-right w-25" @click="showModal('lot')"><i class="fa fa-plus"></i></b-button>
              <br>
              <a class="float-right m-4 sort-btn" @click="sortList">
                <i v-if="sort === 'asc'" class="fa fa-sort-amount-desc fa-lg"></i>
                <i v-if="sort === 'desc'" class="fa fa-sort-amount-asc fa-lg"></i>
              </a>
            </slot>
            <!-- /ヘッダー -->
            <div class="d-flex align-items-stretch container">
              <div class="p-2">
                <div class="card-columns">
                  <template v-for="(lot, index) in lotsBySort">
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
          :sort="sort"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'
  import BrandModal from '~/components/Modal/Brand/Index'
  import ProductModal from '~/components/Modal/Product/Index'
  import LotModal from '~/components/Modal/Lot/Index'

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
        sort: 'desc',
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
      /**
       * ソートしたロット一覧を取得
       */
      lotsBySort() {
        const lotsBySort = cloneDeep(this.lots);
        return this.sort === 'asc' ? lotsBySort.reverse() : this.lots;
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
      /**
       * ソートステータスを更新する
       */
      sortList() {
        this.sort = this.sort === 'desc' ? 'asc' : 'desc'
      },
    }
  }
</script>

