<template>
  <input
    class="form-control"
    :value="value.href"
    @change="onChange"
  />
</template>

<script>
export default {
  props: ['value'],
  methods: {
    onChange: function onChange(event) {
      const url = event.target.value;

      this.$emit('change', {
        label: url,
        href: url,
      });
    },
  },
};
</script>
