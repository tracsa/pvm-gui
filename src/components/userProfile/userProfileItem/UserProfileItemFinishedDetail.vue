<template>
  <div>
    <b-container>
      <hr/>

      <b-row>
        <b-col
          cols="8"
          class="text-truncate"
        >
          Realizada por <b>{{ actors[0].fullname }}</b>
          <span v-if="actors.length > 1"
            >y {{ actors.length - 1 }} más</span>
        </b-col>

        <b-col
          cols="4"
          class="text-right"
        >
          <small
            class="text-muted"
            :title="finishedAt|fmtDate('LLLL')"
          >{{ finishedAt|fmtDate('l') }}</small>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <hr/>

      <b-row>
        <b-col class="text-right">
          Mostrar más
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: [
    'pointerId',
    'finishedAt',
    'actors',
  ],

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },
};
</script>
