<template>
  <div v-if="input.type === 'file'">
    <a
      v-if="input.value"
      target="_blank"
      :href="input | toURI">
      <icon :icon="['fa', 'file']" />
      {{ input.value.name }}
    </a>
  </div>
  <div v-else>{{ input | formInput }}</div>
</template>

<script>
import moment from 'moment';
import settings from '@/settings';

export default {
  props: ['input'],
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
  },
}
</script>
