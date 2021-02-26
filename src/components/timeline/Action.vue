<template>
  <timeline-item-base
    :pointer="pointer"
    :extended="extended"
    :verbose="verbose"
  >
    <template v-slot:content>
      <div class="container-fluid">
        <hr/>

        <div class="row no-gutters mt-3">
          <div class="col">
            <b-collapse :id="collapseId" v-model="visible">
              <div class="container p-0">
                <div class="row no-gutters">
                  <div class="col">
                    <b-form-checkbox
                      class="text-right mb-3"
                      v-model="showEmptyFields"
                      name="check-button"
                      switch
                    >
                      <span>Mostrar campos vacios</span>
                    </b-form-checkbox>

                    <span
                      v-if="listForms.length"
                    >
                      <div
                        class="border-left border-primary pl-2 mb-3"
                        v-for="(form,fIndex) in listForms"
                        v-bind:key="fIndex"
                      >
                        <div>
                          <router-link
                            :to="{
                              name: 'dashboard',
                              params: { identifier: form.actor.identifier },
                            }"
                          >
                            <icon :icon="['fa', 'user']" class="mr-1"/>
                            <b>{{ form.actor.fullname }}</b>
                          </router-link>
                          <span> llenó la siguiente información:</span>
                        </div>

                        <div
                          class="border-left border-secondary pl-2 mb-3"
                          v-for="(input,iIndex) in listInputs(form.inputs)"
                          v-bind:key="iIndex"
                        >
                          <small
                            :class="{ 'text-muted': isEmptyField(input)}"
                          >{{ input.label }}</small><br/>

                          <p
                            :class="{ 'text-muted': isEmptyField(input) }"
                          ><value-render :input="input"/><br/></p>
                        </div>
                      </div>
                    </span>


                    <span v-else>
                      <div class="text-center mb-3">
                        <span>No hay información para mostrar</span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
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
          </div>
        </div>
      </div>
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
      showEmptyFields: true,
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

    listForms() {
      const vm = this;
      return vm.pointer.forms.filter(form => vm.listInputs(form.inputs).length);
    },
  },

  methods: {
    listInputs(inputs) {
      const vm = this;

      return inputs
        .filter(input => !input.hidden)
        .filter(input => vm.showEmptyFields || !vm.isEmptyField(input));
    },

    isEmptyField(input) {
      return (input.value === null || input.value_caption === '');
    },
  },
};
</script>
