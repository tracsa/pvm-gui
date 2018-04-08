<template>
  <div v-if="!loading" class="timelines-container container">
    <div class="vertical-line"></div>
    <div class="timelines">
      <div class="timeline">
        <span class="timeline-dot" 
          :title="timeline.finished_at | setMoment('Complete')"></span>
        <div class="card">
          <div class="card-header">
            <div class="col col-8">
              <span class="info">
                {{ timeline.actors[0].user.identifier.split('\\')[1] }} — 
                <small>
                  {{ timeline.finished_at | setMoment('From now') }}
                </small>
              </span>
            </div>
            <div class="col col-4">
              <div style="font-size:16px;float:right;" >
                <router-link :to="{ name: 'activities' }">
                  <icon :icon="['fas', 'times']" />
                </router-link>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-for="(value, key) in timeline.actors[0].forms[0].data"
            :key="key"
            class="form-values">
                <div class="form-label">
                  {{ key }}:
                </div>
                <div class="form-value">
                  {{ value | setMoment }}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { get } from '@/utils/api';

export default {
  props: ['model'],
  data() {
    return {
      loading: true,
      timeline: null,
    };
  },
  mounted() {
    const id = this.model;
    this.loadData(id);
  },
  watch: {
    model(newValue, prevValue) {
      this.loadData(newValue);
    },
  },
  methods: {
    loadData: function loadData(id) {
      get(`/log/${id}`)
        .then((body) => {
          this.timeline = body.data[0];
          this.loading = false;
          console.log(this.timeline);
        })
        .catch((errors) => {
          this.loading = false;
          console.error(errors);
        });
    },
  },
  filters: {
    setMoment: function setMoment(data, from) {
      const oldData = data;
      let newDate = new Date(data);
      if(from === 'From now') newDate = moment().startOf('hour').fromNow(); 
      else if (from === 'Complete') newDate = moment().format('MMMM Do YYYY, h:mm:ss a');
      else newDate = moment(newDate).format('DD/MM/YYYY HH:mm');
      if(newDate !== 'Invalid date') return newDate;
      else return oldData;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.timelines-container {
  display: flex;
  height: 100%;
  padding-left: 10px;

  .vertical-line {
    background: lighten($purple, 30);
    height: 100%;
    width: $line-width;
  }

  .timelines {
    display: block;
    height: 100%;
    width: 100%;

    .timeline {
      width: 100%;
      position: relative;
      padding-left: $line-distance;

      & + div {
        margin-top: 10px;
      }

      .timeline-dot {
        background: $purple;
        position: absolute;
        left: -($dot-size + 3)/2;
        top: (49 - $dot-size)/2;
        height: $dot-size;
        width: $dot-size;
        border: $line-width solid $body-bg;
        border-radius: 50%;
      }

      .card {
        overflow: hidden;

        .card-body {

          .form-values {

              & div {
                display: inline;
              }

              .form-value {
                margin-left: 40px;
              }
          }
        }

        .card-header {
          display: inline-flex;
          padding: 12px 5px;

          span {
            font-size: 16px;
          }

        }
      }
    }
  }
}
</style>
