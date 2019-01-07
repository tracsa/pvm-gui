<template>
  <div class="card">
    <div class="card-header">
      <div class="head-container">

        <div class="text-primary">
          <div class="row">
            <div class="col-11">
              <b>{{ execution.name }}</b>
            </div>
            <div class="col-1 text-right">
              <router-link :to="{ path: '/admin/tracking'}" replace>
                <icon :icon="['fas', 'times']" />
              </router-link>
            </div>
          </div>
        </div>

        <linear-steps :nodes="nodes"/>
      </div>
    </div>

    <user-list
      v-if="!loading"
      :users="node.notified_users"
      class="card-body"/>

    <div v-else>
      <hero
        v-if="loading"
        icon="spinner"
        title="commons.loading"
        spin
      />
    </div>

    <div class="card-body">
      <form
        @submit="addUser($event)">
        <div
          class="text-danger"
          v-if="hasError">
          {{ $t('signin.error_signin') }}
        </div>

        <!-- TODO: i18n this -->
        <div class="form-group mt-3">
          <input
            v-model="username"
            type="text"
            :placeholder="'User'"
            class="form-control"
            :class="{'is-invalid': hasError}"
          >
        </div>

        <button
          class="btn btn-primary mt-3"
          :disabled="sigingIn"
        >
          <!-- TODO: i18n this -->
          Add user
        </button>

      </form>
    </div>

  </div>
</template>

<script>
import { get, put } from '../utils/api';

export default {
  props: ['id', 'node'],
  data() {
    return {
      // form: username
      username: '',
      // current execution
      execution: [],
      // all execution' nodes
      nodes: [],
      // checks
      hasError: false,
      addingUser: false,
      loading: false,
      sleep: 0,
      timeoutId: 0,
      errors: [],
    };
  },
  mounted() {
    this.reloadJob();
  },
  watch: {
    id(newId) {
      this.sleep = 0;
      this.reloadJob();
      this.loadData(newId);
    },
  },
  methods: {
    reloadJob() {
      // In case of dead component
      if (!this || !this.loadData || !this.id) {
        return;
      }

      // Clear prev timeout
      clearTimeout(this.timeoutId);

      // Load data
      this.loadData(this.id);

      // Set new timeout with +1s delay
      this.sleep = this.sleep + 1000;
      this.timeoutId = setTimeout(this.reloadJob, this.sleep);
    },
    loadData: function loadData(id) {
      get(`/execution/${id}`).then((execution) => {
        const state = execution.data.state;
        const nodes = state.item_order.map(key => state.items[key]);

        this.execution = execution.data;
        this.nodes = nodes;
        this.loading = false;
      });
    },
    addUser: function addUser(event) {
      event.preventDefault();

      this.hasError = false;
      this.addingUser = true;

      const requestData = {
        identifier: this.username,
        node_id: this.node.node.id,
      };

      put(`/execution/${this.id}/user`, requestData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$router.replace('/admin/tracking');
        });
    },
  },
};
</script>
