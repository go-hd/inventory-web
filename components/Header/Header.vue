<template>
  <div>
    <header class="app-header navbar">
      <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
        <span class="navbar-toggler-icon"></span>
      </button>
      <b-link class="navbar-brand" to="#"></b-link>
      <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- ヘッダーメニュー -->
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item
          class="px-3 item"
          :class="{ 'active': name === 'index' || name === 'product-id-lots' }">
          <nuxt-link class="nav-link" :to="{ name: 'index' }">
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
      <button class="btn btn-primary ml-5 px-5" @click="toggleStockOrderModal">発注</button>
      <!-- /ヘッダーメニュー -->
      <!-- ログイン情報 -->
      <div class="ml-auto login-user">
        <span class="company">{{ user.company.name }}</span>
        <span class="location">{{ user.location.location_type.name }}</span>
        <span class="user">{{ user.name }} さん</span>
      </div>
      <!-- /ログイン情報 -->
      <!-- ヘッダードロップダウンメニュー -->
      <b-navbar-nav class="setting">
        <HeaderDropdown/>
      </b-navbar-nav>
      <!-- /ヘッダードロップダウンメニュー -->
    </header>
    <!-- 発注モーダル -->
    <StockOrderModal
      v-if="showStockOrderModal"
      @close="toggleStockOrderModal"
    />
    <!-- /発注モーダル -->
  </div>
</template>

<script>
  import HeaderDropdown from './HeaderDropdown.vue'
  import StockOrderModal from '../Modal/StockOrder/Index'

  export default {
    name: 'c-header',
    data () {
      return {
        user: {
          name: this.$store.$auth.user.name,
          company: this.$store.$auth.user.company,
          location: this.$store.$auth.user.location,
        },
        showStockOrderModal: false,
      }
    },
    components: {
      HeaderDropdown,
      StockOrderModal
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
      toggleStockOrderModal() {
        this.showStockOrderModal = !this.showStockOrderModal;
      },
    }
  }
</script>
