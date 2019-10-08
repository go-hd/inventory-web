<template>
  <div>
  <ul class="nav sidebar-product">
    <li class="nav-title">ブランド</li>

    <template v-for="(item) in brands">
      <SidebarNavDropdown :name="item.name" icon="icon-tag" v-bind:key="item.id">
        <template v-for="(lot, index) in lots[item.id]">
          <li class="nav-item" v-bind:key="index">
            <a class="nav-link">
              <i class="nav-icon icon-puzzle"></i> {{ lot.name}}</a>
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
  </div>
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
        showModalBrand: false,
      }
    },
    props: {
      brands: {
        type: Array,
        default: () => []
      },
      lots: {
        type: Array,
        default: () => []
      },
    },
    methods: {
      showModal(type) {
        switch (type) {
          case 'brand':
            this.showModalBrand = true;
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
          default:
            break;
        }
      }
    }
  }
</script>
