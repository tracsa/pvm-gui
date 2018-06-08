<template>
  <div class="card-body card-message">
    <div class="icon">
      <icon
        :icon="['fas',  `${icon}`]"
        :spin="spin"
      />
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
  props: [
    'icon',
    'title',
    'desc',
    'spin',
  ],
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/helpers.scss';
</style>
