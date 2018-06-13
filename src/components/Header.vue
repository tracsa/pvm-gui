<template>
  <div class="pvm-navbar mb-4">
    <nav class="navbar navbar-expand-lg navbar-light bg-white d-none d-lg-block">
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
              {{ this.firstname }}
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              :class="{ show: menuVisible }">
              <h6 class="dropdown-header">{{ this.fullname }}</h6>
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

    <div class="mobile-header row d-lg-none">
      <div class="col">
        <router-link
          :to="{ path: '/task' }">
            {{ $t('header.tasks') }}
        </router-link>
      </div>
      <div class="col">
        <router-link
          :to="{ path: '/' }">
            {{ $t('header.processes') }}
        </router-link>
      </div>
      <div class="col">
        <router-link
          :to="{ path: '/tracking' }">
            {{ $t('header.trackings') }}
        </router-link>
      </div>
      <div class="col">
        <a
          href="javascript:void(0);"
          @click="signOut">
            {{ $t('header.signout') }}
        </a>
      </div>
    </div>

    <nav class="py-2">
      <center><b>{{ $t('header.title') }}</b></center>
    </nav>
  </div>
</template>

<script>
import { getAuthUser, logout } from '../utils/auth';

export default {
  data() {
    const user = getAuthUser();

    return {
      firstname: user.fullname.split(/\s+/)[0],
      fullname: user.fullname,
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
    signOut: function signOut() {
      logout();
    },
  },
  name: 'Header',
};
</script>

<style lang="scss" scoped>
@import "../styles/_variables.scss";

.pvm-navbar {
  border-top: 3px solid $purple;
  box-shadow: 0 3px 2px $gray-300;
  background: $white;

  .nav-item {
    word-break: break-all;
  }

  nav + nav {
    border-top: 1px solid $gray-300;
  }
}

.mobile-header {
  margin: 0;

  .col {
    a {
      display: block;
      text-align: center;
      line-height: 38px;
      font-size: .9em;
    }
  }

  border-bottom: 1px solid #ccc;
}
</style>
