<template>
  <div class="card">
    <div class="card-header">
      <router-link to="processes">[close]</router-link>
      <h4>{{ model.name }}</h4>
    </div>
    <div class="card-body">
      <div
        v-for="form_it in model.form_array"
        :key="form_it.ref">
        <form>
          <div
            v-for="input in form_it.inputs"
            :key="input.name"
            class="form-group">
            <label :for="`${form_it.ref}/${input.name}`">
              {{ input.label }}
              <small
                class="text-info"
                v-if="input.required">
                {{ $t('commons.required') }}
              </small>
            </label>
            <input
              :id="`${form_it.ref}/${input.name}`"
              :type="input.type"
              :name="input.name"
              class="form-control"
              :placeholder="input.placeholder"
              v-model="form[input.name]"
            />
            <small
              class="form-text text-muted"
              v-if="input.helper">
              {{ input.helper }}
            </small>
          </div>

          <div>
            <button class="btn btn-primary">Send</button>
            <router-link to="processes">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/*
      <div class="card-subtitle mb-2 text-muted">{{ model.description }}</div>
      <pre>{{ JSON.stringify(model, null, ' ') }}</pre>
      <div
        v-for="form in model.form_array"
        :key="form.ref">
        <form>
          <div
            v-for="input in form.inputs"
            :key="input.name"
            class="form-group">
            <pre>{{ JSON.stringify(input, null, ' ') }}</pre>
          </div>
        </form>
      </div>
*/

export default {
  props: ['model'],
  data() {
    return {
      form: {
      },
    };
  },
}
</script>
