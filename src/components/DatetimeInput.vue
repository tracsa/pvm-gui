<template>
  <div class="row">
    <div class="col">
      <date-input
        :bootstrap-styling="true"
        v-model="date"
      />
    </div>
    <div class="col">
      <time-input
        :value="date"
        @change="datetime => date = datetime"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    date: {
      get: function getDate() {
        return this.value;
      },
      set: function setDate(date) {
        this.$emit('change', date);
      },
    },
  },
};
</script>
