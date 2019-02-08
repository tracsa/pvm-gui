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
          :class="{ 'fixed': fixedControl }"
          :style="{ 'max-height': maxHeight }">
          <div class="card-header">
            <div style="float:right;">
              <form class="form-inline" v-on:submit.prevent>
                <div class="input-group">
                  <input class="form-control" v-model="query" type="text"/>
                  <div class="input-group-append">
                    <button class="btn btn-outline-primary" type="button" @click="filterList">
                      <icon style="min-width: 25px;" :icon="['fas', 'search']" />
                    </button>

                    <button class="btn btn-outline-primary" type="button" @click="loadList">
                      <icon style="min-width: 25px;" :icon="['fas', 'sync-alt']" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <span>{{ $t('inbox.page_title') }}</span>
          </div>

          <div
            v-if="errors.length">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="alert custom-alert-danger">
              {{ $t(`errors.${error.where}`) }}
            </div>
          </div>

          <hero
            v-if="loadingList"
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
              v-for="item in showedItems"
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
        <div v-if="loadingItem">
          <hero
            icon="spinner"
            title="commons.loading"
            spin
          />
        </div>
        <div v-else>
          <inbox-item :item="selectedItem" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Promise from 'promise-polyfill';
import { get } from '../utils/api';
import itemFilterMixin from '../mixins/ItemFilterMixin';
import { getAuthUser } from '../utils/auth';

export default {
  props: ['model'],
  mixins: [itemFilterMixin],
  data() {
    const user = getAuthUser();

    return {
      // fixed over lifetime
      userId: user.username,
      fixedControl: undefined,
      maxHeight: '400px',

      // for list of items
      loadingList: true,
      items: [],
      errors: [],

      // for selected items
      loadingItem: this.selectedId !== null,
      selectedItem: null,
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
      this.loadingList = true;
      this.errors = [];

      get(`/inbox?pointer.user_identifier=${this.userId}`)
        .then((body) => {
          this.loadingList = false;
          this.items = body.data;
          this.filterList();

          if (cb) {
            cb(this.items);
          }
        })
        .catch((errors) => {
          this.loadingList = false;
          this.errors = errors;
        });
    },
    loadItem(id) {
      const self = this;
      const item = {
        execution: null,
        task: null,
        pointers: null,
      };

      const next = function next() {
        if (
          item.execution !== null &&
          item.pointers !== null
        ) {
          self.loadingItem = false;
          self.selectedItem = item;
        }
      };

      get(`/execution/${id}`)
        .then((body) => {
          const execution = body.data;
          item.execution = execution;

          next();
        });

      get(`/log/${id}`)
        .then((body) => {
          const pointers = body.data;
          item.pointers = pointers;

          const doable = pointers.filter((pointer) => {
            if (pointer.finished_at !== null) {
              return false;
            }

            if (pointer.notified_users.map(user => user.identifier).indexOf(this.userId) === -1) {
              return false;
            }

            return true;
          });

          let answer;
          if (doable.length > 0) {
            answer = get(`/task/${doable[0].id}`);
          } else {
            answer = Promise.resolve(null);
          }

          return answer;
        })
        .then((body) => {
          if (body && body.data) {
            const task = body.data;
            item.task = task;
          }

          next();
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
  watch: {
    selectedId(selectedId) {
      if (selectedId) {
        this.loadingItem = true;
        this.loadItem(selectedId);
      }
    },
  },
};
</script>
