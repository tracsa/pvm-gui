<template>
  <div>
    <div
      v-for="input in schema.inputs"
      :key="input.name"
      class="form-group"
      :class="{ 'has-error': (errors && errors[input.name]) }">

      <label :for="`${input.name}-${uuid}`">
        {{ input.label }}
        <small
          v-if="input.required"
          class="text-danger">
          {{ $t('commons.required') }}
        </small>
        <small
          v-else
          class="text-info">
          {{ $t('commons.optional') }}
        </small>
      </label>

      <div v-if="input.type === 'date'">
        <date-input
          :bootstrap-styling="true"
          v-model="data[input.name]"
        />
      </div>
      <div v-else-if="input.type === 'datetime'">
        <datetime-input
          :value="data[input.name]"
          @change="datetime => data[input.name] = datetime"
        />
      </div>
      <div v-else-if="input.type === 'select'">
        <select
          :id="`${input.name}-${uuid}`"
          class="custom-select"
          v-model="data[input.name]"
          :placeholder="input.placeholder">
          <option
            v-for="option in input.options"
            :key="option.value"
            :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div v-else-if="input.type === 'checkbox' || input.type === 'radio'">
        <div
          v-for="option in input.options"
          :key="option.value"
          class="custom-control"
          :class="`custom-${input.type}`">
          <input
            class="custom-control-input"
            :id="`${input.name}-${option.value}-${uuid}`"
            :type="input.type"
            :value="option.value"
            v-model="data[input.name]"
          />
          <label
            class="custom-control-label"
            :for="`${input.name}-${option.value}-${uuid}`">
            {{ option.label }}
          </label>
        </div>
      </div>
      <div v-else-if="input.type === 'file' && input.provider == 'doqer'">
        <doqer-input
          :initial="data[input.name]"
          @change="file => data[input.name] = file"
        />
      </div>
      <div v-else-if="input.type === 'link'">
        <link-input
          :value="data[input.name]"
          @change="link => data[input.name] = link"
        />
      </div>
      <div v-else>
        <input
          :id="`${input.name}-${uuid}`"
          :type="input.type"
          :name="input.name"
          class="form-control"
          :placeholder="input.placeholder"
          v-model="data[input.name]"
        />
      </div>
      <small
        class="form-text text-muted"
        v-if="input.helper">
        {{ input.helper }}
      </small>

      <div v-if="(errors && errors[input.name])">
        <small
          v-for="(error, index) in errors[input.name]"
          :key="index"
          class="form-text text-danger">
          {{ $t(error.code) || error.detail }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['schema', 'data', 'errors'],

  data() {
    return {
      uuid: Math.random(),
    };
  },
};
</script>
