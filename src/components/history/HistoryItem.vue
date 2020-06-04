<template>
  <b-card
    class="py-3"
    no-body
  >
    <b-container fluid>
      <b-row no-gutters>
        <b-col>
          <b>
            <router-link
              :to="{name: 'inbox-item', params: { id: execution.id }}"
              target="_blank"
            >{{ execution.name }}</router-link>
          </b>
          <br/>

          <small class="text-muted"
            v-if="execution.status"
          >
            Estado:
            <span
              v-if="execution.status === 'finished'"
            >Finalizado</span>
            <span
              v-else-if="execution.status === 'cancelled'"
            >Cancelado</span>
            <span
              v-else-if="execution.status === 'ongoing'"
            >En proceso</span>
          </small>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col>
          <small
          >Flujo iniciado el {{ execution.started_at|fmtDate('LLLL') }}</small>
        </b-col>
      </b-row>

    </b-container>

    <b-container>
      <hr/>

      <b-row no-gutters
        v-if="execution.finished_at"
      >
        <b-col>
          <small
          >Flujo terminado el {{ execution.finished_at|fmtDate('LLLL') }}</small>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import moment from 'moment';

export default {
  props: ['execution'],

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },
};
</script>
