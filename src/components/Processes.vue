<template>
  <div
    class="tasks-container"
    :class="containerClass">
    <div
      class="row">
      <div class="col">
        <div class="card">
          <div class="tasks-header">
            Processes
          </div>
          <ul class="activity-list">
            <li
              :class="{ active: selectedId === process.id }"
              v-for="process in processes"
              :key="process.id">
              <router-link
                :to="{
                  name: 'process',
                  params: { id: process.id },
                }">
                <div class="activity-name">
                  {{ process.name }}
                </div>
                <div class="activity-caret">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="selected" class="col col-8">
        <activity :model="selected" />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils/api';

export default {
  data() {
    return {
      processes: [],
      loading: true,
    };
  },
  mounted() {
    const self = this;

    get('/process')
      .then((body) => {
        self.loading = false;
        self.processes = body.data;
      })
      .catch((errors) => {
        self.loading = false;
        // Alert about this
        console.error(errors);
      });
  },
  computed: {
    selectedId: function selectedId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
    selected: function selected() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return this.processes
        .filter(p => p.id === id)
        .reduce((a, p) => (a || p), null);
    },
    containerClass: function containerClass() {
      return {
        container: this.selectedId === null,
        'container-fluid': this.selectedId !== null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border: 1px solid rgba(0, 0, 0, 0.125);
  flex: 1;
  overflow: hidden;
}

.tasks-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}

.tasks-header {
  border-bottom: 1px solid white;
  box-shadow: 0 5px 5px rgba(0,0,0,0.25);
  padding: 10px 30px;
  z-index: 1;
}
</style>
