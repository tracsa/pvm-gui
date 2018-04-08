<template>
  <div class="pvm-navbar mb-4">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ path: '/task' }">
              {{ $t('header.tasks') }}
            </router-link>
          </li>          
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ path: '/' }">
              {{ $t('header.processes') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ path: '/tracking' }">
              {{ $t('header.trackings') }}
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              href="javascript:void(0);"
              class="nav-link dropdown-toggle"
              @click="toggleMenu"
              @blur="closeMenu"
              >
              {{ this.username }}
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              :class="{ show: menuVisible }">
              <h6 class="dropdown-header">{{ this.username }}</h6>
              <div class="dropdown-divider"></div>
              <a
                class="dropdown-item"
                href="javascript:void(0);"
                @click="signOut">
                {{ $t('header.signout') }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <nav class="py-2">
      <center><b>PVM</b></center>
    </nav>
  </div>
</template>

<script>
import { getAuthToken, logout } from '../utils/auth';

export default {
  data() {
    return {
      username: getAuthToken().split(/[:\\]/)[1] + '@tracsa.com.mx',
      menuVisible: false,
    };
  },
  methods: {
    toggleMenu: function toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    closeMenu: function closeMenu() {
      // Wait 200ms to handle any click inside menu
      setTimeout(() => {
        this.menuVisible = false;
      }, 200);
    },
    signOut: function() {
      logout();
    },
  },
  name: 'Header',
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.pvm-navbar {
  border-top: 3px solid $purple;
  box-shadow: 0 3px 2px $gray-300;
  background: $white;

  nav + nav {
    border-top: 1px solid $gray-300;
  }
}
</style>
