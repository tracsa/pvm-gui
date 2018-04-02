<template>
  <div class="row">
    <div class="col">
      <select
        class="custom-select"
        v-model="hours"
        placeholder="Horas">
        <option
          v-for="hour in hourOptions"
          :value="hour.value">
          {{ hour.label }}
        </option>
      </select>
    </div>
    <div class="col">
      <select
        class="custom-select"
        v-model="minutes"
        placeholder="Minutos">
        <option
          v-for="minute in minuteOptions"
          :value="minute.value">
          {{ minute.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      hourOptions: [],
      minuteOptions: [],
    };
  },
  mounted() {
    for (let h=0; h<24; ++h) {
      this.hourOptions.push({
        label: `0${h}`.slice(-2),
        value: h,
      });
    }

    for (let m=0; m<60; ++m) {
      this.minuteOptions.push({
        label: `0${m}`.slice(-2),
        value: m,
      });
    }
  },
  computed: {
    hours: {
      get: function get_hours() {
        const { value } = this;
        if (!value) {
          return null;
        }

        return value.getHours();
      },
      set: function set_hours(hours) {
        const date = new Date(this.value);
        date.setHours(hours);

        this.$emit('change', date);
      },
    },
    minutes: {
      get: function get_minutes() {
        const { value } = this;
        if (!value) {
          return null;
        }

        return value.getMinutes();
      },
      set: function set_minutes(minutes) {
        const date = new Date(this.value);
        date.setMinutes(minutes);

        this.$emit('change', date);
      },
    },
  },
}
</script>
