<template>
  <div class="timeline-action">
    <div class="card text-white bg-secondary">
      <div class="card-header">
        <div>
          <div class="actions">
            <a class="btn"
              @click="toggleCollapse"
            >
              <icon
                class="toggle"
                :icon="collapseClassName"
              />
            </a>
          </div>
          {{ $t('management.executionDelete.cancelExecution') }}
          <b>{{ execution.name }}</b>
        </div>
      </div>

      <div class="card-body" v-if="!collapse">
        <form
          @submit="submit($event)">
          <div class="form-group">
            <b-form-checkbox v-model="checked" name="check-button">
              {{ $t('management.executionDelete.confirm') }}
            </b-form-checkbox>
          </div>

          <div class="form-group">
            <button
              v-if="!sending"
              class="btn btn-primary"
              :disabled="!checked">
              {{ $t('commons.send') }}
            </button>

            <button
              v-else
              class="btn btn-primary"
              disabled>
              {{ $t('commons.sending') }}
            </button>

          </div>
          <div
            v-if="success">
            {{ $t('management.executionDelete.success') }}
          </div>
          <div v-else-if="errors">
            {{ $t('management.executionDelete.retry') }}
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAuthToken } from '../../utils/auth';

export default {
  props: ['execution'],

  data() {
    return {
      assigned: false,
      collapse: false,
      sending: false,
      errors: false,
      success: false,

      checked: false,
    };
  },

  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },

    submit(event) {
      event.preventDefault();

      this.errors = false;
      this.sending = true;
      this.deleteExecution();
    },

    deleteExecution() {
      const vm = this;

      const baseUrl = process.env.CACAHUATE_URL;
      const executionId = vm.execution.id;

      const deleteUrl = `${baseUrl}/v1/execution/${executionId}`;
      let auth = getAuthToken();

      if (typeof window !== 'undefined') {
        auth = btoa(auth);
      } else {
        auth = new Buffer(auth).toString('base64');
      }

      const requestData = {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          charset: 'UTF-8',
        },
      };

      axios.delete(deleteUrl, requestData)
        .then(() => {
          vm.sending = false;
          vm.assigned = true;
          vm.success = true;
        })
        .catch(() => {
          vm.sending = false;
          vm.errors = true;
        });
    },
  },

  computed: {
    collapseClassName() {
      const response = ['fas'];
      if (this.collapse) {
        response.push('chevron-left');
      } else {
        response.push('chevron-down');
      }

      return response;
    },

  },
};
</script>
