<template>
  <div class="container-linear">
    <div 
      class="row line">
      <div 
        v-for="(step, index) in steps"
        :class="{ 
          'col': true, 
          'no-active': !step.active || index === actualStep,  
        }">
        <div
          v-if="index === actualStep"
          class="actual-active">
          <div class="center-point"></div>
        </div>
        <div 
          v-else-if="step.active"
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
</template>

<script>
export default {
  props: ['steps'],
  data() {
    let step = null;
    this.steps.map(function(s, i) {
      if(step === null && !s.active) step = i;
    });
    return {
      actualStep: step,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

$arrow-step-desc: 7px;
$circle-border-size: 20px;
$step-circle-size: 35px;
$step-circle-border-size: 10px;
$line-background: #4C84FF;
$line-size: 4px;
$line-no-active-step: #e7e7e7;
$circle-no-active-border-size: 4px;
$circle-no-active-bg: 40px;

.container-linear {
  padding: 50px 0;
  padding-bottom: 80px;

  .line {
    margin: 0;

    .col:last-child {
      flex-grow: initial;

      .active, .no-active, .actual-active {
        right: 15px;
      }

      .container-step-desc {
        right: 0;
        justify-content: end;
      }

    }

    .col {
      position: relative;
      height: $line-size;
      background: $line-background;
      -webkit-box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);
      -moz-box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);
      box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);

      .container-step-desc {
        position: absolute;
        top: 30px;
        left: -8px;
        // right: calc(50% + ((#{$step-circle-size} - 5px) / 2));
        display: flex;
        justify-content: center;
        z-index: 15;

        .step-desc {
          display: flex;
          justify-content: center;
          background: white;
          color: #75777e;
          padding: 10px;
          height: $step-circle-size;
          font-size: 12px;
          border-radius: $step-circle-border-size;
          -webkit-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);
          -moz-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);
          box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);
          
          &:after {
            position: absolute;
            top: -4px;
            content: '';
            width: 0;
            height: 0;
            border-left: $arrow-step-desc solid transparent;
            border-right: $arrow-step-desc solid transparent;
            border-bottom: $arrow-step-desc solid white;
          }
        }

      }

      &.no-active {
        background: $line-no-active-step;

        .no-active {
          position: absolute;
          height: $circle-no-active-bg;
          width: $circle-no-active-bg;
          left: 0;
          top: calc(50% - #{$circle-border-size});
          background: $body-bg;
          border: $line-size solid $line-no-active-step;
          border-radius: 50%;
          z-index: 10;
        }
      }

        .active {
          position: absolute;
          height: 5px;
          width: 5px;
          top: calc(50% - #{$circle-border-size});
          background: $line-background;
          border: $circle-border-size solid $line-background;
          border-radius: 50%;
          z-index: 10;
          left: 0;
          -webkit-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.3);
          -moz-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.3);
          box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.3);

          svg {
            position: absolute;
            top: -7px;
            right: -8px;
            color: white;
          }
        }

        .actual-active {
          position: absolute;
          height: 40px;
          width: 40px;
          left: 0;
          top: calc(50% - #{$circle-border-size});
          background: $body-bg;
          border: $line-size solid $line-background;
          border-radius: 50%;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          -webkit-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);
          -moz-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);
          box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);

          .center-point {
            position: absolute;
            background: $line-background;
            height: 20px;
            width: 20px;
            border-radius: 50%;
          }
        }

    }
  }
}

</style>
