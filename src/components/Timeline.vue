<template>
  <div class="timeline-container">
    <div class="left-content">
      
    </div>
    <div class="vertical-line"></div>
    <div class="timeline">
      <div class="box">
        <div class="title">
          <span>Ulises Castro.</span>
          <span>12 de abril a las 4:01</span>
        </div>
        <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente quidem distinctio nisi, tempore et, deserunt earum odit est dolorum repellendus dicta maxime expedita? Quo cupiditate deserunt in, reprehenderit cumque maiores!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../utils/auth';

export default {
  data() {
    return {
      username: '',
    };
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.timeline-container {
  display: flex;
  
  .vertical-line {
    background: $gray-300;
    height: 300px;
    width: 5px;
  }

  .left-content {
    flex-grow: 1;
  }

  .timeline {
    flex-grow: 1;

    .box {
      background: white;
      max-width: 350px;
      max-height: 300px;
      box-shadow: 0 2px 2px $gray-300;
      border: 1px solid $gray-300;

      .title {
        display: flex;

        span {
          flex-grow: 1;

          & + span {
            
          }
        }
      }

      .content {
        height: 100%;
        padding: 10px;
      }

    }
  }
}

</style>
