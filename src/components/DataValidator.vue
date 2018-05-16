<template>
  <div>
    <pre>{{ JSON.stringify(fields, null, ' ') }}</pre>
  </div>
</template>

<script>
export default {
  props: ['fields', 'sending', 'errors'],
};
</script>
