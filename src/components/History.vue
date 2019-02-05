<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div :class="{ 'd-none d-md-block': selectedId }" class="col">
        <div class="card">
          <div class="card-header">
            <div style="float:right;">
              <a href="javascript:void(0);" @click="loadList">
                <icon :icon="['fas', 'sync-alt']" />
              </a>
            </div>
            {{ $t('processes.processes')}}
          </div>

          <hero
            v-if="loading"
            icon="spinner"
            title="commons.loading"
            spin
          />

          <hero
            v-else-if="processes.length === 0"
            icon="inbox"
          />

          <ul
            v-else
            class="activity-list">
            <li
              style="display:flex"
              :class="{ active: selectedId === process.id }" v-for="process in processes"
              :key="process.id">
              <router-link
                style='width:96%'
                :to="{
                  name: 'process',
                  params: { id: process.id },
                }"
                replace><div class="activity-name">
                  {{ process.name }}
                </div>
                <div class="activity-caret">
                  <icon :icon="['fas', 'caret-right']" />
                </div>
              </router-link>
                <div class="eye">
                  <a :href="url + process.id + '.' + process.version + '.xml' "
                  target="_blank" class="button">
                    <icon :icon="['fa', 'eye']" />
                  </a>
                </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="selected" class="col-12 col-md-8">
        <activity :model="selected" />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '../utils/api';
import { getAuthUser } from '../utils/auth';

export default {
  props: ['model'],
  data() {
    const user = getAuthUser();
    return {
      userIdentifier: user.username,
      processes: [],
      loading: true,
      url: `${process.env.CACAHUATE_URL}/v1/process/`,
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList() {
      get(`/inbox?user_identifier=${this.userIdentifier}`)
        .then((body) => {
          this.loading = false;
          this.processes = body.data;
        })
        .catch((errors) => {
          this.loading = false;
          this.errors = errors;
        });
    },
  },
  computed: {
    selectedId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
    selected() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return this.processes
        .filter(p => p.id === id)
        .reduce((a, p) => (a || p), null);
    },
    containerClass() {
      return {
        container: this.selectedId === null,
        'container-fluid': this.selectedId !== null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border: 1px solid rgba(0, 0, 0, 0.125);
  flex: 1;
}

.card, .row {
  flex: 1 1 auto;
}

.col {
  display: flex;
}

.eye {
  justify-align:right;
  margin-top: 10px;
  margin-right: 10px;
  opacity: 0.5;
}

</style>
