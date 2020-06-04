<template>
  <b-container>
    <hr/>

    <b-row>
      <b-col class="text-right">
        <small class="text-muted">
          <span
            v-if="pointerPatch"
          >Tarea cancelada por invalidación de información en proceso</span>
          <span
            v-else
          >Tarea cancelada</span>
        </small>
      </b-col>
    </b-row>

    <b-row
      v-if="pointerPatch"
    >
      <b-col
        class="font-italic mt-3"
      ><span>{{ pointerPatch.comment }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: [
    'pointerId',
    'pointerPatch',
  ],
};
</script>
