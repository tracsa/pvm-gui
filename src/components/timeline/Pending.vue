<template>
  <timeline-item-base
    :pointer="pointer"
    :extended="extended"
    :verbose="verbose"
  >
    <template v-slot:content>
      <div class="container-fluid"
        v-if="isDoableByUser"
      >
        <hr/>

        <div class="row no-gutters mt-3">
          <div class="col">
            <b-collapse :id="collapseId" v-model="visible">
              <hero v-if="task.loading"
                icon="spinner"
                title="commons.loading"
                spin
              />
              <div v-else-if="task.error"
                class="text-center my-2"
              >
                <icon :icon="['fas', 'times']"/>
                <span class="ml-1">Error al cargar detalle</span>
              </div>

              <div
                v-else-if="task.data"
              >
                <div
                  v-for="(error, index) in errors.global"
                  :key="index"
                  class="alert custom-alert-danger">
                  {{ error.code || error.detail }}
                </div>

                <div
                  class="border-left border-info pl-2 mb-3"
                  v-if="task.data.description"
                >
                  <app-md-render :raw-string="task.data.description"/>
                </div>

                <form-render
                  v-if="task.data.node_type === 'action'"
                  :forms="task.data.form_array"
                  :prevWork="task.data.prev_work"
                  :errors="errors"
                  :sending="sending"
                  @submit= "submit"
                />

                <data-validator
                  v-if="task.data.node_type === 'validation'"
                  :fields="task.data.fields"
                  :errors="errors"
                  :sending="sending"
                  @submit= "validate"
                />
              </div>
            </b-collapse>

            <div class="w-100 text-center">
              <a
                v-b-toggle="collapseId"
                href="#"
                v-on:click.prevent="showTask()"
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
import axios from 'axios';
import { getAuthToken, getAuthUser } from '../../utils/auth';
import { post } from '../../utils/api';
import formatErrors from '../../utils/formatErrors';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

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
      errors: {
        global: [],
      },
      sending: false,

      task: {
        data: null,
        loading: false,
        error: false,
      },
    };
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  created() {
    if (this.isDoableByUser) {
      this.showTask();
      this.visible = true;
    }
  },

  computed: {
    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },

    isDoableByUser() {
      const vm = this;

      const user = getAuthUser();

      return vm.pointer.notified_users.map(x => x.identifier).includes(user.username);
    },
  },

  methods: {
    validate(validation) {
      const postData = Object.assign({
        execution_id: this.task.data.execution.id,
        node_id: this.task.data.node_id,
      }, validation);

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },

    submit(formArray) {
      const postData = {
        execution_id: this.task.data.execution.id,
        node_id: this.task.data.node_id,
        form_array: formArray,
      };

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },

    showTask() {
      const vm = this;

      if (vm.task.loading || vm.visible) { return; }
      vm.task.loading = true;
      vm.task.error = false;

      vm.fetchTask(vm.pointer.id)
        .then((taskRes) => {
          vm.task.data = taskRes.data.data;
          vm.task.loading = false;
          vm.task.error = false;
        }).catch(() => {
          vm.task.loading = false;
          vm.task.error = true;
        });
    },

    fetchTask(pointerId) {
      let auth = getAuthToken();

      if (typeof window !== 'undefined') {
        auth = btoa(auth);
      } else {
        auth = new Buffer(auth).toString('base64');
      }

      const requestData = {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          charset: 'UTF-8',
        },
      };

      return axios.get(
        `${API_PVM_URL}/v1/task/${pointerId}`,
        requestData,
      );
    },
  },
};
</script>
