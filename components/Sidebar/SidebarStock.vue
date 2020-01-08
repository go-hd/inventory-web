<template>
  <div>
    <ul class="nav sidebar-lot">
      <li class="nav-title">ロット在庫</li>
      <SidebarNavDropdown
        v-for="location in locations"
        :name="location.name"
        icon="icon-tag"
        :key="'location-' + location.id"
        :open="location.id == activeLocationId"
        :active="location.id == activeLocationId"
      >
        <template>
          <li
            class="nav-item"
            v-for="brand in brandsHasLots"
            :key="'brand-' + brand.id"
            :class="{'active': brand.id == activeBrandId}"
          >
            <nuxt-link
              class="nav-link"
              :to="{name:'stock-locationId-brandId-lots', params: { brandId: brand.id, locationId: location.id }}"
            >
              <div class="name">
                <i class="nav-icon icon-puzzle"></i>
                <span>
                  {{ brand.name }}
                </span>
              </div>
            </nuxt-link>
          </li>
        </template>
      </SidebarNavDropdown>
    </ul>

    <ul class="nav sidebar-palette">
      <li class="nav-title">パレット</li>
      <template v-for="(item, index) in palettes">
        <SidebarNavItem
                :key="index"
                :classes="item.id == activePaletteId ? 'active' : ''"
        >
          <nuxt-link
            class="nav-link"
            :to="{name:'palette-id',params: {id: item.id}}"
          >
            <div class="name">
              <i class="nav-icon icon-drawer"></i>
              <span>{{ item.type }}</span>
            </div>
          </nuxt-link>
        </SidebarNavItem>
      </template>
      <li class="nav-control">
        <a @click="showModal('palette')">
          新規登録
        </a>
      </li>
    </ul>

    <PaletteModal v-if="showModalPalette" @close="closeModal('palette')" />
  </div>
</template>

<script>
  import PaletteModal from '../Modal/PaletteModal'
  import SidebarNavDropdown from './SidebarNavDropdown'
  import SidebarNavItem from './SidebarNavItem'

  export default {
    name: 'sidebar-stock',
    components: {
      SidebarNavDropdown,
      SidebarNavItem,
      PaletteModal,
    },
    data () {
      return {
        formData: {
          id: this.$store.$auth.user.id,
        },
        showModalPalette: false,
      }
    },
    props: {
      palettes: {
        type: Array,
        default: () => []
      },
      brandsHasLots: {
        type: Array,
        default: () => []
      },
      locations: {
        type: Array,
        default: () => []
      },
      activeBrandId: {
        type: Number,
        default: () => ''
      },
      activeLocationId: {
        type: Number,
        default: () => ''
      },
      activePaletteId: {
        type: Number,
        default: () => ''
      },
    },
    methods: {
      showModal(type, brand_id = null) {
        switch (type) {
          case 'palette':
            this.showModalPalette = true;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'palette':
            this.showModalPalette = false;
            break;
          default:
            break;
        }
      },
    }
  }
</script>
