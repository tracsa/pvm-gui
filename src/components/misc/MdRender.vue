<template>
  <span v-html="mdRender"/>
</template>

<script>
const md = require('markdown-it')();

export default {
  props: {
    rawString: {
      type: String,
      required: true,
    },
  },

  computed: {
    mdRender() {
      return md.renderInline(this.rawString);
    },
  },
};
</script>
