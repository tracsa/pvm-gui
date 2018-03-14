<template>
  <header>
    <center style="font-size:1.2em;font-weight: bold;">PVM</center>
    <ul class="header-tabs">
      <li class="active">Tasks</li>
      <li>Documents</li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

header {
  box-shadow: 0 3px 2px $gray-300;
  margin-bottom: 15px;
  background: $white;
  padding-top: 15px;

  ul.header-tabs {
    display: flex;
    flex-direction: row;
    justify-content: center;

    padding-left: 0;
    margin-bottom: 0;

    li {
      position: relative;
      display: block;
      border-bottom: 3px solid white;

      & + li {
        margin-left: 30px;
      }

      &.active {
        border-bottom-color: $purple;
      }
    }
  }
}
</style>
