<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            {{ $t('activities.my_activities') }}
          </div>
          <ul class="activity-list">
            <li
              :class="{ active: selectedId === activity.execution.id }"
              v-for="activity in activities"
              :key="activity.execution.id">
              <router-link
                :to="{
                  name: 'timeline',
                  params: { id: activity.execution.id },
                }">
                <div class="activity-name">
                  {{ activity.execution.id }}
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
        <timeline :model="selected" />
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
      activities: [],
      loading: true,
    };
  },
  mounted() {
    const self = this;

    get('/activity')
      .then((body) => {
        self.loading = false;
        self.activities = body.data;
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

      return id;
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
}

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}
</style>
