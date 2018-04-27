<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import './styles/main.scss';

html, body, #app {
  height: 100vh;
  background: $body-bg;
}

.no-overflow-x {
  overflow: hidden;
}
</style>
