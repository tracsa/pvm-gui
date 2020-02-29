<template>
  <div class="timeline-action">
    <span class="timeline-dot dot-red" />

    <div class="alert custom-alert-danger">
      <div v-html="comment_render"></div>
    </div>
  </div>
</template>

<script>
const md = require('markdown-it')();

export default {
  props: ['patch'],
  computed: {
    comment_render() {
      if (!this.patch) {
        return '';
      }

      return md.renderInline(this.patch.comment);
    },
  },
};
</script>
