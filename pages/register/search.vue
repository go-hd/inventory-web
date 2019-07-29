<template>
  <div class="container">
    <div>
      <b-alert v-if="alertMessage" show variant="danger">{{ alertMessage }}</b-alert>
    </div>
    <b-row class="justify-content-center mt-5">
      <b-col md="5">
        <div>会社名を入力</div>
        <b-form-group>
          <b-input-group>
            <b-form-input type="text" id="name" placeholder="会社名" v-model="company.name" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="searchCompany()">検索</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <!-- 一覧 -->
        <b-table responsive="sm" :items="showCompanies" :fields="fields" v-if="this.companies.length !== 0">
          <template slot="controls" slot-scope="data"></template>
        </b-table>
        <!-- /一覧 -->
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapGetters } from 'Vuex'

  export default {
    middleware: 'guest',
    layout: 'guest',
    data() {
      return {
        fields: ['名称'],
        company: {
          name: ''
        },
      }
    },
    computed: {
      /**
       * テーブル用の会社一覧を取得
       *
       * @returns {[]}
       */
      showCompanies() {
        return this.companies.map(company => {
          return {
            '名称': company.name,
          };
        })
      },
      ...mapGetters('companies', ['companies', 'alertMessage', 'alertStatus']),
    },
    methods: {
      async searchCompany() {
        const condition = {
          name: this.company.name
        };
        await this.$store.dispatch('companies/fetchCompanies', condition);
      }
    }
  }
</script>
