<template>
  <div
    class="container-fluid p-0"
    style="max-width: 1270px;"
  >
    <div class="row no-gutters"
      v-if="!showRight"
    >
      <div class="col">
        <slot name="top">
          <div class="px-3 py-2 text-center">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
          </div>
          <hr/>

        </slot>
      </div>
    </div>

    <div class="row no-gutters">
      <div v-if="showLeft"
        :class="{
          'col-2': showRight,
          'col-3': !showRight,
          'pr-2': showCenter,
        }"
      >
        <slot name="left">
          <app-inbox-sidebar
            :selected-search="selectedFeed"
            v-on:click-feed="selectFeed($event)"
          />
        </slot>
      </div>

      <div v-if="showCenter"
        :class="{
          'col-4': (showLeft && showRight) || (!showLeft && showRight),
          'col-9': showLeft && !showRight,
          'col-12': !showLeft && !showRight,
          'pl-2': showLeft,
          'pr-2': showRight,
        }"
      >
        <slot name="center">
          <div class="container-fluid p-0">
            <div class="row no-gutters mb-3">
              <div class="col">
                <b-card>
                  <div>Buscar en "{{ title }}"</div>

                  <hr/>

                  <app-inbox-search-card
                    :fixed-args="fixedPayload"
                    v-model="searchForm"
                    v-on:submit="submitForm"
                  />
                </b-card>
              </div>
            </div>

            <hero v-if="listItems.loading"
              icon="spinner"
              title="commons.loading"
              spin
            />
            <div v-else-if="listItems.error"
              class="text-center my-2"
            >
              <icon :icon="['fas', 'times']"/>
              <span class="ml-1">Error al cargar elementos</span>
            </div>

            <div
              v-else
            >
              <div class="row no-gutters mb-3"
                v-if="!listItems.data.length"
              >
                <div class="col">
                  <h4 class="text-center">No hay elementos para mostrar</h4>
                </div>
              </div>

              <div class="row no-gutters mb-3"
                v-for="item in listItems.data"
                :key="item.id"
              >
                <div class="col">
                  <component
                    :is="itemComponent(item)"
                    :execution='item'
                    :pointer='item'
                    :extended='true'
                    :verbose='true'
                    v-on:click-execution="selectExecution($event);"
                  />
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div v-if="showRight"
        :class="{
          'col-6': showLeft && showCenter,
          'col-8': !showLeft && showCenter,
          'col-12': !showLeft && !showCenter,
          'pl-2': showCenter,
        }"
      >
        <slot name="right">

          <div>
            <h3
              class="text-center"
            >Flujo de autorizacion</h3>

            <div
              class="text-right my-2"
            >
              <a
                href="#"
                v-on:click.prevent="selectExecution()"
              >
                <icon :icon="['fas', 'arrow-circle-left']"/>
                <span class="ml-1">Volver a "{{ title }}"</span>
              </a>
            </div>

            <app-inbox-execution-timeline
              :execution-id="selectedExecution"
            />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    feed: {
      type: String,
      required: true,
    },
    executionId: String,
    query: String,
    fixedPayload: Object,
  },

  data() {
    return {
      selectedFeed: this.feed,
      selectedExecution: this.executionId,
      searchText: this.query || '',
      searchForm: null, // built based on prop

      listItems: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },
    };
  },

  computed: {
    showLeft() {
      return (
        (this.showRight === false && (this.$mq === 'md' || this.$mq === 'lg')) ||
        (this.showRight === true && (this.$mq === 'lg'))
      );
    },

    showCenter() {
      return (
        this.showRight === false ||
        (this.showRight === true && (this.$mq === 'md' || this.$mq === 'lg'))
      );
    },

    showRight() {
      return !!this.selectedExecution;
    },
  },

  methods: {
    handleSelectSearch() {
      const payload = {
        ...this.searchForm,
      };

      if (payload.minDate) {
        payload.minDate = moment(payload.minDate).toISOString();
      }

      if (payload.maxDate) {
        payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
      }

      if (payload.objType === 'pointer') {
        this.fetchPointers(payload);
      } else if (payload.objType === 'execution') {
        this.fetchExecutions(payload);
      }
    },

    fetchExecutions: _.debounce(function fetchExecutions(payload) {
      const vm = this;

      vm.listItems.loading = true;
      vm.listItems.error = false;

      vm.$executionService.getExecutions(payload)
        .then((response) => {
          vm.listItems.data = response.data.data;
          vm.listItems.totalCount = response.data.total_count;
          vm.listItems.loading = false;
        }).catch(() => {
          vm.listItems.loading = false;
          vm.listItems.error = true;
        });
    }, 250),

    fetchPointers: _.debounce(function fetchPointers(payload) {
      const vm = this;

      vm.listItems.loading = true;
      vm.listItems.error = false;

      vm.$pointerService.getPointers(payload)
        .then(({ items, totalCount }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
            }
          });
          vm.listItems.totalCount = totalCount;
          vm.listItems.loading = false;
        }).catch(() => {
          vm.listItems.loading = false;
          vm.listItems.error = true;
        });
    }, 250),

    itemComponent(obj) {
      // case execution
      const k = '_type';
      if (obj[k] === 'execution') {
        return 'app-execution-card';
      }
      // case pointer
      return 'app-pointer-card';
    },

    selectFeed(newFeed) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      newRoute.query.feed = newFeed;

      this.$router.push(newRoute);
    },

    selectExecution(newExecution) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      if (newExecution) {
        newRoute.query.e = newExecution;
      } else {
        delete newRoute.query.e;
      }

      this.$router.push(newRoute);
    },

    submitForm() {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      if (this.searchForm.searchText) {
        newRoute.query.q = this.searchForm.searchText;
      } else {
        delete newRoute.query.q;
      }

      this.handleSelectSearch();

      this.$router.push(newRoute);
    },
  },

  watch: {
    fixedPayload: {
      immediate: true,
      handler(newVal, oldVal) {
        if (
          !oldVal ||
          (JSON.stringify(newVal) !== JSON.stringify(oldVal))
        ) {
          this.searchForm = {
            actoredUsers: null,
            notifiedUsers: null,
            executionStatus: ['ongoing', 'finished', 'cancelled'],
            pointerStatus: ['ongoing', 'finished', 'cancelled'],
            objType: 'pointer',
            searchText: this.query || '',
            minDate: '',
            maxDate: '',
            ...newVal,
          };

          this.handleSelectSearch();
        }
      },
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.selectedFeed = to.query.feed;
    this.selectedExecution = to.query.e;
    this.searchText = to.query.q;

    next();
  },
};
</script>
