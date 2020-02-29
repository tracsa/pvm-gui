<template>
  <div
    v-if="nodeCount > 1"
    class="container-linear d-none d-md-block">
    <div class="row line">
      <div
        v-for="(node, index) in nodes"
        v-if="node.state === 'ongoing' || node.milestone"
        class="col"
        :key="index"
        :class="{
          'no-active': (node.state === 'ongoing' || node.state === 'unfilled'),
        }">
          <div class="container-step" :title="node.name">
            <div
              v-if="node.state === 'ongoing'"
              class="actual-active">
              <div class="center-point" />
            </div>
            <div
              v-else-if="node.state === 'valid'"
              @click="emitClick(node.id)"
              class="active">
              <icon :icon="['fas', 'check']" />
            </div>
            <div
              v-else
              class="no-active">
            </div>

            <div v-if="false" class="container-step-desc">
              <div class="step-desc" :title="node.description">
                {{ node.name }}
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['nodes'],
  computed: {
    nodeCount() {
      return this.nodes.filter(node => node.state === 'ongoing' || node.milestone).length;
    },
  },
  methods: {
    emitClick(nodeId) {
      this.$emit('click', nodeId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';
@import '../styles/mixins.scss';

.container-linear {
  padding: 20px 20px;
  padding-bottom: 50px;

  .line {
    margin: 0;

    .col:last-child {
      flex-grow: initial;

      .active, .no-active, .actual-active {
        right: 15px;
      }

      .container-step-desc {
        justify-content: end;
      }
    }

    .col {
      position: relative;
      height: $line-size;
      background: $line-background;
      @include box-shadow(0px 0px 29px -3px rgba(73,128,248,0.55));

      &.no-active {
        background: $line-no-active-step;

        .no-active {
          height: $circle-no-active-bg;
          width: $circle-no-active-bg;
          background: $body-bg;
          border: $line-size solid $line-no-active-step;
          border-radius: 50%;
          @include mq($until: tablet) {
            height: $circle-active-size - 5px;
            width: $circle-active-size - 5px;
          }
          z-index: 10;
        }
      }

      .container-step {
        position: absolute;
        left: 0;
        display: flex;
        justify-content: center;
        top: calc(((#{$circle-no-active-bg} / 2) - 4px) * -1);

        .container-step-desc {
          position: absolute;
          top: calc(#{$circle-no-active-bg} + #{$arrow-step-desc} + 3px);
          @include mq($until: tablet) {
            top: calc((#{$circle-no-active-bg} - 5px) + #{$arrow-step-desc} + 3px);
          }
          display: flex;
          justify-content: center;
          z-index: 15;
          width: 150px;

          .step-desc {
            cursor: default;
            display: flex;
            justify-content: center;
            background: $line-background;
            color: white;
            padding: 10px;
            height: $step-circle-size;
            font-size: 12px;
            @include mq($until: tablet) {
              font-size: 8px;
              height: 30px;
            }
            border-radius: $step-circle-border-size;
            @include box-shadow(0px 0px 8px 3px rgba(204,202,204, 0.20))

            &:after {
              @include arrow-up($line-background, $arrow-step-desc){
                position: absolute;
                top: -6px;
                width: 0;
                height: 0;
              }
            }
          }
        }
      }

      // Finished step
      .active {
        background: $line-background;
        height: 5px;
        width: 5px;
        z-index: 10;
        cursor: pointer;
        @include center-items-vh();

        border: $circle-border-size solid $line-background;
        @include mq($until: tablet) {
          border: calc(#{$circle-border-size} - 3px) solid $line-background;
        }
        border-radius: 50%;
        @include box-shadow(0px 5px 6px 1px rgba(204,202,204, 0.3));

        svg, i {
          margin-top: 2px;
          color: white;
        }

        &:hover {
          background: lighten($line-background, 10);
          border-color: lighten($line-background, 10);
        }
      }

      // Actual step
      .actual-active {
        height: $circle-active-size;
        width: $circle-active-size;
        @include mq($until: tablet) {
          height: $circle-active-size - 5px;
          width: $circle-active-size - 5px;
        }
        top: calc(50% - #{$circle-border-size});
        background: $body-bg;
        border: $line-size solid $line-background;
        border-radius: 50%;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        @include box-shadow(0px 5px 6px 1px rgba(204,202,204, 0.4));

        .center-point {
          position: absolute;
          background: $line-background;
          height: $circle-active-center-point-size;
          width: $circle-active-center-point-size;
          @include mq($until: tablet) {
            height: $circle-active-center-point-size - 5px;
            width: $circle-active-center-point-size - 5px;
          }
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
