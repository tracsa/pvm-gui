<template>
  <div
    class="alert"
    :class="{ 'custom-alert-success': state, 'custom-alert-danger': !state }">
    <div>{{ validation.node.name }}</div>
    <div
      v-for="actor in validation.actors.items"
      :key="actor.user.id">
      <small style="font-weight: bold;">
        {{ actor.user.fullname }}&nbsp;
      </small>

      <small>
        {{ actor.forms[0].inputs.items.comment.value }}
      </small>
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
