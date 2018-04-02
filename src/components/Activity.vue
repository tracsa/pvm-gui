<template>
  <div class="card">
    <div class="card-header">
      <router-link to="processes">[close]</router-link>
      <h4>{{ model.name }}</h4>
    </div>
    <div class="card-body">
      <div
        v-for="formIt in model.form_array"
        :key="formIt.ref">
        <form
          @submit="submit($event)">
          <div
            v-for="input in formIt.inputs"
            :key="input.name"
            class="form-group">
            <label :for="`${formIt.ref}/${input.name}`">
              {{ input.label }}
              <small
                class="text-info"
                v-if="input.required">
                {{ $t('commons.required') }}
              </small>
            </label>
            <input
              :id="`${formIt.ref}/${input.name}`"
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
            <button
              class="btn btn-primary"
              :disabled="!isValid">
              Send
            </button>
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
  computed: {
    isValid: function isValid() {
      const forms = this.model.form_array;
      return forms
        .map((formIt) => {
          const inputs = formIt.inputs;

          return inputs
            .map((input) => {
              const value = this.form[input.name];

              if (input.required && !value) {
                return false;
              }

              if (input.regex) {
                const regex = new RegExp(input.regex);
                if (!regex.test(value)) {
                  return false;
                }
              }

              return true;
            })
            .reduce((bool, value) => (bool && value), true);
        })
        .reduce((bool, value) => (bool && value), true);
    },
  },
  methods: {
    submit: function submit(event) {
      event.preventDefault();
    },
  },
};
</script>
