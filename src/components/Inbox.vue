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
        <tracking :id="selectedId" />
      </div>

    </div>
  </div>
</template>

<script>
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
