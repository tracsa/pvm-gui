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
          {{ $t('management.userAssignment.assignTask') }}
          <b><span v-html="name_render"/></b>
        </div>
      </div>

      <div class="card-body" v-if="!collapse">
        <div
          v-if="node.node.description"
          class="card-desc bg-dark"
          v-html="description_render"/>
        <form
          @submit="submit($event)">
          <div class="form-group">
            <label
              for="user-assignment"
            >{{ $t('management.userAssignment.newUser') }}</label>
            <input
              class="form-control"
              id="user-assignment"
              v-model="userid"
              :class="{ 'is-invalid': errors }"
              aria-describedby="userAssignmentHelp"
              @input="errors = false; assigned = false;"
              >
            <span
              id="userAssignmentHelp"
              class="form-text"
            >Asignado a:
              <span
                style="font-weight: bold;"
                v-for="(user, index) in node.notified_users"
                :key="user.id"
              >{{ user.fullname || user.identifier }}<span
                v-if="index != (node.notified_users.length - 1)">, </span>
              </span>
            </span>
          </div>

          <div class="form-group">
            <button
              v-if="!sending"
              class="btn btn-primary"
              :disabled="!isValid || assigned || errors">
              {{ $t('commons.send') }}
            </button>

            <button
              v-else
              class="btn btn-primary"
              :disabled="true">
              {{ $t('commons.sending') }}
            </button>

          </div>
          <div
            v-if="assigned">
            {{ $t('management.userAssignment.userAssignationSuccesful') }}
          </div>
          <div v-if="errors">
            {{ $t('errors.username.invalid') }}
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import { put } from '../../utils/api';

const md = require('markdown-it')();

export default {
  props: ['node'],

  data() {
    return {
      assigned: false,
      collapse: true,
      sending: false,
      userid: '',
      errors: false,
      foo: {},
    };
  },

  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },

    submit(event) {
      event.preventDefault();

      this.sending = true;
      this.assignUser();
    },

    assignUser() {
      const vm = this;

      const requestData = {
        identifier: vm.cleanUsername,
        node_id: vm.node.node.id,
      };

      put(`/execution/${vm.node.execution.id}/user`, requestData, 'application/json')
        .then(() => {
          vm.sending = false;
          vm.assigned = true;
        })
        .catch(() => {
          vm.sending = false;
          vm.errors = true;
        });
    },
  },

  computed: {
    isValid() {
      const vm = this;

      return (
        vm.userid.length > 0 &&
        vm.userid.split(' ').filter(v => v !== '').length === 1
      );
    },

    cleanUsername() {
      const words = this.userid.split(' ').filter(v => v !== '');

      if (words.length > 0) {
        return words[0];
      }

      return '';
    },

    collapseClassName() {
      const response = ['fas'];
      if (this.collapse) {
        response.push('chevron-left');
      } else {
        response.push('chevron-down');
      }

      return response;
    },

    name_render() {
      if (!this.node.node) {
        return '';
      }

      return md.renderInline(this.node.node.name);
    },

    description_render() {
      if (!this.node) {
        return '';
      }

      return md.render(this.node.node.description);
    },

  },
};
</script>
