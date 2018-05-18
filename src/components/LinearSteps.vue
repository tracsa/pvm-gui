<template>
  <div v-if="steps.length > 1" class="container-linear d-none d-md-block">
    <div
      class="row line">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="{
          'col': true,
          'no-active': !step.active || step.active === 2 || index === actualStep,
        }">
          <div class="container-step">
            <div
              v-if="index === actualStep"
              class="actual-active">
              <div class="center-point"></div>
            </div>
            <div
              v-else-if="step.active == 1"
              class="active">
                <icon :icon="['fas', 'check']" />
            </div>
            <div
              v-else
              class="no-active">
            </div>

            <div class="container-step-desc">
              <div
                v-if="step.desc"
                class="step-desc">
                  {{ step.desc }}
              </div>
            </div>
          </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['steps'],
  data() {
    return { actualStep: null };
  },
  mounted() {
    let actualStep = null;
    this.steps.forEach((step, index) => {
      if (actualStep === null && step.active !== 1) {
        actualStep = index;
      }
    });
    this.actualStep = actualStep;
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

$arrow-step-desc: 7px;
$circle-border-size: 20px;
$step-circle-size: 35px;
$step-circle-border-size: 10px;
$line-background: #4C84FF;
$line-size: 4px;
$line-no-active-step: #D8D8D8;
$circle-no-active-border-size: 4px;
$circle-no-active-bg: 40px;
$circle-active-size: 40px;
$circle-active-center-point-size: 20px;

.container-linear {
  padding: 20px 20px;
  padding-bottom: 80px;

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

      // Unfinished step
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
            display: flex;
            justify-content: center;
            background: white;
            color: #75777e;
            padding: 10px;
            height: $step-circle-size;
            font-size: 12px;
            @include mq($until: tablet) {
              font-size: 8px;
              height: 30px;
            }
            border-radius: $step-circle-border-size;
            @include box-shadow(0px 5px 6px 1px rgba(204,202,204, 0.12))

            &:after {
              @include arrow-up(white, $arrow-step-desc){
                position: absolute;
                top: -4px;
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
