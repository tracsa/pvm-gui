<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div 
          v-for="d in data"
          class="card">
          <div class="card-body">
            <h4 class="card-title">
              {{d.title}}
            </h4>
            <p class="card-text">
              {{d.desc}}
            </p>
            <span class="card-time">
               — {{ d.time }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  props: ['data']
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