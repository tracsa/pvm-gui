<template>
  <div v-if="!loading" class="timelines-container container">
    <div class="vertical-line"></div>
    <div class="timelines">
      <div class="timeline">
        <span class="timeline-dot"></span>
        <div class="card">
          <div class="card-header">
            <div class="author">
              {{ timeline.actors[0].user.identifier.split('\\')[1] }}
            </div>
            <div class="date">
              {{ timeline.finished_at | setMoment }}
            </div>
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p>
                {{ timeline.forms[0].data.reason }}
              </p>
            </blockquote>
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
  data() {
    return {
      loading: true,
      timeline: null,
    };
  },
  mounted() {
    const id = this.$route.params.id;
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
    setMoment: function setMoment(date) {
      const newdate = new Date(date);
      return moment(newdate).format('DD/MM/YYYY HH:mm');
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
