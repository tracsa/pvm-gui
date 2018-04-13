<template>
  <form
    @submit="submit($event)">
    <div
      v-for="form in forms"
      :key="form.ref">
      <pre>{{ JSON.stringify(instances[form.ref], null, ' ') }}</pre>
      <form-instance
        v-for="instance in instances[form.ref]"
        :class="{ multiple: form.multiple }"
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

      <button
        class="btn btn-link">
        {{ $t('commons.cancel') }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: ['forms'],
  data() {
    return {
      instances: {},
      sending: false,
    };
  },
  mounted() {
    this.instances = this.defaultFormsValue(this.forms);
    this.sending = false;
  },
  watch: {
    forms() {
      this.instances = this.defaultFormsValue(this.forms);
      this.sending = false;
    },
  },
  computed: {
    isValid: function isValid() {
      return this.forms
        .map((form) => {
          const { ref, inputs } = form;
          const instances = this.instances[ref] || [];

          return instances
            .map(instance => {
              return inputs
                .map((input) => {
                  const value = instance[input.name];

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
                .reduce((ans, bool) => ans && bool, true);
            })
            .reduce((ans, bool) => ans && bool, true);
        })
        .reduce((ans, bool) => ans && bool, true);
    },
  },
  methods: {
    defaultInputValue: function (input) {
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
    defaultFormValue: function (form) {
      return form.inputs
        .map(input => [input.name, this.defaultInputValue(input)])
        .reduce((obj, row) => {
          obj[row[0]] = row[1];
          return obj;
        }, {});
    },
    defaultFormsValue: function (forms) {
      return forms.reduce((instances, form) => {
        instances[form.ref] = [
          this.defaultFormValue(form),
        ];

        return instances;
      }, {});
    },
    appendForm: function (form) {
      const instance = this.defaultFormValue(form);

      if (this.instances[form.ref] !== undefined) {
        this.instances[form.ref].push(instance);
      }
    },
    submit: function submit(event) {
      event.preventDefault();
      this.sending = true;

      const formArray = [];
      for (let ref in this.instances) {
        this.instances[ref].forEach(instance => {
          const data = Object.assign({}, instance);
          const form = {
            ref,
            data,
          };

          formArray.push(form);
        });
      }

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
