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
      await store.dispatch('products/fetchProducts', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * 商品一覧をブランドごとに分ける
       *
       * @returns {[]}
       */
      productsByBrand() {
        let res = [];
        for (let i = 0; i < this.$store.state.products.products.length; i += 1) {
          const item = this.$store.state.products.products[i];
          if (res[item.brand_id] === undefined) {
            res[item.brand_id] = [];
          }
          res[item.brand_id].push(item);
        }
        return res;
      },
      ...mapGetters('products', ['products']),
      ...mapGetters('brands', ['brands']),
    },
    mounted() {
      this.updateSidebar()
    },
    methods: {
      updateSidebar() {
        this.$nuxt.$emit('updateSidebar', this.brands, this.productsByBrand)
      }
    }
  }
</script>
