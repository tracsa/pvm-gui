<template>
  <div v-if="!loading" style="flex-grow: 1">
    <div v-if="last !== null" class="text-primary">
      <b>{{ last.execution.name }}</b>
    </div>
    <div class="timeline-container">
      <div class="vertical-line"></div>
      <div class="timeline">
        <timeline-action
          v-for="action in actions"
          :key="action.id"
          :action="action"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils/api';

export default {
  props: ['model'],
  data() {
    return {
      loading: true,
      actions: [],
      timeline: null,
    };
  },
  mounted() {
    const id = this.model;
    this.loadData(id);
  },
  watch: {
    model(newValue) {
      this.loadData(newValue.id);
    },
  },
  computed: {
    last: function last() {
      if (this.actions.length === 0) {
        return null;
      }

      return this.actions[0];
    }
  },
  methods: {
    loadData: function loadData(id) {
      get(`/log/${id}`)
        .then((body) => {
          this.actions = body.data;
          this.timeline = body.data[0];
          this.loading = false;
        })
        .catch((errors) => {
          this.loading = false;
          console.error(errors);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.timeline-container {
  display: flex;
  height: 100%;

  .vertical-line {
    background: lighten($purple, 30);
    height: 100%;
    width: $line-width;
  }

  .timeline {
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>
