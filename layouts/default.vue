<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <div class="sidebar">
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
  },
  data () {
    return {
      nav: nav.items,
      activeBrandId: 0,
      activeProductId: 0,
      activeLocationId: 0,
      activePaletteId: 0,
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
    },
    updateSidebarProduct(brandId, productId) {
      this.activeBrandId = brandId;
      this.activeProductId = productId;
    },
    updateSidebarStock(locationId, brandId, paletteId) {
      this.activeBrandId = brandId;
      this.activeLocationId = locationId;
      this.activePaletteId = paletteId;
    }
  }
}
</script>
