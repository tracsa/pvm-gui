<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div
        v-if="!loading"
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
            v-for="error in errors"
            class="alert custom-alert-danger">
            {{ $t('error.code') }}
          </div>
          <message-info
            :show="!tasks.length"
            icon="inbox"
            title="info.aboutTasks"
            desc="info.aboutTasksMore"
          />
          <ul
            v-if="tasks.length && !loading"
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
      <div
        v-else
        class="col">
        <loading />
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
    loadList: function loadList() {
      const self = this;

      this.loading = true;
      get('/task')
        .then((body) => {
          self.loading = false;
          self.tasks = body.data;
        })
        .catch((errors) => {
          self.loading = false;
          // Alert about this
          this.errors = errors;
          console.error(this.errors, "Errors");
        });
    },
  },
  computed: {
    selectedId: function selectedId() {
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

  .card-message {
    text-align: center;

    .icon {
      color: $purple;
      font-size: 70px;
    }

    span {
      display: block;
      font-size: 20px;
      font-weight: 500;
      padding-bottom: 10px;
    }

    small {
      font-size: 13px;
      color: $gray-700;
      font-weight: lighter;
    }
  }

}

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}
</style>
