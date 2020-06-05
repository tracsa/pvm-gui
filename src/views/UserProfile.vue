<template>
  <div>
    <base-layout style="max-width: 940px;">
      <template v-slot:top>
        <ca-user-profile-user-info
          :identifier="identifier"
        />
      </template>

      <template v-slot:left>
        <b-nav vertical pills>
          <b-nav-item
            v-for="item in listOptions"
            :key="item.value"
            :active="item.value == selectedOption"
            :disabled="loading"
            @click="selectedOption = item.value; loadPointers()"
          >{{ item.text }}</b-nav-item>
        </b-nav>
      </template>

      <template v-slot:right>
        <b-container
          class="p-0 justify-content-center"
        >
          <template
            v-if="pointers.length"
          >
            <b-row
              no-gutters
              v-for="pointer in pointers"
              :key="pointer.id"
            >
              <b-col>
                <user-profile-item
                  class="mb-3"
                  :pointer="pointer"
                />
              </b-col>
            </b-row>
            <b-row no-gutters>
              <b-col>
                <button v-on:click="loadPointers()">Add 1</button>
              </b-col>
            </b-row>
          </template>
          <b-row
            no-gutters
            v-else-if="!loading"
          >
            <b-col
              class="text-center"
            >No hay información que mostrar</b-col>
          </b-row>
          <b-row
            no-gutters
            v-if="loading"
          >
            <b-col>
              <div class="text-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </b-col>
          </b-row>

        </b-container>
      </template>
    </base-layout>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { get } from '../utils/api';

export default {
  props: ['identifier'],

  data() {
    return {
      loading: true,
      pointers: [],
      selectedOption: 'userPending',
      listOptions: [
        {
          value: 'userActivity',
          text: 'Actividad',
        },
        {
          value: 'userNotifications',
          text: 'Tareas Asignadas',
        },
        {
          value: 'userPending',
          text: 'Tareas Pendientes',
        },
      ],
      searchTitle: '',
      testIds: process.env.TEST_IDS,
      keyUsers: process.env.KEY_USERS,

      lastDate: null,

      userData: null,
    };
  },

  watch: {
    identifier: {
      immediate: true,
      handler() {
        this.pointers = [];
        this.loadPointers();
        this.lastDate = moment().toISOString();
      },
    },
  },

  computed: {
    isTestUser() {
      const vm = this;
      return (vm.testIds).includes(vm.identifier);
    },
  },

  methods: {
    loadPointers() {
      const vm = this;

      vm.loading = true;
      if (vm.selectedOption === 'userActivity') {
        vm.fetchUserActivity();
      } else if (vm.selectedOption === 'userNotifications') {
        vm.fetchNotifications();
      } else if (vm.selectedOption === 'userPending') {
        vm.fetchPending();
      }
    },

    fetchUserActivity: _.debounce(function fetchUserActivity() {
      const vm = this;

      let idList = [vm.identifier];
      if (vm.keyUsers.map(x => x.identifier).includes(vm.identifier)) {
        idList = idList.concat(vm.testIds);
      }

      vm.$api.getUsersActivity(idList, vm.lastDate)
        .then((response) => {
          const pointers = response.data.pointers;
          pointers.forEach((item) => {
            vm.pointers.push(item);
          });

          if (vm.pointers.length) {
            vm.lastDate = vm.pointers[vm.pointers.length - 1].started_at;
          }

          vm.loading = false;
        })
        .catch(() => {
          vm.loading = false;
        });
    }, 100),

    fetchNotifications() {
      const vm = this;
      const includesList = [
        'id',
        'notified_users',
        'started_at',
        'finished_at',
        'node.name',
        'execution',
        'state',
        'patch',
        'actors',
      ].toString();

      const pointersUrl = (
        '/pointer?' +
        `&notified_users.identifier=${vm.identifier}` +
        `&include=${includesList}`
      );

      get(pointersUrl)
        .then((data) => {
          vm.pointers = data.pointers;
          vm.loading = false;
        })
        .catch(() => {
          vm.loading = false;
        });
    },

    fetchPending: _.debounce(function fetchUserActivity() {
      const vm = this;

      let idList = [vm.identifier];
      if (vm.keyUsers.map(x => x.identifier).includes(vm.identifier)) {
        idList = idList.concat(vm.testIds);
      }

      vm.$api.getUsersPending(idList, vm.lastDate)
        .then((response) => {
          const pointers = response.data.pointers;
          pointers.forEach((item) => {
            vm.pointers.push(item);
          });

          if (vm.pointers.length) {
            vm.lastDate = vm.pointers[vm.pointers.length - 1].started_at;
          }

          vm.loading = false;
        })
        .catch(() => {
          vm.loading = false;
        });
    }, 100),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
