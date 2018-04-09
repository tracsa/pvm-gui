<template>
  <div class="card timeline-action">
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
        v-for="actor in action.actors">
        <div v-if="actor">
          <p>
            <b>{{ actor.user.human_name || actor.user.identifier }}</b> llenó la siguiente información
          </p>
          <div v-for="form in actor.forms" :key="form.ref">
            <small>#{{ form.ref }}</small>
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="input in form.form">
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
  </div>
</template>

<script>
import moment from 'moment';
import settings from '@/settings';


export default {
  props: ['action'],
  filters: {
    toURI: function toUri(input) {
      const { protocol, host, port } = settings.doqer;
      const { value } = input;

      return `${protocol}://${host}:${port}/api/documents/${input.value.id}`;
    },
    formInput: function formInput(data) {
      let value;
      switch (data.type) {
        case 'select':
        case 'radio':
          value = data.options
            .filter(option => option.value == data.value)
            .map(option => option.label)
            .join('');
          break;
        case 'checkbox':
          const mapping = data.options.reduce((map, option) => map.set(option.value, option.label), new Map());
          value = data.value.map(val => mapping.get(val)).join(', ');
          break;
        case 'datetime':
          value = moment(data.value).format('DD/HH/YYYY HH:mm');
          break;
        default:
          value = data.value
          break;
      }

      return value;
    },
    setMoment: function setMoment(data, from) {
      const oldData = data;
      let newDate = new Date(data);
      if(from === 'From now') newDate = moment().startOf('hour').fromNow();
      else if (from === 'Complete') newDate = moment().format('MMMM Do YYYY, h:mm:ss a');
      else newDate = moment(newDate).format('DD/MM/YYYY HH:mm');
      if(newDate !== 'Invalid date') return newDate;
      else return oldData;
    },
  },
}
</script>
