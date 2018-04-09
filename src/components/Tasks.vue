<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            {{ $t('tasks.my_tasks') }}
          </div>
          <ul class="activity-list">
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

      <div v-if="selectedId" class="col-8">
        <task :taskId="selectedId" />
      </div>

    </div>
  </div>
</template>
`
<script>
import { get } from '@/utils/api';

export default {
  props: ['model'],
  data() {
    return {
      tasks: [],
      timeline: [],
      loading: true,
    };
  },
  mounted() {
    const self = this;

    get('/task')
      .then((body) => {
        self.loading = false;
        self.tasks = body.data;
        // return body.data.execution.id;
      })
      // .then((execution_id) => {
      //   get(`/log/${execution_id}`).then((body) => {
      //     self.timeline = body;
      //     console.log(body);
      //   })
      //   .catch((errors) => {
      //     self.loading = false;
      //     // Alert about this
      //     console.error(errors);
      //   });
      // })
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
