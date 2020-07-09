<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <div class="sidebar fixed">
        <nav class="sidebar-nav">
          <div slot="header"></div>
          <SidebarProduct
            :brands="brands"
            :products="products"
            v-if="name === 'index'
                  || name === 'product-id-lots'"
            :activeBrandId="activeBrandId"
            :activeProductId="activeProductId"
          />
          <SidebarStock
            :palettes="palettes"
            :locations="locations"
            :brandsHasLots="brandsHasLots"
            v-if="name === 'stock'
                  || name === 'palette-id'
                  || name === 'stock-locationId-brandId-lots'"
            :activeBrandId="activeBrandId"
            :activeLocationId="activeLocationId"
            :activePaletteId="activePaletteId"
          />
        </nav>
      </div>
      <!-- ブランド登録モーダル -->
      <BrandModal
        v-if="showModalBrand"
        @close="closeModal('brand')"
      />
      <!-- /ブランド登録モーダル -->
      <!-- 商品登録モーダル -->
      <ProductModal
        v-if="showModalProduct"
        @close="closeModal('product')"
        :brand_id="selectedBrandId"
      />
      <!-- /商品登録モーダル -->
      <!-- パレット登録モーダル -->
      <PaletteModal v-if="showModalPalette" @close="closeModal('palette')" />
      <!-- /パレット登録モーダル -->
      <main class="main">
<!--        <breadcrumb :list="list"/>-->
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from './menu'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '~/components/'
import SidebarProduct from '~/components/Sidebar/SidebarProduct/Index'
import SidebarStock from '~/components/Sidebar/SidebarStock/Index'
import { mapGetters } from 'vuex'
import BrandModal from '../components/Modal/Brand/Index'
import ProductModal from '../components/Modal/Product/Index'
import PaletteModal from '../components/Modal/Palette/Info/Index'

export default {
  name: 'full',
  middleware: 'auth',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb,
    SidebarProduct,
    SidebarStock,
    BrandModal,
    ProductModal,
    PaletteModal,
  },
  data () {
    return {
      nav: nav.items,
      activeBrandId: 0,
      activeProductId: 0,
      activeLocationId: 0,
      activePaletteId: 0,
      showModalBrand: false,
      showModalProduct: false,
      showModalPalette: false,
      selectedBrandId: false,
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
    ...mapGetters('products', {products: 'productsByBrand'}),
    ...mapGetters('brands', ['brands', 'brandsHasLots']),
    ...mapGetters('palettes', ['palettes']),
    ...mapGetters('locations', ['locations']),
  },
  created() {
    this.setListener()
  },
  methods: {
    setListener() {
      this.$nuxt.$on('updateSidebarProduct', this.updateSidebarProduct);
      this.$nuxt.$on('updateSidebarStock', this.updateSidebarStock);
      this.$nuxt.$on('showModal', this.showModal);
    },
    updateSidebarProduct(brandId, productId) {
      this.activeBrandId = brandId;
      this.activeProductId = productId;
    },
    updateSidebarStock(locationId, brandId, paletteId) {
      this.activeBrandId = brandId;
      this.activeLocationId = locationId;
      this.activePaletteId = paletteId;
    },
    showModal (type, brand_id = null) {
      switch (type) {
        case 'brand':
          this.showModalBrand = true;
          break;
        case 'product':
          this.selectedBrandId = brand_id;
          this.showModalProduct = true;
          break;
        case 'palette':
          this.showModalPalette = true;
          break;
        default:
          break
      }
    },
    closeModal (type) {
      switch (type) {
        case 'brand':
          this.showModalBrand = false;
          break;
        case 'product':
          this.showModalProduct = false;
          break;
        case 'palette':
          this.showModalPalette = false;
          break;
        default:
          break
      }
    },
  }
}
</script>
