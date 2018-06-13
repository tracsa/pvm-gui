<template>
  <div class="timeline-action">
    <span
      class="timeline-dot"
      :class="{ 'dot-green': state, 'dot-red': !state }" />
    <div
      class="alert"
      :class="{ 'custom-alert-success': state, 'custom-alert-danger': !state }">
      <div
        v-for="actor in validation.actors.items"
        :key="actor.user.id">
        <span style="font-weight: bold;">
          {{ actor.user.fullname }}&nbsp;
        </span>

        <span>
          {{ actor.forms[0].inputs.items.comment.value }}
        </span>
      </div>

      <div>
        <span
          class="badge badge-primary"
          :class="{ 'badge-success': state, 'badge-danger': !state }">
          {{ state ? 'Aprobado' : 'Rechazado' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['validation'],
  computed: {
    state() {
      let state = true;
      Object.values(this.validation.actors.items).forEach((actor) => {
        for (let i = 0; i < actor.forms.length; i += 1) {
          const inputs = actor.forms[i].inputs.items;
          state = state && inputs.response.value === 'accept';
        }
      });

      return state;
    },
  },
};
</script>
