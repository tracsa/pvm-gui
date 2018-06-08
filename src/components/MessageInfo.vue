<template>
  <div
    v-if="show"
    class="card-body card-message">
    <div class="icon">
      <icon :icon="['fas',  `${icon}`]" />
    </div>
    <span>
      {{ $t(title) }}
    </span>
    <small>
      {{ $t(desc) }}
    </small>
  </div>
</template>

<script>
export default {
  props: ['show', 'icon', 'title', 'desc'],
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/helpers.scss';
</style>
