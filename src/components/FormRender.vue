<template>
  <form
    @submit="submit($event)">
    <div
      v-for="form in forms"
      :key="form.ref">
      <pre>{{ JSON.stringify(instances[form.ref], null, ' ') }}</pre>
      <form-instance
        v-for="instance in instances[form.ref]"
        :schema="form"
        :data="instance"
      />
    </div>

    <div>
      <button
        v-if="!sending"
        class="btn btn-primary">
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
