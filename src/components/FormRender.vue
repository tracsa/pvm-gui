<template>
  <form
    @submit="submit($event)">
    <div
      v-for="input in form.inputs"
      :key="input.name"
      class="form-group">
      <label :for="`${form.ref}/${input.name}`">
        {{ input.label }}
        <small
          class="text-info"
          v-if="input.required">
          {{ $t('commons.required') }}
        </small>
      </label>

      <div v-if="input.type === 'date'">
        <date-input
          :bootstrap-styling="true"
          v-model="formData[input.name]"
        />
      </div>
      <div v-else-if="input.type === 'datetime'">
        <datetime-input
          :value="formData[input.name]"
          @change="datetime => formData[input.name] = datetime"
        />
      </div>
      <div v-else-if="input.type === 'select'">
        <select
          :id="`${form.ref}/${input.name}`"
          class="custom-select"
          v-model="formData[input.name]"
          :placeholder="input.placeholder">
          <option
            v-for="option in input.options"
            :key="option.value"
            :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div v-else-if="input.type === 'checkbox' || input.type === 'radio'">
        <div
          v-for="option in input.options"
          :key="option.value"
          class="custom-control"
          :class="`custom-${input.type}`">
          <input
            class="custom-control-input"
            :id="`${form.ref}/${input.name}-${option.value}`"
            :type="input.type"
            :value="option.value"
            v-model="formData[input.name]"
          />
          <label
            class="custom-control-label"
            :for="`${form.ref}/${input.name}-${option.value}`">
            {{ option.label }}
          </label>
        </div>
      </div>
      <div v-else-if="input.type === 'file' && input.provider == 'doqer'">
        <doqer-input @change="file => formData[input.name] = file" />
      </div>
      <div v-else>
        <input
          :id="`${form.ref}/${input.name}`"
          :type="input.type"
          :name="input.name"
          class="form-control"
          :placeholder="input.placeholder"
          v-model="formData[input.name]"
        />
      </div>
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
        {{ $t('commons.send') }}
      </button>
      <router-link :to="{ name: 'processes' }">
        {{ $t('commons.cancel') }}
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  props: ['form'],
  data() {
    return {
      formData: {},
    };
  },
  mounted() {
    this.clearForm();
  },
  watch: {
    form: function() {
      this.clearForm();
    }
  },
  computed: {
    isValid: function isValid() {
      const inputs = this.form.inputs;

      return inputs
        .map((input) => {
          const value = this.formData[input.name];

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
    },
  },
  methods: {
    clearForm: function clearForm() {
      const formData = {};
      this.form.inputs.forEach((input) => {
        let defaultValue;
        switch (input.type) {
          case 'checkbox':
            defaultValue = [];
            if (input.default !== undefined) {
              defaultValue.push(input.default);
            }
            break;
          case 'doqer:file':
            defaultValue = null;
            break;
          default:
            defaultValue = '';
            if (input.default !== undefined) {
              defaultValue = input.default;
            }
            break;
        }

        formData[input.name] = defaultValue;
      });

      this.formData = formData;
    },
    submit: function submit(event) {
      event.preventDefault();

      const formInstance = {
        ref: this.form.ref,
        data: {},
      };

      this.form.inputs.forEach((input) => {
        formInstance.data[input.name] = this.formData[input.name];
      });

      this.$emit('submit', formInstance);
    },
  },
};
</script>
