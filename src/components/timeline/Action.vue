<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col">
          {{ action.node.name }} —
          <small>{{ action.finished_at }}</small>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div
        v-for="(actor, identifier) in action.actors.items"
        :key="identifier">
        <div v-if="actor">
          <p>
            <b>{{ actor.user.fullname }}</b>
            llenó la siguiente información
          </p>
          <table class="table table-sm table-bordered">
            <tbody
              v-for="(form, key) in actor.forms"
              :key="key">
              <tr class="form-group">
                <td
                  :title="`#${form.ref}`"
                  :rowspan="form.inputs.item_order.length + 1">
                </td>
              </tr>
              <tr
                v-for="input in form.inputs.item_order.map(key => form.inputs.items[key])"
                :key="input.name">
                <td scope="row">{{ input.label }}</td>
                <td v-if="input.type === 'file'">
                  <a
                    target="_blank"
                    :href="input | toURI">
                    <icon :icon="['fa', 'file']" />
                    {{ input.value.name }}
                  </a>
                </td>
                <td v-else>{{ input }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['action'],
};
</script>
