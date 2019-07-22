<template>
  <div class="app">
    <div class="app-body">
      <main class="main">
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { Footer as AppFooter } from '~/components/'

export default {
  name: 'full',
  components: {
    AppFooter,
  },
}
</script>
