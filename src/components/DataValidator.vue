<template>
  <form @submit="submit($event)">
    <label for="">Aprobación</label>

    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th style="width:1px">
            <input
              type="checkbox"
              name=""
              @click="checkField"
              checked="">
          </th>
          <th>Campo</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="field in sortedFields"
          :key="field.ref"
          @click="toogle(field.ref)">
          <td>
            <input
              type="checkbox"
              :checked="validity[field.ref]"
            />
          </td>
          <td>{{ field.label }}</td>
          <td><value-render :input="field" /></td>
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

    sortedFields() {
      return Object.values(this.fields
        .map(x => ({ k: [x.ref.split('.')[2]], val: x }))
        .reduce(
          (result, item) => ({
            ...result,
            [item.k]: [
              ...(result[item.k] || []),
              item.val,
            ],
          }),
          {},
        ),
      ).reduce((e1, e2) => e1.concat(e2));
    },
  },

  methods: {
    checkField(event) {
      this.fields.forEach((f) => {
        this.validity[f.ref] = event.target.checked;
      });
    },

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
};
</script>
