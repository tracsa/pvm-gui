<template>
  <header>
    <div class="top-bar flex-container">
      <div class="menu">
        <ul>
          <li class="active">{{ $t('header.tasks') }}</li>
          <li class="right">{{ $t('header.documents') }}</li>
        </ul>
      </div>
      <div class="dropdown-container">
        <a v-on:click="toggleDropDown" v-bind:class="{ active: dropdown }">{{ this.username }}</a>
        <div class="dropdown" v-if="dropdown">
          <ul>
            <li>{{ $t('header.logout') }}</li>
          </ul>
        </div>
      </div>
    </div>
    <center class="title-center">PVM</center>
  </header>
</template>

<script>

import { getAuthToken } from '../utils/auth';

export default {
  data() {
    return {
      username: getAuthToken().split(/[:\\]/)[1] + '@tracsa.com.mx',
      dropdown: false,
    };
  },
  methods: {
    toggleDropDown: function() {
      return this.dropdown = !this.dropdown;
    },
  },
  name: 'Header',
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.active {
  color: $black-light !important;
}

header {
  box-shadow: 0 3px 2px $gray-300;
  margin-bottom: 15px;
  background: $white;
  border-top: 3px solid $purple;

  .title-center {
    font-size:1.2em;
    font-weight: bold;
    padding: 10px 0;
  }

  div.top-bar {
    display: flex;
    border-bottom: 1px solid $gray-300;
    align-items: center;
    padding: 10px 100px;

    div.menu {
      flex-grow: 1;
      font-weight: lighter;
      font-size: 15px;
      color: mix($gray-500, $gray-600);

      & + div {
        margin-left: 30px;
      }

      ul {
        margin-bottom: 0;
        padding-left: 0;

        li {
          display: inline;

          & + li {
            margin-left: 30px;
          }

          &:hover {
            cursor: pointer;
            color: $black-light;
          }

        }

      }
    }

    .dropdown-container {
      cursor: pointer;
      font-size: 15px;
      color: mix($gray-500, $gray-600);

      .dropdown {
        position: absolute;
        right: 100px;
        width: 250px;
        background: $white;
        border: 1px solid $gray-300;
        border-radius: 3px;
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.1);

        ul {
          padding: 5px 0;
          margin-bottom: 0;

          li {
            display: block;
            width: 100%;
            padding: 5px 40px;

            &:hover {
              background: mix($blue, $gray-400);
              color: $white;
            }

          }

        }

      }

    }

  }

}
</style>
