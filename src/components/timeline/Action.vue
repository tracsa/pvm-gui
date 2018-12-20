<template>
  <div class="timeline-action">
    <span class="timeline-dot" />

    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col">
            {{ action.node.name }}
            —
            <small>{{ action.finished_at | relativeDate }}</small>
          </div>
        </div>
      </div>
      <div class="card-body">
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

export default {
  props: ['action'],
  methods: {
    listInputs(inputs) {
      return inputs.item_order
        .map(key => inputs.items[key])
        .filter(input => !input.hidden);
    },
  },
  filters: {
    relativeDate(val) {
      const date = new Date(val);
      const yesterday = new Date() - (24 * 60 * 60 * 1000);

      if (yesterday < date) {
        return moment(val).fromNow();
      }

      return moment(val).calendar();
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
</style>
