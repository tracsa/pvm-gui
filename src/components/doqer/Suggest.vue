<template>
  <ul class="suggestions">
    <li
      v-for="suggestion in suggestions"
      :key="suggestion.value">
      {{ suggestion.label }}
    </li>
  </ul>
</template>

<script>
export default {
  props: ['query'],
  data() {
    return {
      suggestions: [],
    };
  },
  watch: {
    query() {
      this.suggestFiles();
    },
  },
  methods: {
    suggestFiles: function suggestFiles() {
      const suggestions = [];

      this.suggestions = suggestions;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

ul.suggestions {
  padding: 0;
  margin: 0;

  li {
    list-style: none;
    line-height: 25px;
    padding: 6px;
    padding-left: 1em;

    &:first-child {
      background: $purple;
      color: white;
    }
  }
}
</style>
