<template>
  <div>
    <ul class="nav sidebar-lot">
      <li class="nav-title">ロット在庫</li>
      <!-- ロット一覧 -->
      <SidebarNavDropdown
        v-for="location in locations"
        :name="location.name"
        icon="icon-tag"
        :key="'location-' + location.id"
        :open="location.id == activeLocationId"
        :active="location.id == activeLocationId"
      >
        <!-- ロットに紐付くブランド一覧 -->
        <Brands
          :location="location"
          :brandsHasLots="brandsHasLots"
          :activeBrandId="activeBrandId"
          :activeLocationId="activeLocationId"
        >
        </Brands>
        <!-- /ロットに紐付くブランド一覧 -->
      </SidebarNavDropdown>
      <!-- /ロット一覧 -->
    </ul>

    <ul class="nav sidebar-palette">
      <li class="nav-title">パレット</li>
      <!-- パレット一覧 -->
      <template v-for="(item, index) in palettes">
        <SidebarNavItem
          :key="index"
          :classes="item.id == activePaletteId ? 'active' : ''">
          <nuxt-link
            class="nav-link"
            :to="{name:'palette-id',params: {id: item.id}}" >
            <div class="name">
              <i class="nav-icon icon-drawer"></i>
              <div>{{ item.type }}</div>
            </div>
          </nuxt-link>
        </SidebarNavItem>
      </template>
      <!-- /パレット一覧 -->
      <!-- パレット登録ボタン -->
      <li class="nav-control">
        <a @click="$nuxt.$emit('showModal', 'palette')">
          新規登録
        </a>
      </li>
      <!-- /パレット登録ボタン -->
    </ul>
  </div>
</template>

<script>
  import SidebarNavDropdown from '../SidebarNavDropdown'
  import SidebarNavItem from '../SidebarNavItem'
  import Brands from './Brands'

  export default {
    name: 'sidebar-stock',
    components: {
      SidebarNavDropdown,
      SidebarNavItem,
      Brands,
    },
    props: {
      palettes: {
        type: Array,
        default: () => []
      },
      brandsHasLots: {
        type: Object,
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
  }
</script>
