<template>
  <div class="animated fadeIn">
    <b-row>
    </b-row>
  </div>
</template>

<script>
  import { mapGetters } from 'Vuex'

  export default {
    name: 'dashboard',
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('brands/fetchBrands', {company_id: store.state.auth.user.company.id});
      await store.dispatch('lots/fetchLots', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * 商品一覧をブランドごとに分ける
       *
       * @returns {[]}
       */
      lotsByBrand() {
        let res = [];
        for (let i = 0; i < this.lots.length; i += 1) {
          const item = this.lots[i];
          if (res[item.product.brand_id] === undefined) {
            res[item.product.brand_id] = [];
          }
          res[item.product.brand_id].push(item);
        }
        return res;
      },
      ...mapGetters('brands', ['brands']),
      ...mapGetters('lots', ['lots']),
    },
    mounted() {
      this.updateSidebar()
    },
    methods: {
      updateSidebar() {
        this.$nuxt.$emit('updateSidebar', this.brands, this.lotsByBrand)
      }
    }
  }
</script>
