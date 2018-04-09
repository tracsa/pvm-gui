<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div 
        :class="{ 'd-none d-md-block': selectedId }"
        class="col">
        <div class="card">
          <div class="card-header">
            {{ $t('processes.processes')}}
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

      <div v-if="selected" class="col-12 col-md-8">
        <activity :model="selected" />
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

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}
</style>
