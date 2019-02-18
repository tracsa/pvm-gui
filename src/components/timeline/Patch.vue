<template>
  <div class="timeline-action">
    <span class="timeline-dot dot-red" />

    <div class="alert custom-alert-danger">
      <div>{{ patch.comment }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['patch'],
};
</script>
