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
@import '~bootstrap/scss/bootstrap.scss';

html, body, #app {
  height: 100vh;
}

#app {
  /* Linear gradient background */
  background: -moz-linear-gradient(top, #f6f8f9 0%, #edf1f2 100%);
  background: -webkit-linear-gradient(top, #f6f8f9 0%,#edf1f2 100%);
  background: linear-gradient(to bottom, #f6f8f9 0%,#edf1f2 100%);
}
</style>
