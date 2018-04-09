<template>
  <div class="p-3">
    <form @submit="submit($event)">
      <div class="form-group">
        <label for="file-name">Name</label>
        <input
          id="file-name"
          type="text"
          v-model="name"
          class="form-control"
        />
      </div>

      <div class="document mb-3">
        <img src="../../assets/document.png" alt="" />
        <div style="display:inline-block">
          <div>{{ name }}.{{ extension }}</div>
          <div><small>{{ size | bytes }}</small></div>
        </div>
      </div>

      <div class="form-group">
        <button class="btn btn-info">Subir</button>
        <button
          class="btn btn-link"
          @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import settings from '@/settings';

export default {
  props: ['file'],
  data() {
    return {
      name: '',
      extension: '',
      size: '',
    };
  },
  mounted() {
    const { file } = this;

    const name = file.name.split('.');
    if (name.length > 1) {
      this.extension = name.splice(-1)[0];
    }

    this.name = name.join('.');
    this.size = file.size;
  },
  methods: {
    cancel: function cancel(event) {
      event.preventDefault();

      this.$emit('cancel');
    },
    submit: function submit(event) {
      event.preventDefault();

      const { file } = this;

      // Prepare request
      const xhr = new XMLHttpRequest();
      const { protocol, host, port } = settings.doqer;

      xhr.open('POST', `${protocol}://${host}:${port}/api/documents`, true);

      xhr.upload.onprogress = this.onUploadProgress.bind(this);
      xhr.onload = this.onUploadComplete.bind(this);

      const formData = new FormData();
      formData.append('document', file);
      formData.append('name', this.name);

      xhr.send(formData);
    },

    onUploadProgress: function onUploadProgress(event) {
      if (event.lengthComputable) {
        this.loaded = event.loaded;
        this.total = event.total;
      }
    },

    onUploadComplete: function onUploadComplete(event) {
      const xhr = event.target;
      const res = JSON.parse(xhr.response);

      if (res && res.data && res.data.id) {
        this.$emit('uploaded', res.data);
      } else {
        throw new Error('Unexpected');
      }
    },
  },
  filters: {
    bytes: function bytes(num) {
      let byteCount = Number(num);
      if (isNaN(byteCount)) {
        throw new TypeError('Expected a number');
      }

      const neg = byteCount < 0;
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      if (neg) {
        byteCount = -byteCount;
      }

      let negString = '';
      if (neg) {
        negString = '-';
      }

      if (byteCount < 1) {
        return `${negString}${byteCount} B`;
      }

      const exponent = Math.min(Math.floor(Math.log(byteCount) / Math.log(1024)), units.length - 1);
      byteCount = (byteCount / (1024 ** exponent)).toFixed(2) * 1;
      const unit = units[exponent];

      return `${negString}${byteCount} ${unit}`;
    },
  },
};
</script>
