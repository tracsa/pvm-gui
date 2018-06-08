<template>
  <div class="hero">
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
