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
              <a href="javascript:void(0);" @click="loadList">
                <icon :icon="['fas', 'sync-alt']" />
              </a>
            </div>
            {{ $t('trackings.trackings') }}
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
            v-else-if="trackings.length === 0"
            icon="inbox"
            title="info.aboutTrackings"
            desc="info.aboutTrackingsMore"
          />

          <!-- TODO: Move to style file -->
          <table width=100%
            v-else
            class="activity-table">
            <!--TODO: i18n-->
            <th>
                Proceso
            </th>
            <th>
                Usuario(s)
            </th>
            <th>
                Estado
            </th>
            <th />

            <router-link
              :to="{
                name: 'admin-tracking',
                params: { id: tracking.execution.id },
              }"
              tag="tr"
              v-for="tracking in trackings"
              :key="tracking.execution.id">

              <td>
                {{ tracking.execution.name }}
              </td>

              <td>
                <div
                  v-for="(user, index) in tracking.notified_users"
                  :key="index">
                  {{ user.fullname }}
                </div>
              </td>

              <td>
                {{ tracking.node.name }}
              </td>

              <td>
                <div class="activity-caret">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
              </td>
            </router-link>

          </table>

        </div>
      </div>

      <div v-if="selectedId" class="col-12 col-md-8 no-overflow-x">
        <admin-tracking
          :id="selectedId"
          :node="trackings[selectedId]"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { get } from '../utils/api';

export default {
  props: ['model'],
  data() {
    return {
      loading: true,
      trackings: {},
      errors: [],
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList: function loadList() {
      this.loading = true;
      this.errors = [];

      get('/log')
        .then((body) => {
          this.loading = false;
          this.trackings = {};

          const nodes = body.data;

          const arrToObj = arr =>
            arr.reduce((obj, item) => {
              // TODO: remove this
              // eslint-disable-next-line
              obj[item.execution.id] = item;
              return obj;
            }, {});

          this.trackings = arrToObj(nodes);
        })
        .catch((errors) => {
          this.loading = false;
          this.errors = errors;
        });
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
</style>
