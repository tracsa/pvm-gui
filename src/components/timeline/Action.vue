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
                            >{{ input.label|upper }}</small><br/>

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
      return (input.value === null || input.value_caption === '');
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
