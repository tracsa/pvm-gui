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
@import './styles/variables.scss';
@import './styles/activities.scss';
@import '~bootstrap/scss/bootstrap.scss';

html, body, #app {
  height: 100vh;
  background: $body-bg;
}
</style>
