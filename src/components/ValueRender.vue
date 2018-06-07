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
  <div v-else>{{ input.value_caption }}</div>
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
  },
};
</script>
