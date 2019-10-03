<template>
  <ul class="nav sidebar-product">
    <li class="nav-title">ブランド</li>

    <template v-for="(item) in brands">
      <SidebarNavDropdown :name="item.name" icon="icon-tag" v-bind:key="item.id">
        <template v-for="(product, index) in products[item.id]">
          <li class="nav-item" v-bind:key="index">
            <a class="nav-link">
              <i class="nav-icon icon-puzzle"></i> {{ product.jan_code}}</a>
          </li>
        </template>
      </SidebarNavDropdown>
    </template>
  </ul>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'
  import cloneDeep from 'lodash.clonedeep'
  import BrandModal from '../Modal/BrandModal'
  import SidebarNavDropdown from './SidebarNavDropdown'

  export default {
    name: 'sidebar-product',
    components: {
      SidebarNavDropdown,
      BrandModal,
    },
    data () {
      return {
        formData: {
          id: this.$store.$auth.user.id,
        },
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
    }
  }
</script>
