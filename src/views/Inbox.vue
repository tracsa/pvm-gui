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
                <b-card>
                  <div>Buscar en "{{ searchData.label }}"</div>

                  <hr/>

                  <b-form
                    class="w-100"
                    @submit.stop.prevent="handleSelectSearch();"
                  >
                    <b-form-group>
                      <b-form-input
                        v-model="searchForm.searchText"
                        placeholder="Título o Id"
                        type="search"
                      ></b-form-input>
                    </b-form-group>

                      <b-button
                        type="submit"
                        variant="secondary"
                      >
                        <span>
                          <icon :icon="['fa', 'search']"/>
                          Buscar
                        </span>
                      </b-button>
                  </b-form>
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
              <router-link
                :to="{
                  name: 'dashboard',
                  query: {
                    e: '',
                  }
                }"
              >Volver a "{{ searchData.label }}"</router-link>
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
import _ from 'lodash';

export default {
  props: {
    selectedExecution: String,
    searchData: Object,
    searchText: String,
  },

  data() {
    return {
      searchForm: {
        searchText: this.searchText || '',
      },

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
        ...this.searchData.payload,
        ...this.searchForm,
      };

      if (this.searchData.objType === 'pointer') {
        this.fetchPointers(payload);
      } else if (this.searchData.objType === 'execution') {
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
        .then((response) => {
          vm.listItems.data = response.data.pointers;
          vm.listItems.totalCount = response.data.total_count;
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
  },

  beforeRouteUpdate(to, from, next) {
    if (
      typeof to.query.feed === 'undefined' ||
      typeof to.query.u === 'undefined' ||
      typeof to.query.e === 'undefined' ||
      typeof to.query.q === 'undefined'
    ) {
      const feed = !(typeof to.query.feed === 'undefined') ? to.query.feed : from.query.feed;
      const u = !(typeof to.query.u === 'undefined') ? to.query.u : from.query.u;
      const e = !(typeof to.query.e === 'undefined') ? to.query.e : from.query.e;
      const q = !(typeof to.query.q === 'undefined') ? to.query.q : from.query.q;

      next({
        name: 'dashboard',
        query: {
          feed: feed || '',
          u: u || '',
          e: e || '',
          q: q || '',
        },
      });
    } else {
      next();
    }
  },

  watch: {
    searchData: {
      immediate: true,
      handler(newVal, oldVal) {
        // TODO: Do not use json stringify
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.handleSelectSearch();
        }
      },
    },
  },
};
</script>
