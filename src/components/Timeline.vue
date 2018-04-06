<template>
  <div v-if="!loading" class="timelines-container container">
    <div class="vertical-line"></div>
    <div class="timelines">
      <div class="timeline">
        <span class="timeline-dot"></span>
        <div class="card">
          <div class="card-header">
            <div class="author">
              {{ $t('timeline.by') }}
              {{ timeline.actors[0].user.identifier.split('\\')[1] }}
            </div>
            <div class="date">
              {{ $t('timeline.date') }}
              {{ timeline.finished_at | setMoment }}
            </div>
          </div>
          <div class="card-body">
            <div v-for="(value, key) in timeline.forms[0].data"
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
    console.log(this.model);
    // console.log(id, "Hijo de la santa");

    get(`/log/${id}`)
      .then((body) => {
        this.timeline = body.data[0];
        this.loading = false;
      })
      .catch((errors) => {
        console.error(errors);
      });
  },
  filters: {
    setMoment: function setMoment(data) {
      const oldData = data;
      let newDate = new Date(data);
      newDate = moment(newDate).format('DD/MM/YYYY HH:mm');
      console.log(newDate);
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

          div {
            width: 50%;

            & + div {
              text-align: end;
            }
          }
        }
      }
    }
  }
}
</style>
