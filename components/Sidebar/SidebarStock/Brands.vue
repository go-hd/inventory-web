<template>
  <div>
    <li
      class="nav-item"
      v-for="brand in brandsHasLots"
      :key="'brand-' + brand.id"
      :class="{'active': location.id == activeLocationId && brand.id == activeBrandId}">
      <nuxt-link
        class="nav-link"
        :to="{name:'stock-locationId-brandId-lots', params: { brandId: brand.id, locationId: location.id }}">
        <div class="name">
          <i class="nav-icon icon-puzzle"></i>
          <div>{{ brand.name }}</div>
        </div>
      </nuxt-link>
    </li>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-stock-brands',
    props: {
      location: {
        type: Array,
        default: () => []
      },
      brandsHasLots: {
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
    },
  }
</script>
