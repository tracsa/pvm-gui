<template>
  <div class="header-container">
    <div
      v-for="(user, index) in users"
      :key="index">
      {{ user.fullname }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['users'],
  data() {
    return {
      sleep: 0,
      tiemoutId: 0,
    };
  },
  mounted() {
  },
};
</script>

<style>
</style>
