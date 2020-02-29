<template>
  <div :id="action.id" class="timeline-action" :class="{'highlight': highlight}">
    <span class="timeline-dot" />

    <div class="card">
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
          <span v-if="action.node.name" v-html="name_render" />
          &bull;
          <small>{{ action.finished_at | relativeDate }}</small>
        </div>
      </div>
      <div class="card-body" v-if="!collapse">
        <div
          v-for="(actor, identifier) in action.actors.items"
          :key="identifier">
          <div v-if="actor">
            <p>
              <b>{{ actor.user.fullname }}</b>
              llenó la siguiente información
            </p>
            <table class="table table-sm table-bordered">
              <tbody
                v-for="(form, key) in actor.forms"
                :key="key">
                <tr class="form-group">
                  <td
                    :title="`#${form.ref}`"
                    :rowspan="form.inputs.item_order.length + 1">
                  </td>
                </tr>
                <tr
                  v-for="input in listInputs(form.inputs)"
                  :key="input.name">
                  <td scope="row">{{ input.label }}</td>
                  <td><value-render :input="input" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
