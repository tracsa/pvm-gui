<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div
        ref="inbox-container"
        :class="{
          'd-none d-md-block': selectedId,
          'col-12': !selectedId,
          'col-4': selectedId,
        }">
        <div
          class="card inbox-control"
          :class="{
            'fixed': fixedControl,
          }"
          :style="{
            'max-height': maxHeight,
          }">
          <div class="card-header">
            <div style="float:right;">
              <form class="form-inline" v-on:submit.prevent>
                <div class="input-group mb-3">
                  <input class="form-control" v-model="query" type="text"/>
                  <div class="input-group-append">
                    <button class="btn btn-outline-primary" type="button" @click="filterList">
                      <icon style="min-width: 25px;" :icon="['fas', 'search']" />
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <a
                    href="javascript:void(0);"
                    @click="toggleMenu"
                  ><icon style="min-width: 25px;" :icon="['fas', 'ellipsis-v']" />
                  </a>
                </div>
                <a href="javascript:void(0);" @click="loadList">
                  <icon :icon="['fas', 'sync-alt']" />
                </a>
              </form>
            </div>
            {{ $t('inbox.page_title') }}
          </div>

          <div class="filters-menu" v-if="menuVisible" style="position: relative;">
            <div class="popover-content">
              <div v-if="order.length">
                <b>{{ $t('dataFilters.labels.orderBy')}}</b>
                <div v-for="o in order" :key="o.attribute">
                  <input
                    v-model="orderBy"
                    type="radio"
                    name="orderby"
                    :value="o.attribute"
                    :id="o.attribute">
                  <label> {{ o.attribute }} </label>
                </div>
              </div>
              <div v-if="haveFilters">
                <b>{{ $t('dataFilters.labels.filterBy')}}</b>
                <div v-for="(filter, index) in dataFilters" :key="index">
                  <small>{{ index }}</small>
                  <div v-for="value in filter.values" :key="value">
                    <label>
                      <input
                        type="checkbox"
                        :name="value"
                        :id="value"
                        :value="value"
                        v-model="appliedFilters[index].values">
                        {{ value }}
                    </label>
                  </div>
                </div>
              </div>
              <div v-if="!haveFiltersOrder">
                <p>{{ $t('dataFilters.messages.noFilters')}}</p>
              </div>
              <hr/>
              <div v-if="haveFiltersOrder" style="text-align: right;">
                <span
                  class="btn btn-secondary"
                  @click="clear">
                  {{ $t('dataFilters.buttons.clear')}}</span>
                <span
                  class="btn btn-primary"
                  @click="filterList">
                  {{ $t('dataFilters.buttons.apply')}}</span>
                <span
                  class="btn btn-danger"
                  @click="toggleMenu">
                  {{ $t('dataFilters.buttons.cancel')}}</span>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>

          <div
            v-if="errors.length"
            class="container-error">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="alert custom-alert-danger">
              {{ $t(`errors.${error.where}`) }}
            </div>
          </div>

          <hero
            v-if="loading"
            icon="spinner"
            title="commons.loading"
            spin
          />

          <hero
            v-else-if="showedItems.length === 0"
            icon="inbox"
            title="info.aboutTrackings"
            desc="info.aboutTrackingsMore"
          />

          <ul
            v-else
            class="inbox-list">
            <li
              v-for="item in items"
              :class="{ active: selectedId === item.id }"
              :key="item.id">
              <router-link
                :to="{
                  name: 'inbox-item',
                  params: { id: item.id },
                }"
                replace>
                <inbox-list-item :process="item" />
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="selectedId" class="col-12 col-md-8 no-overflow-x">
        <tracking :id="selectedId" />
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { get } from '../utils/api';
import itemFilterMixin from '../mixins/ItemFilterMixin';
import { getAuthUser } from '../utils/auth';

export default {
  props: ['model'],
  mixins: [itemFilterMixin],
  data() {
    const user = getAuthUser();

    return {
      loading: true,
      items: [],
      errors: [],
      userId: user.username,
      fixedControl: undefined,
      maxHeight: '400px',
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScreenChange);
    window.addEventListener('resize', this.handleScreenChange);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScreenChange);
    window.removeEventListener('resize', this.handleScreenChange);
  },
  mounted() {
    this.loadList(() => {
      this.handleScreenChange();
    });
  },
  methods: {
    handleScreenChange: function handleScreenChange() {
      const inboxContainer = this.$refs['inbox-container'];
      const screenHeight = window.document.documentElement.clientHeight;
      const scrollTop = window.pageYOffset;
      const paddingTB = 10;

      let offsetTop = 0;
      let DOMIterator = inboxContainer;
      while (DOMIterator.tagName !== 'BODY') {
        offsetTop += DOMIterator.offsetTop;
        DOMIterator = DOMIterator.offsetParent;

        // This means that sidebar is hidden
        if (DOMIterator === null) {
          return;
        }
      }

      const maxHeight = screenHeight - offsetTop - paddingTB;

      this.fixedControl = scrollTop > offsetTop - paddingTB;
      this.maxHeight = `${maxHeight}px`;
    },
    loadList: function loadList(cb = null) {
      this.loading = true;
      this.errors = [];

      // name, pointer, id
      get(`/inbox?user_identifier=${this.userId}&exclude=actors,description,finished_at,started_at,state,status,values`)
        .then((body) => {
          this.loading = false;
          this.items = body.data;
          this.filterList();

          if (cb) {
            cb(this.items);
          }
        })
        .catch((errors) => {
          this.loading = false;
          this.errors = errors;
        });
    },
  },
  filters: {
    relativeDate(val) {
      const date = new Date(val);
      const yesterday = new Date() - (24 * 60 * 60 * 1000);

      if (yesterday < date) {
        return moment(val).fromNow();
      }

      return moment(val).calendar();
    },
    formatDate(val) {
      return moment(val).format('LLLL');
    },
  },
  computed: {
    selectedId: function selectedId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
    containerClass: function containerClass() {
      return {
        container: this.selectedId === null,
        'container-fluid': this.selectedId !== null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}

.container-error {
  padding: 30px;
  padding-bottom: 0;
}

.filters-menu {
  margin: 15px;
}

.mb-3 {
  margin-bottom: 0 !important;
}

.inbox-control {
  &.fixed {
    position: fixed;
    top: 10px;
    left: 15px;
    bottom: 10px;
    width: calc(33.33333% - 30px);
  }

  .inbox-list {
    overflow: auto;
  }
}
</style>
