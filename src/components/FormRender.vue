<template>
  <form
    @submit="submit($event)">
    <div
      v-for="(form, index) in forms"
      :key="form.ref">
      <form-instance
        v-for="(instance, key) in instances[form.ref]"
        :key="key"
        :class="{ multiple: form.multiple }"
        :errors="errors[index]"
        :schema="form"
        :data="instance"
      />
      <div
        v-if="form.multiple"
        class="duplicator"
        @click="appendForm(form)">
        <icon :icon="['far', 'copy']" /> Agregar
      </div>
    </div>

    <div>
      <button
        v-if="!sending"
        class="btn btn-primary"
        :disabled="!isValid">
        {{ $t('commons.send') }}
      </button>

      <button
        v-else
        class="btn btn-primary"
        :disabled="true">
        {{ $t('commons.sending') }}
      </button>

      <router-link :to="{ name: 'processes' }">
        {{ $t('commons.cancel') }}
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  props: ['forms', 'errors'],
  data() {
    return {
      instances: {},
      sending: false,
    };
  },
  mounted() {
    this.instances = this.defaultFormsValue(this.forms);
  },
  watch: {
    forms() {
      this.sending = false;
      this.instances = this.defaultFormsValue(this.forms);
    },
  },
  computed: {
    isValid: function isValid() {
      for (let i = 0; i < this.forms.length; i += 1) {
        const { ref, inputs } = this.forms[i];
        if (this.instances[ref] !== undefined) {
          const instances = this.instances[ref];

          for (let j = 0; j < instances.length; j += 1) {
            for (let k = 0; k < inputs.length; k += 1) {
              const input = inputs[k];
              const value = instances[j][input.name];

              if (input.required && !value) {
                return false;
              }

              if (input.regex) {
                const regex = new RegExp(input.regex);
                if (!regex.test(value)) {
                  return false;
                }
              }
            }
          }
        }
      }

      return true;
    },
  },
  methods: {
    defaultInputValue(input) {
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

      return defaultValue;
    },
    defaultFormValue(form) {
      const formData = {};
      form.inputs
        .forEach((input) => {
          formData[input.name] = this.defaultInputValue(input);
        });

      return formData;
    },
    defaultFormsValue(forms) {
      const instances = {};

      forms.forEach((form) => {
        instances[form.ref] = [
          this.defaultFormValue(form),
        ];
      });

      return instances;
    },
    appendForm(form) {
      const instance = this.defaultFormValue(form);

      if (this.instances[form.ref] !== undefined) {
        this.instances[form.ref].push(instance);
      }
    },
    submit(event) {
      event.preventDefault();
      this.sending = true;

      const formArray = [];
      Object.keys(this.instances).forEach((ref) => {
        this.instances[ref].forEach((instance) => {
          const data = Object.assign({}, instance);
          const form = {
            ref,
            data,
          };

          formArray.push(form);
        });
      });

      this.$emit('submit', formArray);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

.multiple {
  border-left: 3px solid $info;
  padding: 0 0 1em 1em;

  .form-group {
    margin-bottom: 0;
  }
}

.duplicator {
  cursor: pointer;
  background: $info;
  color: white;
  padding: 4px 10px;
  font-size: .9em;
  margin-bottom: 1em;
  display: inline-block;
}
</style>
