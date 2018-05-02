<template>
  <div class="container">
    <div class="row">
        <div 
        v-for="step in steps"
        class="col">
          <router-link
          :to="{ path: `/step/${{step.id}}` }">
            <div 
            class="card">
              <div class="card-body">
                <h4 class="card-title">
                  {{ step.title }}
                </h4>
                <p class="card-text">
                  {{ step.desc }}
                </p>
                <span class="card-time">
                  $t('step.time')
                  {{ step.time }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['id'],
  data() {
    steps: [
      {
        title: 'Primer 1',
        desc: 'Este es el primer paso',
        time: '40 min',
      },
      {
        title: 'Primer 2',
        desc: 'Este es el primer segundo',
        time: '40 min',
      },
      {
        title: 'Primer 3',
        desc: 'Este es el primer tercero',
        time: '40 min',
      }
    ]
  },
};
</script>
<style lang="scss">
@import '../styles/variables.scss';

.card {
  .card-body {
    .card-time {
      font-size: 12px;
    }
  }
}
</style>