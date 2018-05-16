<template>
  <form @submit="submit($event)">
    <label for="">Aprobación</label>
    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th style="width:1px"></th>
          <th>Campo</th>
          <th>Valor</th>
          <th>Dueño</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="field in fields"
          :key="field.ref"
          @click="toogle(field.ref)"
          >
          <td>
            <input
              type="checkbox"
              :checked="validity[field.ref]"
            />
          </td>
          <td>{{ field.label }}</td>
          <td>{{ field.value }}</td>
          <td>Og</td>
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
        validation.fields = this.fields
          .filter(field => !this.validity[field.ref])
          .map(field => ({ ref: field.ref }));
      }

      this.$emit('submit', validation);
    },
  },
};
</script>
