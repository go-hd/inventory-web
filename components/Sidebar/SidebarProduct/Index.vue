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
        <li class="nav-item nav-control product-register">
          <a @click.prevent.stop="$nuxt.$emit('showModal', 'product', brand.id)">
            新規登録
          </a>
        </li>
        <!-- /商品登録ボタン -->
      </SidebarNavDropdown>
      <!-- /ブランド一覧 -->
      <!-- ブランド登録ボタン -->
      <li class="nav-control">
        <a @click.prevent="$nuxt.$emit('showModal', 'brand')">
          新規登録
        </a>
      </li>
      <!-- /ブランド登録ボタン -->
    </ul>
  </div>
</template>

<script>
import SidebarNavDropdown from '../SidebarNavDropdown'
import Products from './Products'

export default {
  name: 'sidebar-product-index',
  components: {
    SidebarNavDropdown,
    Products,
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
  }
}
</script>
