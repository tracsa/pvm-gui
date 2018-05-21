<template>
  <form @submit="submit($event)">
    <label for="">Aprobación</label>
    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th style="width:1px"></th>
          <th>Campo</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="field in fields"
          :key="field.ref"
          @click="toogle(field.ref)">
          <td>
            <input
              type="checkbox"
              :checked="validity[field.ref]"
            />
          </td>
          <td>{{ field.label }}</td>
          <td v-if="field.type === 'file'">
            <a
              v-if="field.value"
              target="_blank"
              :href="field | toURI">
              <icon :icon="['fa', 'file']" />
              {{ field.value.name }}
            </a>
          </td>
          <td v-else>{{ input | formInput }}</td>
        </tr>
      </tbody>
    </table>

    <div class="form-group">
      <label for="">
        Comentario
        <small
          class="text-info"
          v-if="!response">
          {{ $t('commons.required') }}
        </small>
      </label>
      <textarea
        class="form-control"
        v-model="comment"
      />
    </div>

    <div>
      <button
        class="btn"
        :class="{
          'btn-success': response,
          'btn-danger': !response
        }"
        :disabled="sending || (!response && !comment)">
        <span v-if="sending">{{ $t('commons.sending') }}</span>
        <span v-else-if="response">{{ $t('commons.approve') }}</span>
        <span v-else>{{ $t('commons.reject') }}</span>
      </button>
    </div>
  </form>
</template>

<script>
import moment from 'moment';
import settings from '@/settings';


export default {
  props: ['fields', 'sending', 'errors'],
  data() {
    return {
      validity: {},
      comment: '',
    };
  },
  mounted() {
    this.validity = this.fields.reduce((sum, field) => {
      // jslint
      const ref = sum;

      ref[field.ref] = true;

      return ref;
    }, {});
  },
  computed: {
    response() {
      const varr = this.fields.map(field => this.validity[field.ref]);
      const response = varr.reduce((b, v) => b && v, true);

      return response;
    },
  },
  methods: {
    toogle(ref) {
      this.validity[ref] = !this.validity[ref];
    },
    submit(event) {
      event.preventDefault();

      const validation = {
        response: this.response ? 'accept' : 'reject',
        comment: this.comment,
      };

      if (!this.response) {
        validation.inputs = this.fields
          .filter(field => !this.validity[field.ref])
          .map(field => ({ ref: field.ref }));
      }

      this.$emit('submit', validation);
    },
  },
  filters: {
    toURI(input) {
      const { protocol, host, port } = settings.doqer;
      const { value } = input;

      return `${protocol}://${host}:${port}/api/documents/${value.id}`;
    },
    formInput(data) {
      let value;
      let mapping;

      switch (data.type) {
        case 'select':
        case 'radio':
          value = data.options
            .filter(option => option.value === data.value)
            .map(option => option.label)
            .join('');
          break;
        case 'checkbox':
          mapping = data.options
            .reduce((map, option) => map.set(option.value, option.label), new Map());
          value = data.value.map(val => mapping.get(val)).join(', ');
          break;
        case 'date':
          value = moment(data.value).format('DD/HH/YYYY');
          break;
        case 'datetime':
          value = moment(data.value).format('DD/HH/YYYY HH:mm');
          break;
        default:
          value = data.value;
          break;
      }

      return value;
    },
  },
};
</script>
