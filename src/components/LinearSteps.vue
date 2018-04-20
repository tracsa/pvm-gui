<template>
  <div class="container-linear">
    <div 
      class="row line">
      <div 
        v-for="step in steps"
        class="col">
        <div 
          v-if="step.active"
          class="active">
            <icon :icon="['fas', 'check']" />
          </div>
        <div
          v-else
          class="no-active">
        </div>
          <div 
            class="step-desc">
              {{ step.desc }}
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['steps'],
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

$circle-border-size: 20px;
$line-background: #4C84FF;

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

    }

    .col {
      position: relative;
      height: 4px;
      background: $line-background;
      -webkit-box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);
      -moz-box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);
      box-shadow: 0px 0px 29px -3px rgba(73,128,248,0.55);

        .step-desc {
          position: absolute;
          top: 30px;
          left: -5px;
          display: inline-block;
          padding: 10px;
          background: white;
          font-size: 12px;
          border-radius: 10px;
          -webkit-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);
          -moz-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);
          box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.12);

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
          height: 5px;
          width: 5px;
          left: 0;
          top: calc(50% - #{$circle-border-size});
          background: red;
          border: $circle-border-size solid yellow;
          border-radius: 50%;
          z-index: 10;
          -webkit-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);
          -moz-box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);
          box-shadow: 0px 5px 6px 1px rgba(204,202,204, 0.4);
        }

        .no-active {
          position: absolute;
          height: 5px;
          width: 5px;
          left: 0;
          top: calc(50% - #{$circle-border-size});
          background: white;
          border: $circle-border-size solid white;
          border-radius: 50%;
          z-index: 10;
        }

    }
  }
}

</style>
