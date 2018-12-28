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
  <div v-else>{{ input.value_caption }}</div>
</template>

<script>
export default {
  props: ['input'],
  filters: {
    toURI(input) {
      return `${process.env.DOQER_URL}/api/documents/${input.value.id}`;
    },
  },
};
</script>
