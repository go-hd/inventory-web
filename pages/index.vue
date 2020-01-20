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
      await store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id});
      await store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id});
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarStock', 0, 0, 0)
    }
  }
</script>
