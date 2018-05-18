<template>
  <div v-if="action.node.type === 'validation'" class="card timeline-action">
    <span
      class="timeline-dot"
      :title="action.finished_at | setMoment('Complete')">
    </span>
    <div class="card-body">
      <div
        v-for="(actor, identifier) in action.actors.items"
        :key="identifier">
        {{ actor | validationShortcut('fullname') }}
        {{ actor | validationShortcut('response') }}
        <p>{{ actor | validationShortcut('comment') }}</p>
      </div>
    </div>
  </div>

  <div v-else-if="action.finished_at !== null" class="card timeline-action">
    <span
      class="timeline-dot"
      :title="action.finished_at | setMoment('Complete')">
    </span>
    <div class="card-header">
      <div class="row">
        <div class="col">
          {{ action.node.name }} —
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

  <div
    v-else-if="action.notified_users && action.notified_users.length && actualScene !== 'task'">
    <div class="alert custom-alert-warning" style="margin-left: 30px">
      <div>{{ action.node.name }}</div>
      <div>
        <small>Asignado a </small>
        <small
          style="font-weight: bold;"
          v-for="user in action.notified_users"
          :key="user.id">
          {{ user.fullname }}&nbsp;
        </small>
      </div>
    </div>
  </div>

  <div
    v-else-if="actualScene === 'task' && action.notified_users.length > 1"
    class="card leyend-text">
    <div class="card-body">
      <small>{{ $t('timeline.asignTasks') }}</small>
      <b
        v-for="iuser in action.notified_users"
        v-if="iuser.identifier !== user.identifier"
        :key="iuser.id">
        {{ iuser.fullname }}&nbsp;
      </b>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import settings from '@/settings';
import { getAuthUser } from '../utils/auth';

moment.locale('es');

export default {
  props: ['action'],
  data() {
    const user = getAuthUser();

    return {
      user,
      actualScene: this.$router.history.current.name,
    };
  },
  filters: {
    toURI: function toUri(input) {
      const { protocol, host, port } = settings.doqer;
      const { value } = input;

      return `${protocol}://${host}:${port}/api/documents/${value.id}`;
    },
    formInput: function formInput(data) {
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
    setMoment: function setMoment(data, from) {
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
    validationShortcut(data, key) {
      let response;
      switch (key) {
        case 'fullname':
          response = data.user.fullname;
          break;
        case 'response':
          response = data.forms[0].inputs.items.response.value;
          break;
        case 'comment':
          response = data.forms[0].inputs.items.comment.value;
          break;
        default:
          response = '';
          break;
      }

      return response;
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
