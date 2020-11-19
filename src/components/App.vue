<template>
  <div class="h-100">
    <app-header />

    <b-alert
      variant="danger"
      class="w-25 mx-auto text-center"
      v-model="showAlert"
    >
      <icon :icon="['fas', 'plug']"/>
      {{ $t('commons.offline') }}
    </b-alert>

    <router-view />
  </div>
</template>

<script>
import { get } from '../utils/api';

export default {
  data() {
    return {
      timer: null,
      backendUrl: process.env.CACAHUATE_URL,
      online: true,
      showAlert: false,
    };
  },

  methods: {
    checkOnline() {
      const vm = this;

      get('/execution?limit=1&include=_')
        .then(() => {
          vm.online = true;
          vm.showAlert = false;
        })
        .catch(() => {
          vm.online = false;
          vm.showAlert = true;
        });
    },
  },

  created() {
    this.checkOnline();
    this.timer = setInterval(this.checkOnline, 60000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
