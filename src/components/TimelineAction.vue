<template>
  <div
    v-else-if="actualScene === 'task' && action.notified_users.length > 1"
    class="card leyend-text">
    <div class="card-body">
      <small>{{ $t('timeline.asignTasks') }}</small>
      <b
        v-for="iuser in action.notified_users"
        v-if="iuser.identifier !== user.identifier"
        :key="iuser.id">
        {{ iuser.fullname }}&nbsp;
      </b>
    </div>
  </div>
</template>
