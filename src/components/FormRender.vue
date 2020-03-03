<template>
  <form
    @submit="submit($event)">

    <div
      v-for="(form, index) in forms"
      :key="form.ref"
    >
      <!-- Simple forms -->
      <div
        v-if="!form.multiple"
        class="border-top border-left border-info"
      >
        <form-instance
          v-for="(instance, key) in instances[form.ref]"
          class="p-3"
          :key="key"
          :errors="errors[index]"
          :schema="form"
          :data="instance"
        />
      </div>

      <!-- Multiple forms -->
      <b-tabs
        v-else
        class="border-top border-left border-info"
        pills
      >
        <b-tab
          v-for="(instance, key) in instances[form.ref]"
          class="p-3"
          :key="key"
          :title="'' + (key + 1)">
          <form-instance
            :errors="errors[index]"
            :schema="form"
            :data="instance"
          />

          <b-button
            variant="warning"
            v-if="instances[form.ref].length > 1"
            @click="removeForm(form, key)">
            <icon :icon="['fa', 'trash']" /> Eliminar
          </b-button>

        </b-tab>

        <template v-slot:tabs-end>
          <b-nav-item @click.prevent="appendForm(form)"><b>+</b></b-nav-item>
        </template>
      </b-tabs>


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

      <router-link :to="{ name: 'processes' }" replace>
        {{ $t('commons.cancel') }}
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  props: [
    'forms',
    'prevWork',
    'errors',
    'sending',
  ],
  data() {
    return {
      instances: {},
    };
  },
  mounted() {
    this.instances = this.defaultFormsValue(this.forms);
  },
  watch: {
    forms() {
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
        case 'link':
          defaultValue = {
            label: '',
            href: '',
          };
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
      let instances = {};

      if (this.prevWork !== undefined) {
        instances = this.prevWork.reduce((insts, formState) => {
          const instsRef = insts;
          const inputsState = formState.inputs;
          const inputs = inputsState.item_order.reduce((obj, key) => {
            const ref = obj;
            const inputState = inputsState.items[key];
            ref[key] = inputState.value;

            if (ref[key] === null) {
              ref[key] = this.defaultInputValue(inputState);
            }

            return ref;
          }, {});

          if (instsRef[formState.ref] === undefined) {
            instsRef[formState.ref] = [];
          }

          instsRef[formState.ref].push(inputs);

          return instsRef;
        }, {});
      } else {
        forms.forEach((form) => {
          instances[form.ref] = [
            this.defaultFormValue(form),
          ];
        });
      }

      return instances;
    },
    appendForm(form) {
      const instance = this.defaultFormValue(form);

      if (this.instances[form.ref] !== undefined) {
        this.instances[form.ref].push(instance);
      }
    },
    removeForm(form, key) {
      if (this.instances[form.ref] !== undefined) {
        this.instances[form.ref].splice(key, 1);
      }
    },
    submit(event) {
      event.preventDefault();

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
@import '../styles/_variables.scss';
</style>
