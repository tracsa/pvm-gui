<template>
  <div :id="validation.id" class="timeline-action" :class="{'highlight': highlight}">
    <span
      class="timeline-dot"
      :class="{ 'dot-green': state, 'dot-red': !state }" />

    <b-card
      :border-variant="state ? 'success' : 'danger'"
      :header-bg-variant="state ? 'success-light' : 'danger-light'"
      no-body>
      <template v-slot:header>
        <div class="d-flex justify-content-between align-items-center">

          <div class="float-left">
            <span v-if="validation.node.name" v-html="name_render" />
            &bull;
            <small>{{ validation.finished_at | relativeDate }}</small>
            <br>

            <small>
              <span
                v-for="(actor, identifier) in validation.actors.items"
                :key="identifier"
              >
                <icon :icon="['fa', 'user']"/>
                <b>{{ actor.user.fullname }}</b><br/>
              </span>
            </small>
            <div>
              <span
                class="badge badge-primary"
                :class="{ 'badge-success': state, 'badge-danger': !state }">
                {{ state ? 'Aprobado' : 'Rechazado' }}
              </span>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <div
              class="w-auto"
              :id="validation.id + '-assigness'"
            >
              {{ validation.notified_users.length }}
              <icon :icon="['fa', 'users']"/>
            </div>

            <b-popover
              v-if="validation.notified_users.length"
              :target="validation.id + '-assigness'"
              triggers="hover focus"
              placement="leftbottom">
              <template v-slot:title>{{ $t('inbox.assigned_to') }}</template>
              <div>
                <div
                  v-for="assignee in validation.notified_users"
                  :key="assignee.id">
                  <strong>{{ assignee.fullname }}</strong><br/>
                  <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
                </div>
              </div>
            </b-popover>

            <a class="btn"
              @click="toggleCollapse"
            >
              <icon
                class="toggle"
                :icon="collapseClassName"
              />
            </a>
          </div>
        </div>
      </template>

      <b-card-body v-if="!collapse && commentArray.length > 0 ">
        <template
          v-for="item in commentArray"
        >
          <b-card
            no-body
            :key="item.identifier"
          >
            <b-card-body>
              <blockquote class="blockquote mb-0">
                <p>{{ item.comment }}</p>

                <footer class="blockquote-footer">
                  {{ item.fullname }}
                </footer>
              </blockquote>
            </b-card-body>
          </b-card>

        </template>
      </b-card-body>

      <b-card-body v-else-if="!collapse">
        <b-card-text class="text-center">
          No hay información que mostrar.
        </b-card-text>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: ['validation', 'highlight'],
  data() {
    return {
      collapse: true,
    };
  },
  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    getComment(actor) {
      const comment = actor.forms[0].inputs.items.comment.value;
      if (!comment || comment.length === 0 || !comment.trim()) {
        return null;
      }

      return comment;
    },
  },
  computed: {
    state() {
      let state = true;
      Object.values(this.validation.actors.items).forEach((actor) => {
        for (let i = 0; i < actor.forms.length; i += 1) {
          const inputs = actor.forms[i].inputs.items;
          state = state && inputs.response.value === 'accept';
        }
      });

      return state;
    },

    collapseClassName() {
      const response = ['fas'];
      if (this.collapse) {
        response.push('chevron-left');
      } else {
        response.push('chevron-down');
      }

      return response;
    },
    name_render() {
      if (!this.validation.node) {
        return '';
      }

      return md.renderInline(this.validation.node.name);
    },
    commentArray() {
      const comArr = [];
      const vm = this;
      Object.values(vm.validation.actors.items).forEach((actor) => {
        const com = vm.getComment(actor);
        const name = actor.user.fullname;
        const id = actor.user.identifier;

        if (com) {
          comArr.push({ comment: com, fullname: name, identifier: id });
        }
      });

      return comArr;
    },
  },
  filters: {
    relativeDate(val) {
      return moment(val).format('LLLL');
    },
  },
};
</script>
