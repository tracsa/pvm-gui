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
        <b-row no-gutters class="mt-3">
          <b-col cols="12">
            <b-collapse :id="collapseId" v-model="visible">
              <b-row no-gutters class="mt-2">
                <b-col
                  cols="12"
                  v-for="(actor, identifier) in pointer.actors.items"
                  :key="identifier"
                >
                  <b-card
                    no-body
                    :key="identifier">
                    <b-card-body>
                      <b-card-title>
                        <span>{{ actor.user.fullname }}</span>
                        <small class="text-muted">llenó la siguiente informacion</small>
                      </b-card-title>

                      <b-list-group flush>
                        <b-list-group-item
                          v-for="(form, key) in actor.forms"
                          :key="key"
                        >
                          <b-container fluid>
                            <b-row class="d-flex justify-content-between align-items-center">
                              <template
                                v-for="(input, it) in listInputs(form.inputs)"
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
                </b-col>
              </b-row>
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

      <b-container fluid
        v-if="pointer.state === 'cancelled'"
      >
        <hr/>

        <b-row no-gutters>
          <b-col>
            Cancelada
          </b-col>
        </b-row>

        <b-row no-gutters
          v-if="pointer.finished_at"
        >
          <b-col>
            <small
              class="text-muted"
              :title="pointer.finished_at|fmtDate('LLLL')"
            >Cancelada el {{ pointer.finished_at|fmtDate('lll') }}</small>
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
  },

  methods: {
    listInputs(inputs) {
      return inputs.item_order
        .map(key => inputs.items[key])
        .filter(input => !input.hidden);
    },

    emptyValue(input) {
      if (!input.value) return true;

      return (input.value === null || input.value_caption === '');
    },
  },
};
</script>
