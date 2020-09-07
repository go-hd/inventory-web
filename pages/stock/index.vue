<template>
  <div class="animated fadeIn">
    <b-row>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'stock',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await Promise.all([
        store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id}),
        store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id}),
        store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id}),
        store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id}),
        store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id}),
        store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id}),
        store.dispatch('lots/fetchLotsByCompany', {company_id: store.state.auth.user.company.id}),
      ]);
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarProduct', 0, 0)
    }
  }
</script>
