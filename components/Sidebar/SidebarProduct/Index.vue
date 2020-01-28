<template>
  <div>
    <ul class="nav sidebar-product">
      <li class="nav-title">ブランド</li>
      <!-- ブランド一覧 -->
      <SidebarNavDropdown
        v-for="brand in brands"
        :name="brand.name"
        icon="icon-tag"
        :key="'brand-' + brand.id"
        :open="brand.id === activeBrandId"
        :active="brand.id === activeBrandId"
      >
        <!-- ブランドにひもづく商品一覧 -->
        <template v-if="products.hasOwnProperty(brand.id)">
          <Products
            :products="products[brand.id]"
            :activeProductId="activeProductId"
          >
          </Products>
        </template>
        <!-- /ブランドにひもづく商品一覧 -->
        <!-- 商品一覧がない場合 -->
        <template v-else>
          <li class="nav-item">
            <a class="nav-link">
              <span class="jan-code">登録されていません</span>
            </a>
          </li>
        </template>
        <!-- /商品一覧がない場合 -->
        <!-- 商品登録ボタン -->
        <li class="nav-item nav-control">
          <a @click.prevent.stop="showModal('product', brand.id)">
            新規登録
          </a>
        </li>
        <!-- /商品登録ボタン -->
      </SidebarNavDropdown>
      <!-- /ブランド一覧 -->
      <!-- ブランド登録ボタン -->
      <li class="nav-control">
        <a @click.prevent="showModal('brand')">
          新規登録
        </a>
      </li>
      <!-- /ブランド登録ボタン -->
    </ul>
    <!-- ブランド登録モーダル -->
    <BrandModal
      v-if="showModalBrand"
      @close="closeModal('brand')" />
    <!-- /ブランド登録モーダル -->
    <!-- 商品登録モーダル -->
    <ProductModal
      v-if="showModalProduct"
      @close="closeModal('product')"
      :brand_id="selectedBrandId" />
    <!-- /商品登録モーダル -->
  </div>
</template>

<script>
import BrandModal from '../../Modal/Brand/Index'
import ProductModal from '../../Modal/Product/Index'
import SidebarNavDropdown from '../SidebarNavDropdown'
import Products from './Products'

export default {
  name: 'sidebar-product-index',
  components: {
    SidebarNavDropdown,
    BrandModal,
    ProductModal,
    Products,
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
    activeBrandId: {
      type: Number,
      default: () => ''
    },
    activeProductId: {
      type: Number,
      default: () => ''
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
