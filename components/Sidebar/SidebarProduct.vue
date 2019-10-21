<template>
  <div>
    <ul class="nav sidebar-product">
      <li class="nav-title">ブランド</li>
      <SidebarNavDropdown
        v-for="brand in brands"
        :name="brand.name"
        icon="icon-tag"
        :key="'brand-' + brand.id">
        <template v-if="products.hasOwnProperty(brand.id)">
          <li
            class="nav-item"
            v-for="product in products[brand.id]"
            :key="'product-' + product.id">
            <nuxt-link
              class="nav-link"
              :to="{ name:'product-id-lots', params: { id: product.id } }">
              <span class="jan-code">JAN : {{ product.jan_code }}</span>
              <div class="name">
                <i class="nav-icon icon-puzzle"></i>
                <span>
                  {{ product.current_lot ? product.current_lot.name : 'lotがありません'}}
                </span>
              </div>
            </nuxt-link>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <a class="nav-link">
              <span class="jan-code">登録されていません</span>
            </a>
          </li>
        </template>
        <li class="nav-item nav-control">
          <a @click.prevent.stop="showModal('product', brand.id)">
            新規登録
          </a>
        </li>
      </SidebarNavDropdown>
      <li class="nav-control">
        <a @click.prevent="showModal('brand')">
          新規登録
        </a>
      </li>
    </ul>
    <BrandModal
      v-if="showModalBrand"
      @close="closeModal('brand')"/>
    <ProductModal
      v-if="showModalProduct"
      @close="closeModal('product')"
      :brand_id="selectedBrandId"/>
  </div>
</template>

<script>
import BrandModal from '../Modal/BrandModal'
import ProductModal from '../Modal/ProductModal'
import SidebarNavDropdown from './SidebarNavDropdown'

export default {
  name: 'sidebar-product',
  components: {
    SidebarNavDropdown,
    BrandModal,
    ProductModal,
  },
  data () {
    return {
      formData: {
        id: this.$store.$auth.user.id,
      },
      showModalBrand: false,
      showModalProduct: false,
      selectedBrandId: false,
    }
  },
  props: {
    brands: {
      type: Array,
      default: () => []
    },
    products: {
      type: Array | Object,
      default: () => []
    },
  },
  methods: {
    showModal (type, brand_id = null) {
      switch (type) {
        case 'brand':
          this.showModalBrand = true
          break
        case 'product':
          this.selectedBrandId = brand_id
          this.showModalProduct = true
          break
        default:
          break
      }
    },
    closeModal (type) {
      switch (type) {
        case 'brand':
          this.showModalBrand = false
          break
        case 'product':
          this.showModalProduct = false
          break
        default:
          break
      }
    },
  }
}
</script>
