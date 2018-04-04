<template>
  <div class="timelines-container container">
    <div class="vertical-line"></div>
    <div class="timelines">
      <div class="timeline">
        <span class="timeline-dot"></span>
        <div class="card">
          <div class="card-header">
            <div class="author">
              Ulises C.
            </div>
            <div class="date">
              11/Abril/2019
            </div>
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../utils/auth';
import { get } from '@/utils/api';

export default {
  data() {
    return {
      timeline: ''
    };
  },
  mounted() {
    const id = "2f7516ce378711e89f1c5cc5d48161ea";

    get('/log/' + id)
      .then((body) => {
        this.timeline = body.data;
        console.log(body.data);
      })
      .catch((errors) => {
        console.error(errors);
      });
  },
  methods: {

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
