<template>
  <b-container class="p-0" fluid>
    <b-row no-gutters class="pb-3">
      <b-col>
        <slot name="top"></slot>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col cols="3"
        class="pr-3 d-none d-md-block d-xl-none d-lg-block d-xl-block">
        <slot name="left"></slot>
      </b-col>

      <b-col cols="12" md="9">
        <div class="d-block d-sm-none d-none d-sm-block d-md-block d-md-none">
          <slot name="section-dropdown"></slot>
        </div>
        <slot name="right"></slot>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'BaseLayout',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
