<template>
  <div>
  <ul class="nav sidebar-product">
    <li class="nav-title">ブランド</li>

    <template v-for="(item) in brands">
      <SidebarNavDropdown :name="item.name" icon="icon-tag" v-bind:key="item.id">
        <template v-for="(product, index) in products[item.id]">
          <li class="nav-item" v-bind:key="index">
            <nuxt-link class="nav-link" v-bind:to="{name:'product-id-lots',params: {id: product.id}}">
              <span class="jan-code">JAN : {{ product.jan_code}}</span>
              <div class="name">
                <i class="nav-icon icon-puzzle"></i>
                <span>{{ product.current_lot ? product.current_lot.name : 'lotがありません'}}</span>
              </div>
            </nuxt-link>
          </li>
          <li class="nav-item nav-control" v-bind:key="'button-' + index"
              v-if="products[item.id].length === index + 1">
            <a @click="showModal('product', item.id)">
              新規登録
            </a>
          </li>
        </template>
        <template v-if="products[item.id] === undefined">
          <li class="nav-item" v-bind:key="0">
            <a class="nav-link">
              <span class="jan-code">登録されていません</span>
            </a>
          </li>
          <li class="nav-item nav-control" v-bind:key="'button-' + 0"
          >
            <a @click="showModal('product', item.id)">
              新規登録
            </a>
          </li>
        </template>
      </SidebarNavDropdown>
    </template>
    <li class="nav-control">
      <a @click="showModal('brand')">
        新規登録
      </a>
    </li>
  </ul>
  <BrandModal v-if="showModalBrand" @close="closeModal('brand')" />
  <ProductModal v-if="showModalProduct" @close="closeModal('product')" v-bind:brand_id="selectedBrandId" />
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
        type: Array,
        default: () => []
      },
    },
    methods: {
      showModal(type, brand_id = null) {
        switch (type) {
          case 'brand':
            this.showModalBrand = true;
            break;
          case 'product':
            this.showModalProduct = true;
            this.selectedBrandId = brand_id;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'brand':
            this.showModalBrand = false;
            break;
          case 'product':
            this.showModalProduct = false;
            break;
          default:
            break;
        }
      },
    }
  }
</script>
