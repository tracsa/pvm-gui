<template>
  <div class="card">
    <div class="card-header">
      <div style="font-size:16px;float:right;">
        <router-link :to="{ name: 'processes' }">
          <icon :icon="['fas', 'times']" />
        </router-link>
      </div>
      <span>{{ model.name }}</span>
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
            <div v-if="input.type == 'datetime'">
              <div class="row">
                <div class="col">
                  <datepicker
                    :bootstrap-styling="true"
                    v-model="form[input.name]"
                  />
                </div>
                <div class="col">
                  <timepicker
                    :value="form[input.name]"
                    @change="datetime => form[input.name] = datetime"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <input
                :id="`${formIt.ref}/${input.name}`"
                :type="input.type"
                :name="input.name"
                class="form-control"
                :placeholder="input.placeholder"
                v-model="form[input.name]"
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
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/utils/api';

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

      const formArray = this.model.form_array.map((formIt) => {
        const inputs = formIt.inputs;
        const formData = {};
        inputs
          .map(input => [input.name, this.form[input.name]])
          .forEach(([key, value]) => {
            formData[key] = value;
          });

        return {
          ref: formIt.ref,
          data: formData,
        };
      });

      const postData = {
        process_name: this.model.id,
        form_array: formArray,
      };

      post('/execution', postData, 'application/json')
        .then((data) => {
          console.log('data', data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
