<template>
  <div
    class="tasks-container"
    :class="containerClass">
    <div
      class="row">
      <div class="col">
        <div class="card">
          <div class="tasks-header">
            <div class="tasks-sync">
              <icon :icon="['fas', 'sync-alt']" />
            </div>
            My tasks
          </div>
          <ul class="tasks-list">
            <li
              class="task-item"
              :class="{ active: selected === task.id }"
              v-for="task in tasks"
              :key="task.id"
              @click="openTask($event, task)">
              <div class="task-left">
                {{ task.title }}
              </div>
              <div class="task-right">
                <span class="task-elapsed">
                  {{ task.elapsed }}
                </span>
                <div class="task-details-icon">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
              </div>
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
              @click="closeTask"
            >
              <icon
                @click="closeTask"
                :icon="['fas', 'times']"
              />
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
  data() {
    return {
      tasks: [
        {
          id: '1',
          title: 'Generar contrato de arrendamiento',
          elapsed: '1h 42m',
          form: [
            { label: '', name: '', value: '', type: '' },
          ],
        },
        {
          id: '2',
          title: 'Aprovar salida de utilitario',
          elapsed: '3m',
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

<style lang="scss" scoped>
@import '../styles/variables.scss';

.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border-color: #fff;
  flex: 1;
  overflow: hidden;
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

.tasks-header {
  border-bottom: 1px solid white;
  box-shadow: 0 3px 2px $gray-300;
  padding: 10px 30px;
  z-index: 1;

  .tasks-sync {
    float: right;
    color: $purple;
  }
}

ul.tasks-list {
  display: flex;
  flex-direction: column;

  padding-left: 0;
  margin-bottom: 0;
}

$task-list-height: 36px;

li.task-item {
  font-size: 13px;

  position: relative;
  display: block;
  padding: 0;
  margin: 0 30px;
  height: $task-list-height;
  display: flex;

  border-bottom: 1px solid $gray-300;

  &.active {
    padding: 0 30px;
    margin: 0;
    border-bottom: none;
    background: $purple;
    color: white;

    .task-right {
      .task-elapsed {
        color: white;
      }

      .task-details-icon {
        right: 0;
        color: white;
      }
    }
  }

  .task-left, .task-right {
    display: flex;
    align-items: center;
  }

  .task-left {
    flex-grow: 1;
  }

  .task-right {
    .task-elapsed {
      color: $gray-500;
      font-size: 0.9em;
    }

    .task-details-icon {
      cursor: pointer;
      color: $gray-500;
      position: absolute;
      right: -30px;
      height: $task-list-height;
      width: 30px;
      line-height: $task-list-height;
      text-align: center;
    }
  }
}
</style>
