<template>
  <hero
    icon="spinner"
    title="Cargando"
    desc="Estamos por redirigirte a tu tarea"
    spin
  />
</template>

<script>
import { get } from '../utils/api';

export default {
  mounted() {
    const pointerId = this.pointerId;

    get(`/pointer/${pointerId}`)
      .then((body) => {
        const pointer = body.data;
        const { execution } = pointer;
        this.$router.replace(`/inbox/${execution.id}/${pointerId}`);
      })
      .catch(() => {
        this.$router.replace('/inbox');
      });
  },
  computed: {
    pointerId() {
      const { id } = this.$route.params;
      if (!id) {
        return null;
      }

      return id;
    },
  },
};
</script>
