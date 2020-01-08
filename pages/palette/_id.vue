<template>
  <div class="wrapper page product">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12">
          <b-card header-tag="header" footer-tag="footer">
            <!-- ヘッダー -->
            <div slot="header">
              <span class="sub-title">
                {{ palette.type }} <i class="icon-pencil edit-icon" @click="showModal('palette', palette.id)"></i>
                保管分布
              </span><br />
              <p>所有者：{{ palette.location.name }}</p>
              <span class="main-title">パレット一覧</span>
              <b-button variant="primary" class="float-right w-25" @click="showModal('palette-move')"><i class="fa fa-plus"></i></b-button>
            </div>
            <!-- /ヘッダー -->
            <div>
              <div class="card-columns">
                <template v-for="(shared_location, index) in palette.shared_locations">
                  <div
                    :class="(shared_location.id === palette.location.id) ? 'bg-danger' : 'bg-secondary'"
                    class="card text-white mb-3"
                    :key="index"
                    @click="showModal('palette-move', shared_location.id)"
                  >
                    <div class="card-body">
                      <h4 class="card-title">{{ shared_location.name }}</h4>
                      <div class="info">
                        {{ shared_location.name }}<br>
                        {{ shared_location.quantity }}個<br>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </b-card>
        </b-col>
        <PaletteModal
          v-if="showModalPalette"
          @close="closeModal('palette')"
          :id="showModalId"
        />
        <PaletteMoveModal
          v-if="showModalPaletteMove"
          @close="closeModal('palette-move')"
          :id="showModalId"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
  import PaletteModal from '~/components/Modal/PaletteModal'
  import PaletteMoveModal from '~/components/Modal/PaletteMoveModal'
  import { mapGetters } from 'vuex'
  import cloneDeep from 'lodash.clonedeep'

  export default {
    name: 'palette',
    components: {
      PaletteModal,
      PaletteMoveModal,
    },
    data () {
      return {
        showModalPalette: false,
        showModalPaletteMove: false,
        showModalId: null,
      }
    },
    /**
     * データ取得
     */
    async asyncData({ store }) {
      await store.dispatch('palettes/fetchPalettes', {company_id: store.state.auth.user.company.id});
      await store.dispatch('locations/fetchLocations', {company_id: store.state.auth.user.company.id});
      await store.dispatch('brands/fetchBrandsHasLots', {company_id: store.state.auth.user.company.id});
    },
    computed: {
      /**
       * IDにひもづくパレットを取得
       *
       * @returns {[]}
       */
      palette() {
        return cloneDeep(this.palettes.find(data => data.id == this.$route.params.id));
      },
      ...mapGetters('palettes', ['palettes']),
    },
    mounted() {
      this.$nuxt.$emit('updateSidebarStock', 0, 0, this.palette.id)
    },
    methods: {
      showModal(type, id = null) {
        switch (type) {
          case 'palette':
            this.showModalPalette = true;
            this.showModalId = id;
            break;
          case 'palette-move':
            this.showModalPaletteMove = true;
            this.showModalId = id;
            break;
          default:
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case 'palette':
            this.showModalPalette = false;
            this.showModalId = null;
            break;
          case 'palette-move':
            this.showModalPaletteMove = false;
            this.showModalId = null;
            break;
          default:
            break;
        }
      },
    }
  }
</script>
