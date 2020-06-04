<template>
  <b-card
    class="py-3"
    no-body
  >
    <ca-user-profile-item-summary
      :pointerId="pointer.id"
      :pointerName="pointer.node.name"
      :executionName="pointer.execution.name"
      :startedAt="pointer.started_at"
      :assignees="assignees"
    />

    <ca-user-profile-item-finished-detail
      v-if="pointer.state === 'finished'"
      :pointerId="pointer.id"
      :finishedAt="pointer.finished_at"
      :actors="actors"
    />

    <ca-user-profile-item-cancelled-detail
      v-if="pointer.state === 'cancelled'"
      :pointerId="pointer.id"
      :pointerPatch="pointer.patch"
    />
  </b-card>
</template>

<script>
export default {
  props: ['pointer'],

  computed: {
    actors() {
      const vm = this;

      if (vm.pointer.actors.items) {
        const actorsList = [];

        Object.values(vm.pointer.actors.items).forEach((item) => {
          actorsList.push({
            identifier: item.user.identifier,
            fullname: item.user.fullname,
          });
        });
        return actorsList;
      }

      return [];
    },

    assignees() {
      return this.pointer.notified_users.map(user => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      }));
    },

  },
};
</script>
