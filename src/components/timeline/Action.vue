<template>
  <div :id="action.id" class="timeline-action" :class="{'highlight': highlight}">
    <span class="timeline-dot" />

    <b-card
      :header-bg-variant="headerBackgroundVariant"
      no-body>
      <template v-slot:header>
        <div class="d-flex justify-content-between align-items-center">

          <div class="float-left">
            <span v-if="action.node.name" v-html="name_render" />
            &bull;
            <small>{{ action.finished_at | relativeDate }}</small>
            <br/>

            <small>
              <span
                v-for="(actor, identifier) in action.actors.items"
                :key="identifier"
              >
                <span
                  v-if="isTestUser(identifier)"
                  :id="action.id + '-user-' + identifier"
                >
                  <icon :icon="['fas', 'exclamation-triangle']"/>
                  <b>{{ actor.user.fullname }}</b><br/>

                  <b-popover
                    :target="action.id + '-user-' + identifier"
                    triggers="hover focus"
                    placement="leftbottom">
                    <template v-slot:title>
                      <icon :icon="['fas', 'exclamation-triangle']"/>
                      Usuario de pruebas
                    </template>
                    Este es un usuario designado
                    para hacer pruebas en el sistema.<br/>
                    Si esta fue una tarea realizada en un proceso real,
                    por favor, contacte al administrador.
                  </b-popover>

                </span>
                <span
                  v-else
                >
                  <icon :icon="['fa', 'user']"/>
                  <b>{{ actor.user.fullname }}</b><br/>
                </span>
              </span>
            </small>
          </div>

          <div class="d-flex align-items-center">
            <div
              class="w-auto"
              :id="action.id + '-assigness'"
            >
              {{ action.notified_users.length }}
              <icon :icon="['fa', 'users']"/>
            </div>

            <b-popover
              v-if="action.notified_users.length"
              :target="action.id + '-assigness'"
              triggers="hover focus"
              placement="leftbottom">
              <template v-slot:title>{{ $t('inbox.assigned_to') }}</template>
              <div>
                <div
                  v-for="assignee in action.notified_users"
                  :key="assignee.id">
                  <strong>{{ assignee.fullname }}</strong><br/>
                  <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
                </div>
              </div>
            </b-popover>

            <a class="btn"
              @click="toggleCollapse"
            >
              <icon
                class="toggle"
                :icon="collapseClassName"
              />
            </a>
          </div>
        </div>
      </template>

      <b-card-body v-if="!collapse">
        <template
          v-for="(actor, identifier) in action.actors.items"
        >
          <b-card
            no-body
            :key="identifier">
            <b-card-body>
              <b-card-title>
                {{ actor.user.fullname }}
              <small class="text-muted">llenó la siguiente informacion</small>
              </b-card-title>

              <b-list-group flush>
                <b-list-group-item
                  v-for="(form, key) in actor.forms"
                  :key="key"
                >
                  <b-container fluid>
                    <b-row class="d-flex justify-content-between align-items-center">
                      <template
                        v-for="(input, it) in listInputs(form.inputs)"
                      >
                        <b-col
                          :key="it"
                          cols="12"
                          class="px-4 pb-1"
                        >
                          <div
                            class="border-left pl-1"
                            :class="[emptyValue(input) ? 'border-warning' : 'border-info']">
                            <small
                              :class="{ 'text-muted': emptyValue(input)}"
                            >{{ input.label }}</small><br/>

                            <p
                              :class="{ 'text-muted': emptyValue(input) }"
                            ><value-render :input="input"/><br/></p>
                          </div>
                        </b-col>
                      </template>
                    </b-row>
                  </b-container>

                </b-list-group-item>
              </b-list-group>
            </b-card-body>
          </b-card>
        </template>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: ['action', 'highlight'],
  data() {
    return {
      collapse: true,
      testUsers: process.env.TEST_USERS,
    };
  },
  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    listInputs(inputs) {
      return inputs.item_order
        .map(key => inputs.items[key])
        .filter(input => !input.hidden);
    },
    emptyValue(input) {
      if (!input.value) return true;

      return (input.value === null || input.value_caption === '');
    },
    isTestUser(actor) {
      return (this.testUsers).includes(actor);
    },
  },
  computed: {
    hasTestUser() {
      const vm = this;

      let testUser = false;
      Object.values(this.action.actors.items).forEach((actor) => {
        testUser = testUser || vm.testUsers.includes(actor.user.identifier);
      });

      return testUser;
    },

    headerBackgroundVariant() {
      if (this.hasTestUser) {
        return 'warning-light';
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
      if (!this.action.node) {
        return '';
      }

      return md.renderInline(this.action.node.name);
    },
  },
  filters: {
    relativeDate(val) {
      return moment(val).format('LLLL');
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  td {
    word-break: break-all;
  }
}

.actions .toggle {
  color: #888;
  cursor: pointer;
}

.actions .toggle:hover {
  color: #333;
}
</style>
