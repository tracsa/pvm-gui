<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div
        :class="{ 'd-none d-md-block': selectedId }"
        class="col">
        <div class="card">
          <div class="card-header">
            <div style="float:right;">
              <form class="form-inline">
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
            {{ $t('trackings.trackings') }}
          </div>

          <div class="filters-menu" v-if="menuVisible" style="position: relative;">
            <div class="popover-content">
              <div v-if="order.length">
                <b>Order by</b>
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
                <b>Filter by</b>
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
                <p>No se han establecido filtros para esta vista.</p>
              </div>
              <hr/>
              <div v-if="haveFiltersOrder" style="text-align: right;">
                <span class="btn btn-secondary" @click="clear">Clear</span>
                <span class="btn btn-primary" @click="loadList">Apply</span>
                <span class="btn btn-danger" @click="toggleMenu">Cancel</span>
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
            class="activity-list">
            <li
              :class="{ active: selectedId === tracking.id }"
              v-for="tracking in showedItems"
              :key="tracking.id">
              <router-link
                :to="{
                  name: 'tracking',
                  params: { id: tracking.id },
                }">
                <div class="activity-name">
                  {{ tracking.name }}!
                </div>
                <div class="small"
                  :title="tracking.started_at | formatDate">
                  {{ tracking.started_at | relativeDate }}
                </div>
                <div class="activity-caret">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
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
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList: function loadList() {
      this.loading = true;
      this.errors = [];

      get(`/execution?user_identifier=${this.userId}`)
        .then((body) => {
          this.loading = false;
          this.items = body.data;
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
  margin-bottom: 0rem !important;
}

</style>
