<template>
  <div></div>
</template>

<script>
  export default {
    name: 'dashboard',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await Promise.all([
        store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id}),
        store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id}),
        store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id}),
        store.dispatch('lots/fetchLotsByCompany', {company_id: store.state.auth.user.company.id}),
      ]);
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarStock', 0, 0, 0)
    }
  }
</script>
