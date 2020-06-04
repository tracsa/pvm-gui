<template>
  <b-card no-body>
    <b-card-body>
      <template
        v-if="loading"
      >
        <b-card-title>
          {{ $t('commons.loading') }}
        </b-card-title>
        <b-card-text class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">{{ $t('commons.loading') }}</span>
          </div>
        </b-card-text>
      </template>

      <template
        v-else-if="user"
      >
        <b-card-title
        >{{ user.fullname }}</b-card-title>
        <b-card-sub-title>
          <a :href="'mailto:' + user.email">{{ user.email }}</a><br/>
        </b-card-sub-title>
      </template>

      <template
        v-else
      >
        <b-card-title>{{ identifier }}</b-card-title>
        <b-card-sub-title>No hay información disponible para {{ identifier }}</b-card-sub-title>
      </template>

      <template
        v-if="isKeyUser"
      >
        <b-card-text class="mt-3">
          <icon :icon="['fa', 'star']"/>
          <b>Key User</b>
        </b-card-text>
      </template>

      <template
        v-if="isTestUser"
      >
        <b-card-text class="mt-3">
          <icon :icon="['fas', 'exclamation-triangle']"/>
          <b>{{ $t('commons.testUsers.title') }}</b><br/>
          <span>{{ $t('commons.testUsers.description') }}</span><br/>
          <span>{{ $t('commons.testUsers.contact') }}</span><br/>
          <span
            v-for="(user, index) in keyUsers"
            v-bind:key="index"
          >
            <router-link
              :to="{ name: 'user-profile', params: { identifier: user.identifier }}"
            ><strong>{{ user.name }}</strong></router-link><br/>
            <a :href="'mailto:' + user.email">{{ user.email }}</a><br/>
          </span>
        </b-card-text>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import _ from 'lodash';
import UserService from '../../services/user.service';

export default {
  props: [
    'identifier',
  ],

  data() {
    return {
      loading: true,
      user: null,

      testIds: process.env.TEST_IDS,
      keyUsers: process.env.KEY_USERS,
    };
  },

  computed: {
    isTestUser() {
      const vm = this;
      return (vm.testIds).includes(vm.identifier);
    },

    isKeyUser() {
      const vm = this;
      return vm.keyUsers.map(x => x.identifier).includes(vm.identifier);
    },
  },

  watch: {
    identifier: {
      immediate: true,
      handler() {
        this.fetchUserInfo();
      },
    },
  },

  methods: {
    fetchUserInfo: _.debounce(function fetchUserInfo() {
      const vm = this;

      UserService.getUserInfo(vm.identifier)
        .then((response) => {
          vm.user = response.data;
          vm.loading = false;
        })
        .catch(() => {
          vm.user = null;
          vm.loading = false;
        });
    }, 100),
  },

};
</script>
