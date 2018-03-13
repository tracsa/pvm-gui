<template>
  <div
    class="tasks-container"
    v-bind:class="containerClass">
    <h1>this is a title</h1>
    <div
      class="row">
      <div class="col">
        <div class="card">
          <ul class="list-group">
            <li
              class="list-group-item"
              v-bind:class="{ active: selected === task.id }"
              v-for="task in tasks"
              :key="task.id"
              v-on:click="openTask($event, task)">
              {{ task.title }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="col"
        v-if="selectedTask !== null">
        <div class="card task">
          <div class="card-body">
            <div
              class="task-close"
              v-on:click="closeTask"
            >
              <icon v-on:click="closeTask" :icon="['fas', 'times']" />
            </div>

            <h4>{{ selectedTask.title }}</h4>
            <div class="card-subtitle mb-2 text-muted">task description</div>
            <p class="card-text">task body</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data() {
    return {
      tasks: [
        {
          id: '1',
          title: 'Generar contrato',
          form: [
            { label: '', name: '', value: '', type: '' },
          ],
        },
      ],
      selected: null,
    };
  },
  computed: {
    containerClass: function containerClass() {
      return {
        container: this.selectedTask === null,
        'container-fluid': this.selectedTask !== null,
      };
    },
    selectedTask: function selectedTask() {
      if (this.selected === null) {
        return null;
      }

      let selected = null;
      this.tasks.forEach((task) => {
        if (task.id === this.selected) {
          selected = task;
        }
      });

      return selected;
    },
  },
  methods: {
    openTask: function openTask(event, task) {
      event.preventDefault();

      this.selected = task.id;
    },
    closeTask: function closeTask() {
      this.selected = null;
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border-color: #fff;
  flex: 1;
}

.task {
  position: relative;
}

.task-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
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
</style>
