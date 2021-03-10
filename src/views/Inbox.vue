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
            <h3>{{ searchData.label }}</h3>
            <p>{{ searchData.description }}</p>
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
            :selected-search="searchData.feed"
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
                <div class="p-1">
                  <label>Buscar en "{{ searchData.label }}"</label>
                  <input class="w-100"/>
                </div>
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
                />
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
          <div
            class="text-right my-2"
          >
            <router-link
              :to="{
                name: 'dashboard',
                query: {
                  e: '',
                }
              }"
            >Volver a "{{ searchData.label }}"</router-link>
          </div>

          <div>
            <h3
              class="text-center"
            >Flujo de autorizacion</h3>

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
import _ from 'lodash';

export default {
  props: {
    selectedExecution: String,
    searchData: Object,
  },

  data() {
    return {
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
    handleSelectSearch(searchData) {
      this.searchData = searchData;

      if (searchData.objType === 'pointer') {
        this.fetchPointers(searchData.payload);
      } else if (searchData.objType === 'execution') {
        this.fetchExecutions(searchData.payload);
      }
    },

    fetchExecutions: _.debounce(function fetchExecutions(payload) {
      const vm = this;

      vm.listItems.loading = true;

      vm.$executionService.getExecutions(payload)
        .then((response) => {
          vm.listItems.data = response.data.data;
          vm.listItems.totalCount = response.data.total_count;
        });
    }, 250),

    fetchPointers: _.debounce(function fetchPointers(payload) {
      const vm = this;

      vm.listItems.loading = true;

      vm.$pointerService.getPointers(payload)
        .then((response) => {
          vm.listItems.data = response.data.pointers;
          vm.listItems.totalCount = response.data.total_count;
        });
    }, 250),

    itemComponent(obj) {
      // case execution
      const k = '_type';
      if (obj[k] === 'execution') {
        return 'app-execution-card';
      }
      // case pointer
      return obj.state === 'ongoing' ? 'timeline-pending' : 'timeline-action';
    },
  },

  beforeRouteUpdate(to, from, next) {
    if (
      typeof to.query.feed === 'undefined' ||
      typeof to.query.u === 'undefined' ||
      typeof to.query.e === 'undefined'
    ) {
      const feed = !(typeof to.query.feed === 'undefined') ? to.query.feed : from.query.feed;
      const u = !(typeof to.query.u === 'undefined') ? to.query.u : from.query.u;
      const e = !(typeof to.query.e === 'undefined') ? to.query.e : from.query.e;

      next({
        name: 'dashboard',
        query: {
          feed: feed || '',
          u: u || '',
          e: e || '',
        },
      });
    } else {
      next();
    }
  },

  watch: {
    searchData: {
      immediate: true,
      handler(newVal) {
        this.handleSelectSearch(newVal);
      },
    },
  },
};
</script>
