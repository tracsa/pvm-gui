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
  <div v-else-if="input.type === 'link'">
    <a
      v-if="input.value"
      target="_blank"
      :href="input.value.href">
      {{ input.value.label }}
    </a>
  </div>
  <div v-else-if="input.type === 'date'">
    {{ input.value | relativeDate }}
  </div>
  <div v-else-if="input.type === 'currency'">
    {{ input.value | currency }}
  </div>
  <div v-else>{{ input.value_caption }}</div>
</template>

<script>
import moment from 'moment';

export default {
  props: ['input'],
  filters: {
    toURI(input) {
      return `${process.env.DOQER_URL}/api/documents/${input.value.id}`;
    },
    relativeDate(val) {
      const date = Date.parse(val);

      if (isNaN(date)) {
        return '';
      }

      const yesterday = new Date() - (24 * 60 * 60 * 1000);
      const tomorrow = new Date() + (24 * 60 * 60 * 1000);

      if (yesterday < date && date < tomorrow) {
        return moment(val).fromNow();
      }

      return moment(val).format('LL');
    },
    currency(val) {
      if (typeof val !== 'number') {
        return val;
      }
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      return formatter.format(val);
    },
  },
};
</script>
