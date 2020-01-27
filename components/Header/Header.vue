<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-navbar-nav class="d-md-down-none">
      <b-nav-item
        class="px-3 item"
        :class="{ 'active': name === 'index' || name === 'product-id-lots' }"
      >
        <nuxt-link class="nav-link" :to="{ name: 'dashboard' }">
          商品管理
        </nuxt-link>
      </b-nav-item>
      <b-nav-item
        class="px-3 item"
        :class="{ 'active': name === 'stock'
                          || name === 'palette-id'
                          || name === 'stock-locationId-brandId-lots' }"
      >
        <nuxt-link class="nav-link" :to="{ name: 'stock' }">
          在庫管理
        </nuxt-link>
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <HeaderDropdown/>
    </b-navbar-nav>
  </header>
</template>

<script>
  import HeaderDropdown from './HeaderDropdown.vue'

  export default {
    name: 'c-header',
    components: {
      HeaderDropdown
    },
    computed: {
      name () {
        return this.$route.name
      },
    },
    methods: {
      sidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-mobile-show')
      },
    }
  }
</script>
