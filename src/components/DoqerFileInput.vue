<template>
  <div
    class="doqer-file --above"
    :class="{ open: suggestions.length }"
    >
    <input
      class="query-input form-control"
      type="text"
      v-model="query"
    />
    <div
      class="suggestions"
      v-if="suggestions.length">
      <ul>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.value">
          {{ suggestion.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      suggestions: []
    };
  },
  watch: {
    query: function queryWatcher(newQuery, oldQuery) {
      this.suggestFiles();
    }
  },
  methods: {
    suggestFiles: function suggestFiles() {
      let suggestions = [];
      const results = Math.floor(Math.random() * 10);
      for (let i = 0; i <= results; i += 1) {
        suggestions.push({
          label: Math.floor(Math.random() * 100),
          value: i,
        });
      }

      this.suggestions = suggestions;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

$input-height: 38px;

.doqer-file {
  position: relative;

  &.open input {
  }

  &.--bellow {
    input.query-input {
      border-radius: $border-radius $border-radius 0 0;
    }

    .suggestions {
      border-top-width: 0px;
      border-radius: 0 0 $border-radius $border-radius;
    }
  }

  &.--above {
    input.query-input {
      border-radius: 0 0 $border-radius $border-radius;
    }

    .suggestions {
      bottom: $input-height;
      border-bottom-width: 0px;
      border-radius: $border-radius $border-radius 0 0;
    }
  }
}

.suggestions {
  position: absolute;
  z-index: 1;
  background: white;
  border: 1px solid $input-focus-border-color;
  width: 100%;

  ul {
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
}
</style>
