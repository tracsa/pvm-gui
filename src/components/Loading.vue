<template>
  <div class="card">
    <div class="card-body card-message">
      <div class="icon">
        <icon :icon="['fas', 'spinner']" spin />
      </div>
      <span>
        {{ $t('commons.loading') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/helpers.scss';
</style>
