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
    query: function queryWatcher() {
      this.suggestFiles();
    },
  },
  methods: {
    suggestFiles: function suggestFiles() {
      const suggestions = [];
      const results = Math.floor(Math.random() * 10);
      for (let i = 0; i <= results; i += 1) {
        suggestions.push({
          label: Math.floor(Math.random() * 100),
          value: i,
        });
      }

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
