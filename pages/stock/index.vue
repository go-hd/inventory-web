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
      await store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id});
      await store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id});
      await store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id});
    },
  }
</script>
