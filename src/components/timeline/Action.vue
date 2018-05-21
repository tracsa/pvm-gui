<template>
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
                v-for="input in form.inputs.item_order.map(key => form.inputs.items[key])"
                :key="input.name">
                <td scope="row">{{ input.label }}</td>
                <td v-if="input.type === 'file'">
                  <a
                    v-if="input.value !== null"
                    target="_blank"
                    :href="input | toURI">
                    <icon :icon="['fa', 'file']" />
                    {{ input.value.name }}
                  </a>
                </td>
                <td v-else>{{ input | formInput }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import settings from '@/settings';


export default {
  props: ['action'],
  filters: {
    toURI(input) {
      const { protocol, host, port } = settings.doqer;
      const { value } = input;

      return `${protocol}://${host}:${port}/api/documents/${value.id}`;
    },
    formInput(data) {
      let value;
      let mapping;

      switch (data.type) {
        case 'select':
        case 'radio':
          value = data.options
            .filter(option => option.value === data.value)
            .map(option => option.label)
            .join('');
          break;
        case 'checkbox':
          mapping = data.options
            .reduce((map, option) => map.set(option.value, option.label), new Map());
          value = data.value.map(val => mapping.get(val)).join(', ');
          break;
        case 'date':
          value = moment(data.value).format('DD/HH/YYYY');
          break;
        case 'datetime':
          value = moment(data.value).format('DD/HH/YYYY HH:mm');
          break;
        default:
          value = data.value;
          break;
      }

      return value;
    },
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
.leyend-text {
  margin-left: 30px;
  margin-bottom: 15px;

  small {
    font-size: 15px;
  }

  b {
    font-size: 15px;
  }
}

table {
  td {
    word-break: break-all;
  }
}
</style>
