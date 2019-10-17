<template>
  <div>
    <ul class="nav sidebar-lot">
      <li class="nav-title">ロット在庫</li>
    </ul>

    <ul class="nav sidebar-palette">
      <li class="nav-title">パレット</li>

      <template v-for="(item, index) in palettes">
        <SidebarNavItem v-bind:key="index">
          <nuxt-link class="nav-link" v-bind:to="{name:'palette-id',params: {id: item.id}}">
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
