<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <div class="sidebar">
        <nav class="sidebar-nav">
          <div slot="header"></div>
          <SidebarProduct :brands="brands" :products="products" v-if="name === 'index'" />
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
      brands: [],
      products: []
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
  },
  created() {
    this.setListener()
  },
  methods: {
    setListener() {
      this.$nuxt.$on('updateSidebar', this.updateSidebar)
    },
    updateSidebar(brands, products) {
      this.brands = brands || '';
      this.products = products || ''
    }
  }
}
</script>
