<template>
  <div class="timeline-action">
    <span class="timeline-dot dot-red" />

    <b-card
      border-variant="danger"
      :header-bg-variant="headerBackgroundVariant"
      no-body>
      <template v-slot:header>
        <div class="d-flex justify-content-between align-items-center">

          <div class="float-left">
            <span>Invalidación de información</span>
            <br>

            <small>
              <span
                v-for="actor in actors"
                :key="actor.user.identifier"
              >
                <span
                  v-if="isTestUser(actor.user.identifier)"
                  :id="node.id + '-user-' + actor.user.identifier"
                >
                  <icon :icon="['fas', 'exclamation-triangle']"/>
                  <b>{{ actor.user.fullname }}</b><br/>

                  <b-popover
                    :target="node.id + '-user-' + actor.user.identifier"
                    triggers="hover focus"
                    placement="leftbottom">
                    <template v-slot:title>
                      <icon :icon="['fas', 'exclamation-triangle']"/>
                      {{ $t('commons.testUsers.title') }}
                    </template>
                    {{ $t('commons.testUsers.description') }}<br/>
                    {{ $t('commons.testUsers.contact') }}<br/>
                    <span
                      v-for="(user, index) in keyUsers"
                      v-bind:key="index"
                    >
                      <strong>{{ user.name }}</strong><br/>
                      <a :href="'mailto:' + user.email">{{ user.email }}</a><br/>
                    </span>
                  </b-popover>

                </span>
                <span
                  v-else
                >
                  <icon :icon="['fa', 'user']"/>
                  <b>{{ actor.user.fullname }}</b><br/>
                </span>
              </span>
            </small>
            <div>
              <span
                class="badge badge-primary badge-info"
              >Invalidación
              </span>
            </div>
          </div>

          <div class="d-flex align-items-center">
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

      <b-card-body v-if="!collapse">
        <b-card
          no-body>

          <b-card-body>
            <b-card-title>
              <p v-html="comment_render"></p>
            </b-card-title>
            <b-list-group flush>
              <b-list-group-item>
                <b-container fluid>
                  <b-row class="d-flex justify-content-between align-items-center">
                    <template
                      v-for="(input, it) in inputs"
                    >
                      <b-col
                        :key="it"
                        cols="12"
                        class="px-4 pb-1"
                      >
                        <div
                          class="border-left pl-1"
                          :class="[emptyValue(input) ? 'border-warning' : 'border-info']">
                          <small
                            :class="{ 'text-muted': emptyValue(input)}"
                          >{{ input.label }}</small><br/>

                          <p
                            :class="{ 'text-muted': emptyValue(input) }"
                          ><value-render :input="input"/><br/></p>
                        </div>
                      </b-col>
                    </template>
                  </b-row>
                </b-container>
              </b-list-group-item>
            </b-list-group>
          </b-card-body>
        </b-card>

      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: ['node', 'state'],

  data() {
    return {
      collapse: true,
      testIds: process.env.TEST_IDS,
      keyUsers: process.env.KEY_USERS,
    };
  },

  computed: {
    comment_render() {
      if (!this.node.patch) {
        return '';
      }

      return md.renderInline(this.node.patch.comment);
    },

    formatedPatch() {
      const vm = this;
      const obj = {};

      obj.inputs = [];
      vm.node.patch.inputs.forEach((input) => {
        const keys = input.ref.split('.');
        const formData = keys[2].split(':');

        obj.inputs.push({
          nodeRef: keys[0],
          actorId: keys[1],
          formIndex: parseInt(formData[0], 10),
          formRef: formData[1],
          inputRef: keys[3],
          value: input.value,
          valueCaption: input.value_caption,
        });
      });

      return obj;
    },

    actors() {
      const vm = this;

      const res = [];
      vm.formatedPatch.inputs.forEach((input) => {
        const actor = vm.state
          .items[input.nodeRef].actors
          .items[input.actorId];

        if (!res.includes(actor)) {
          res.push(actor);
        }
      });

      return res;
    },

    inputs() {
      const vm = this;

      const res = [];
      vm.formatedPatch.inputs.forEach((input) => {
        const form = vm.state
          .items[input.nodeRef].actors
          .items[input.actorId].forms[input.formIndex];

        const obj = form.inputs
          .items[input.inputRef];

        const hidden = (obj.hidden === true);
        if (
          (input.formRef === form.ref) && !hidden
        ) {
          const inp = Object.assign({}, obj);

          inp.value = input.value;
          inp.value_caption = input.valueCaption;
          res.push(inp);
        }
      });

      return res;
    },

    hasTestUser() {
      const vm = this;

      let testUser = false;
      vm.actors.forEach((actor) => {
        testUser = testUser || vm.testIds.includes(actor.user.identifier);
      });

      return testUser;
    },

    headerBackgroundVariant() {
      if (this.hasTestUser) {
        return 'warning-light';
      }

      return 'danger-light';
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
  },

  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },

    emptyValue(input) {
      if (!input.value) return true;

      return (input.value === null || input.value_caption === '');
    },

    isTestUser(actor) {
      return (this.testIds).includes(actor);
    },
  },

  filters: {
    relativeDate(val) {
      return moment(val).format('LLLL');
    },
  },
};
</script>
