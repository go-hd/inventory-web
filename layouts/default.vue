<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <div class="sidebar">
        <nav class="sidebar-nav">
          <div slot="header"></div>
          <SidebarProduct :brands="brands"
                          :products="products"
                          v-if="name === 'index' || name === 'product-id-lots'" />
          <SidebarStock v-if="$route.path === '/stock'" />
        </nav>
      </div>
      <main class="main">
        <breadcrumb :list="list"/>
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
import SidebarProduct from '~/components/Sidebar/SidebarProduct'
import SidebarStock from '~/components/Sidebar/SidebarStock'
import { mapGetters } from 'Vuex'

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
    ...mapGetters('brands', ['brands']),
  },
}
</script>
