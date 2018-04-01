<template>
  <header>
    <div class="top-bar">
      <ul class="menu">
        <li class="active">{{ $t('header.tasks') }}</li>
        <li class="right">{{ $t('header.logout') }}</li>
      </ul>
    </div>
    <center style="font-size:1.2em;font-weight: bold; padding-top: 10px">PVM</center>
    <ul class="header-tabs">
      <li class="active">{{ $t('header.tasks') }}</li>
      <li>{{ $t('header.documents') }}</li>
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
@import url('https://fonts.googleapis.com/css?family=Fira+Sans');

header {
  box-shadow: 0 3px 2px $gray-300;
  margin-bottom: 15px;
  background: $white;
  border-top: 1px solid #333;

  div.top-bar {
    border-bottom: 1px solid $gray-300;

    ul.menu {
      height: 50px;
      display: flex;
      padding: 0 100px;
      align-items: center;
      font-family: 'Fira Sans', sans-serif;
      font-weight: lighter;
      font-size: 15px;
      color: $gray-500;

      margin-bottom: 0;

      li {
        display: inline-block;
        border-bottom: 3px solid white;

        & + li {
          margin-left: 30px;
        }

        &.right{
          position: absolute;
          right: 100px;
        }

        &:hover {
          cursor: pointer;
          color: mix($black, $gray-700);
        }

        &.active {
          color: mix($black, $gray-700);
        }
      }
    }
  }

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
