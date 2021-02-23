<template>
  <timeline-item-base
    :pointer="pointer"
    :extended="extended"
    :verbose="verbose"
  >
    <template v-slot:content>
      <b-container fluid
        v-if="actors.length"
      >
        <hr/>
        <b-row no-gutters>
          <b-col>
            <span
              class="badge badge-primary"
              :class="{ 'badge-success': state, 'badge-danger': !state }">
              <span
                v-if="state">{{ $t('timeline.validation.valid') }}</span>
              <span
                v-else>{{ $t('timeline.validation.invalid') }}</span>
            </span>
          </b-col>
        </b-row>

        <b-row no-gutters class="mt-3">
          <b-col cols="12">
            <b-collapse :id="collapseId" v-model="visible">
              <template
                v-if="commentArray.length > 0"
              >
                <b-card
                  no-body
                  v-for="item in commentArray"
                  :key="item.identifier"
                  class="mt-2"
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

              <template
                v-else
              >
                <b-card-text
                  class="mt-2 text-center"
                >
                  No hay información que mostrar.
                </b-card-text>
              </template>
            </b-collapse>

            <div class="w-100 text-center">
              <a
                v-b-toggle="collapseId"
                href="#"
                v-on:click.prevent
              >
                <span v-if="!visible">
                  <icon :icon="['fas', 'caret-down']"/>
                  Mostrar detalle</span>
                <span v-else>
                  <icon :icon="['fas', 'caret-up']"/>
                  Ocultar detalle</span>
              </a>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </timeline-item-base>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    pointer: Object,
    extended: {
      type: Boolean,
      default: false,
    },
    verbose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      uuid: Math.random(),
      visible: false,
    };
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },

    actors() {
      const vm = this;

      if (vm.pointer.actors.items) {
        const actorsList = [];

        Object.values(vm.pointer.actors.items).forEach((item) => {
          actorsList.push({
            identifier: item.user.identifier,
            fullname: item.user.fullname,
          });
        });
        return actorsList;
      }

      return [];
    },

    state() {
      let state = true;
      Object.values(this.pointer.actors.items).forEach((actor) => {
        for (let i = 0; i < actor.forms.length; i += 1) {
          const inputs = actor.forms[i].inputs.items;
          state = state && inputs.response.value === 'accept';
        }
      });

      return state;
    },

    commentArray() {
      const comArr = [];
      const vm = this;
      Object.values(vm.pointer.actors.items).forEach((actor) => {
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

  methods: {
    getComment(actor) {
      const comment = actor.forms[0].inputs.items.comment.value;
      if (!comment || comment.length === 0 || !comment.trim()) {
        return null;
      }

      return comment;
    },
  },
};
</script>
