<template>
  <div
    class="doqer-file --above"
    :class="{ open: open }">
    <div v-if="selected !== null">
      <div class="file-selected">
        <div class="row">
          <div class="col">
            <icon :icon="['fas', 'file']" />
            {{ selected.id }}
          </div>
          <div class="col text-right pt-1" style="font-size: 0.8em;">
            <icon :icon="['fas', 'times']" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="selected === null">
      <input
        class="query-input form-control"
        type="text"
        v-model="query"
        @focus="focus"
        @blur="blur"
      />
    </div>

    <div class="helper-window">
      <div v-if="action === 'suggest'">
        <doqer-suggest :query="query" />

        <div class="create-file p-2">
          <div class="custom-file">
            <input
              type="file"
              class="custom-file-input"
              id="validatedCustomFile"
              @change="uploadFile($event)"
            />
            <label class="custom-file-label" for="validatedCustomFile">Nuevo documento</label>
          </div>
        </div>
      </div>

      <div v-if="action === 'create'">
        <doqer-create
          :file="file"
          @uploaded="selectFile"
          @cancel="action = 'suggest'"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      action: 'suggest',
      query: '',
      focused: false,
      file: null,
      selected: null,
    };
  },
  computed: {
    open() {
      let open = false;
      switch (this.action) {
        case '':
          open = false;
          break;
        case 'suggest':
          open = this.focused;
          break;
        case 'create':
          open = true;
          break;
      }

      return open;
    },
  },
  methods: {
    focus: function focus() {
      this.focused = true;
    },
    blur: function blur() {
      setTimeout(() => {
        this.focused = false;
      }, 200);
    },
    uploadFile: function uploadFile(event) {
      const file = event.target.files[0];

      this.action = 'create';
      this.file = file;
    },
    selectFile: function selectFile(file) {
      this.action = '';
      this.selected = file;

      const fileRef = {
        id: file.id,
        name: file.id,
        mime: file.attributes.mimetype,
        type: 'doqer:file',
      };

      this.$emit('change', fileRef);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

$input-height: 38px;

.doqer-file {
  position: relative;

  .helper-window {
    display: none;
  }

  &.open .helper-window {
    display: block;
  }

  &.--bellow {
    input.query-input {
      border-radius: $border-radius $border-radius 0 0;
    }

    .helper-window {
      border-top-width: 0px;
      border-radius: 0 0 $border-radius $border-radius;
    }
  }

  &.--above {
    input.query-input {
      border-radius: 0 0 $border-radius $border-radius;
    }

    .helper-window {
      bottom: $input-height;
      border-bottom-width: 0px;
      border-radius: $border-radius $border-radius 0 0;
    }
  }
}

.helper-window {
  position: absolute;
  z-index: 1;
  background: white;
  border: 1px solid $input-focus-border-color;
  width: 100%;
}

.create-file {
  border-top: 1px solid $gray-400;
  background: $gray-200;
}

.custom-file-input {
  cursor: pointer;
}

.custom-file-label::after {
  background-color: $purple;
  color: white;
}

.file-selected {
  background-color: #fff;
  border: 1px solid $gray-400;
  padding: 6px 10px;
  border-radius: 3px;
  color: $gray-700;
}
</style>
