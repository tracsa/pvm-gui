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
