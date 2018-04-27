<template>
    <div class="card">
      <div class="card-body card-message">
        <div class="icon">
          <icon :icon="['fas', 'sync-alt']" />
        </div>
        <span>
          {{ $t('commons.loading') }}
        </span>
      </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border: 1px solid rgba(0, 0, 0, 0.125);
  flex: 1;

  .card-message {
    text-align: center;

    .icon {
      color: $purple;
      font-size: 70px;
    }

    span {
      display: block;
      font-size: 20px;
      font-weight: 500;
      padding-bottom: 10px;
    }

    small {
      font-size: 13px;
      color: $gray-700;
      font-weight: lighter;
    }
  }

}

</style>
