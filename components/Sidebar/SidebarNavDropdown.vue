<template>
  <li class="nav-item nav-dropdown" :class="{ open }">
    <div class="nav-link nav-dropdown-toggle" @click.prevent="open=!open">
      <i :class="icon"></i> {{ name }}
    </div>
    <ul class="nav-dropdown-items">
      <slot/>
    </ul>
  </li>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
