<template>
  <div
    class="full-columns"
    :class="containerClass">
    <div class="row">
      <div
        ref="inbox-container"
        v-if="shown"
        :class="{
          'd-none d-md-block': selectedId,
          'col-12': !selectedId,
          'col-4': selectedId,
        }">
        <div
          class="card"
          :class="{ 'fixed': fixedControl }"
          :style="{ 'height': maxHeight, 'max-height': maxHeight }">
          <div class="card-header">
            <div v-if="selectedId" class="mb-3">
              <div style="float: right;">
                <a href="javascript:void()" @click="toggleMenu">{{ $t('commons.hide') }}</a>
              </div>

              <span>
                {{ $t('inbox.page_title') }}<span
                  v-if="showedItems">: {{ showedItems.length }} elementos</span>
              </span>

            </div>
            <div :style="{ 'float': selectedId ? 'none' : 'right' }">
              <form
                :class="{
                  'form': selectedId,
                  'form-inline': !selectedId,
                }"
                v-on:submit.prevent
              >
                <div class="input-group">
                  <input
                    class="form-control"
                    v-model="query" type="text"
                    v-on:keyup.enter="filterList"/>
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
            <span v-if="!selectedId">
              <span>
                {{ $t('inbox.page_title') }}<span
                  v-if="showedItems">: {{ showedItems.length }} elementos</span>
              </span>
            </span>
          </div>

          <b-navbar
            v-if="!loadingList"
            toggleable="true"
          >
            <b-navbar-brand href="#">{{ searchTitle }}</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <template
                v-for="item in availableSearchList"
              >
                <b-navbar-nav
                  v-if="item.value !== selectedSearch"
                  :key="item.value"
                >
                  <b-nav-item
                    @click="selectedSearch = item.value; loadList();">{{ item.text }}</b-nav-item>
                </b-navbar-nav>
              </template>
            </b-collapse>
          </b-navbar>

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
            style="overflow: auto;"
            class="list-group list-group-flush">
            <template
              v-for="item in showedItems"
            >
              <li
                class="list-group-item flex-column"
                :class="{ active: selectedId === item.id }"
                :key="item.id">
                <router-link
                  v-if="selectedId !== item.id"
                  :to="{
                    name: 'inbox-item',
                    params: { id: item.id },
                  }"
                  replace>
                  <inbox-list-item :process="item" />
                </router-link>
                <div style="cursor: pointer;" v-else>
                  <inbox-list-item :process="item" />
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <div v-if="selectedId" :class="{
          'col-12': true,
          'no-overflow-x': true,
          'col-md-8': shown
        }">
        <div v-if="loadingItem">
          <hero
            icon="spinner"
            title="commons.loading"
            spin
          />
        </div>
        <div v-else>
          <inbox-item
            :item="selectedItem"
            @refresh="refreshItem"
          />
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
import Utf8ArrayToString from '../utils/utf8ArrayToString';

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

      // nav
      selectedSearch: 'my_current_tasks',
      availableSearchList: [
        {
          value: 'my_current_tasks',
          text: 'Mis tareas pendientes',
        },
        {
          value: 'my_tasks',
          text: 'Mis tareas realizadas',
        },
        {
          value: 'ongoing',
          text: 'Todos los procesos en curso',
        },
      ],

      // for selected items
      shown: true,
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

    if (this.selectedId) {
      this.shown = false;
      this.loadItem(this.selectedId);
    }
  },

  methods: {
    handleScreenChange: function handleScreenChange() {
      const inboxContainer = this.$refs['inbox-container'];
      const screenHeight = window.document.documentElement.clientHeight;
      const scrollTop = window.pageYOffset;
      const paddingTB = 10;

      let offsetTop = 0;
      let DOMIterator = inboxContainer;
      while (DOMIterator && DOMIterator.tagName !== 'BODY') {
        offsetTop += DOMIterator.offsetTop;
        DOMIterator = DOMIterator.offsetParent;
      }

      const maxHeight = screenHeight - offsetTop - paddingTB;

      this.fixedControl = scrollTop > offsetTop - paddingTB;
      this.maxHeight = `${maxHeight}px`;
    },
    loadList: function loadList(cb = null) {
      this.loadingList = true;
      this.errors = [];

      const srch = this.selectedSearch;

      let itemsUrl = '';

      if (srch === 'my_current_tasks') {
        itemsUrl = (
          '/inbox?' +
          '&status=ongoing' +
          '&pointer.state=ongoing' +
          `&pointer.notified_users.identifier=${this.userId}` +
          '&include=id,name,pointer,status' +
          '&sort=pointer.started_at,DESCENDING'
        );
      } else if (srch === 'my_tasks') {
        itemsUrl = (
          '/inbox?' +
          '&status=ongoing' +
          `&actor_list.actor.identifier=${this.userId}` +
          '&include=id,name,pointer,status' +
          '&sort=pointer.started_at,DESCENDING'
        );
      } else if (srch === 'my_tags') {
        itemsUrl = (
          '/inbox?' +
          '&status=ongoing' +
          `&pointer.notified_users.identifier=${this.userId}` +
          '&include=id,name,pointer,status' +
          '&sort=pointer.started_at,DESCENDING'
        );
      } else if (srch === 'my_all') {
        itemsUrl = (
          '/inbox?' +
          '&status=ongoing' +
          `&user_identifier=${this.userId}` +
          '&include=id,name,pointer,status' +
          '&sort=pointer.started_at,DESCENDING'
        );
      } else if (srch === 'ongoing') {
        itemsUrl = (
          '/inbox?' +
          '&status=ongoing' +
          '&include=id,name,pointer,status' +
          '&sort=pointer.started_at,DESCENDING'
        );
      }


      get(itemsUrl)
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
    refreshItem() {
      this.loadItem(this.selectedId);
    },
    doableByUser(execution) {
      if (!execution.pointer.notified_users) return false;

      const users = execution.pointer.notified_users;
      const ids = users.map(user => user.identifier);

      return ids.includes(this.userId);
    },

    loadItem(id) {
      const self = this;
      const item = {
        execution: null,
        task: null,
        pointers: [],
      };

      const loaded = {
        execution: false,
        task: false,
        summary: false,
      };

      const next = function next() {
        // verify that requests are complete
        if (!loaded.execution || !loaded.task || !loaded.summary) {
          return;
        }

        self.loadingItem = false;
        if (JSON.stringify(item) !== JSON.stringify(self.selectedItem)) {
          self.selectedItem = item;
        }

        let pointer = null;
        if (item.pointers !== null && item.pointers.length > 0) {
          pointer = item.pointers[0];

          for (let i = 1; i < item.pointers.length; i += 1) {
            const ptr = item.pointers[i];
            if (ptr.started_at > pointer.started_at) {
              pointer = ptr;
            }
          }
        }

        // sync list
        const listItem = {
          id: item.execution.id,
          name: item.execution.name,
          status: item.execution.status,
          pointer,
        };

        if (self.items instanceof Array) {
          self.items = self.items.map((itm) => {
            let response;
            if (itm.id === listItem.id) {
              response = listItem;
            } else {
              response = itm;
            }

            return response;
          });

          self.filterList();
        }

        // replace URL
        if (item.task !== null && self.pointerId === null) {
          self.$router.replace(`/inbox/${self.selectedId}/${item.task.id}`);
        }
      };

      get(`/execution/${id}`)
        .then((body) => {
          const execution = body.data;
          item.execution = execution;
          loaded.execution = true;

          next();
        })
        .catch(() => {
          self.$router.push('/');
        });

      get(`/log/${id}`)
        .then((body) => {
          const pointers = body.data;
          item.pointers = pointers;

          const doable = pointers.filter((pointer) => {
            if (pointer.state !== 'ongoing') {
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
          loaded.task = true;

          next();
        });

      get(`/execution/${id}/summary`, {}, 'application/json', false)
        .then((response) => {
          const reader = response.body.getReader();
          let summary = '';

          reader.read().then(function processText({ done, value }) {
            if (done) {
              item.summary = summary;
              loaded.summary = true;
              return next();
            }

            summary += Utf8ArrayToString(value);

            return reader.read().then(processText);
          });
        });
    },
    toggleMenu() {
      this.shown = !this.shown;
    },
  },
  computed: {
    searchTitle: function searchTitle() {
      const vm = this;

      const title = vm.availableSearchList
        .find(item => item.value === vm.selectedSearch);

      if (title) return title.text;

      return vm.availableSearchList[0].text;
    },

    selectedId: function selectedId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
    pointerId() {
      const { pid } = this.$route.params;
      if (!pid) {
        return null;
      }

      return pid;
    },
    containerClass: function containerClass() {
      return {
        container: this.selectedId === null || !this.shown,
        'container-fluid': this.selectedId !== null && this.shown,
      };
    },
  },
  watch: {
    selectedId(selectedId, prevSelectedId) {
      if (selectedId === prevSelectedId) {
        return;
      }

      if (selectedId) {
        this.loadingItem = true;
        this.shown = false;
        this.loadItem(selectedId);
      } else {
        this.shown = true;
      }
    },
  },
};
</script>
