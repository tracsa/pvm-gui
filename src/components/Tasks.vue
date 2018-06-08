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
            <div style="float:right;">
              <a
                href="javascript:void(0);"
                @click="loadList">
                  <icon :icon="['fas', 'sync-alt']" />
              </a>
            </div>
            {{ $t('tasks.my_tasks') }}
          </div>

          <div
            v-if="errors.length"
            class="container-error">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="alert custom-alert-danger">
              {{ $t(`errors.${error.where}`) }}
            </div>
          </div>

          <message-info
            v-if="loading"
            icon="spinner"
            title="commons.loading"
            spin
          />

          <message-info
            v-else-if="tasks.length === 0"
            icon="inbox"
            title="info.aboutTasks"
            desc="info.aboutTasksMore"
          />

          <ul
            v-else
            class="activity-list">
            <li
              :class="{ active: selectedId === task.execution.id }"
              v-for="task in tasks"
              :key="task.execution.id">
              <router-link
                :to="{
                  name: 'task',
                  params: { id: task.id },
                }">
                <div class="activity-name">
                  {{ task.execution.name }} — {{ task.name }}
                </div>
                <div class="activity-caret">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="selectedId" class="col-12 col-md-8">
        <task :taskId="selectedId" />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils/api';

export default {
  data() {
    return {
      tasks: [],
      timeline: [],
      loading: true,
      errors: [],
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList() {
      this.loading = true;
      this.errors = [];

      get('/task')
        .then((body) => {
          this.loading = false;
          this.tasks = body.data;
        })
        .catch((errors) => {
          this.loading = false;
          this.errors = errors;
        });
    },
  },
  computed: {
    selectedId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
    containerClass() {
      return {
        container: this.selectedId === null,
        'container-fluid': this.selectedId !== null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/helpers.scss';

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}

.container-error {
  padding: 30px;
  padding-bottom: 0;
}
</style>
