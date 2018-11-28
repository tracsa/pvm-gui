<template>
  <div class="timeline-action">
    <span class="timeline-dot" />

    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col">
            {{ action.node.name }}
            —
            <small>{{ action.finished_at | setMoment('From now') }}</small>
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
    setMoment(data, from) {
      const oldData = data;
      let newDate = new Date(data);

      if (from === 'From now') {
        newDate = moment(newDate).fromNow();
      } else if (from === 'Complete') {
        newDate = moment(newDate).format('MMMM Do YYYY, h:mm:ss a');
      } else {
        newDate = moment(newDate).format('DD/MM/YYYY HH:mm');
      }

      let output = null;
      if (newDate !== 'Invalid date') {
        output = newDate;
      } else {
        output = oldData;
      }

      return output;
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
