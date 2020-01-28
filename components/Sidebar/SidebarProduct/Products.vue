<template>
  <div>
    <li
      class="nav-item"
      v-for="product in products"
      :key="'product-' + product.id"
      :class="{'active': product.id == activeProductId}">
      <nuxt-link
        class="nav-link"
        :to="{ name:'product-id-lots', params: { id: product.id } }">
        <span class="jan-code">JAN : {{ product.jan_code }}</span>
        <div class="name">
          <i class="nav-icon icon-puzzle"></i>
          <span>{{ product.current_lot ? product.current_lot.name : 'lotがありません'}}</span>
        </div>
      </nuxt-link>
    </li>
  </div>
</template>

<script>
export default {
  name: 'sidebar-product-products',
  props: {
    products: {
      type: Array | Object,
      default: () => []
    },
    activeProductId: {
      type: Number,
      default: () => ''
    },
  },
}
</script>
