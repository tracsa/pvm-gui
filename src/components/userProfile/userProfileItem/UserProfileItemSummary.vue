<template>
  <b-container fluid>
    <b-row>
      <b-col
        cols="8"
        class="text-truncate"
      ><b>{{ pointerName }}</b><br/>
        <small>En <b>{{ executionName }}</b></small>
      </b-col>

      <b-col
        cols="4"
        class="text-right"
      >
        <small
          class="text-muted"
          :title="startedAt|fmtDate('LLLL')"
        >{{ startedAt|fmtDate('l') }}</small>
      </b-col>
    </b-row>

    <b-row
      class="mt-3"
    >
      <b-col
        class="text-right"
      >
        <b-popover
          v-if="assignees.length"
          :target="assigneesPopoverId"
          triggers="focus"
          placement="bottomright"
          title="Usuarios asignados"
        >
          <div>
            <div
              v-for="assignee in assignees"
              class="mt-2"
              :key="assignee.id"
            >
              <b>{{ assignee.fullname }}</b><br/>
              <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
            </div>
          </div>
        </b-popover>

        <a
          v-if="assignees.length"
          href="javascript:void(0)"
          :id="assigneesPopoverId"
        >
          <small>Asignada a <b>{{ assignees[0].fullname }}</b>
            <span
              v-if="assignees.length > 1"
            >y <b>{{ assignees.length - 1 }}</b> más</span>
          </small>
        </a>

        <span v-else>
          <small>Sin usuarios asignados</small>
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment';

export default {
  props: [
    'pointerId',
    'pointerName',
    'executionName',
    'startedAt',
    'assignees',
  ],

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    assigneesPopoverId() {
      const vm = this;
      const modalId = `assignees-popover-${vm.pointerId}`;

      return modalId;
    },
  },
};
</script>
