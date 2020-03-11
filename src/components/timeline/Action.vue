<template>
  <div :id="action.id" class="timeline-action" :class="{'highlight': highlight}">
    <span class="timeline-dot" />

    <b-card no-body>
      <template v-slot:header>
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
          <span v-if="action.node.name" v-html="name_render" />
          &bull;
          <small>{{ action.finished_at | relativeDate }}</small>
          <br>

          <small>
            <span
              v-for="(actor, identifier) in action.actors.items"
              :key="identifier"
            >
              <icon :icon="['fa', 'user']"/>
              <b>{{ actor.user.fullname }}</b><br/>
            </span>
          </small>

        </div>
      </template>

      <b-card-body v-if="!collapse">
        <template
          v-for="(actor, identifier) in action.actors.items"
        >
          <b-card no-body>
            <b-card-body>
              <b-card-title>
                {{ actor.user.fullname }}
              </b-card-title>
              <b-card-sub-title>llenó la siguiente informacion</b-card-sub-title>

              <b-list-group flush>
                <b-list-group-item
                  v-for="(form, key) in actor.forms"
                  :key="key"
                >
                  <b-container fluid>
                    <b-row class="d-flex justify-content-between align-items-center">
                      <template
                        v-for="input in listInputs(form.inputs)"
                      >
                        <b-col
                          cols="auto"
                          class="px-4 pb-1"
                        >
                          <div class="border-left border-info pl-1">
                            <small
                              :class="{ 'text-muted': (input.value === null || input.value === '') }"
                            >{{ input.label|upper }}</small><br/>

                            <p
                              v-if="input.value === null || input.value === ''"
                              class="text-muted"
                            >&hellip;</p>
                            <p
                              v-else
                            ><value-render :input="input"/></p>
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
