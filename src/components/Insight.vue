<template>
  <div class="container">
    <div class="row">
      <div
      v-if="!loading"
      class="col">
        <div class="card">
          <div class="card-header">
            {{ $t('insights.insight.title') }}
            <router-link
            :to="{ path: '/insight' }"
            class="float-right">
              {{ $t('commons.back') }}
            </router-link>
          </div>
          <div class="card-body">
            <div class="table-responsive-sm">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{ $t('insights.activity') }}</th>
                    <th>{{ $t('insights.actors') }}</th>
                    <th>{{ $t('insights.time') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                  v-for="step in steps"
                  >
                    <td :title="step.desc">{{ step.title }}</td>
                    <td>
                      <span
                      v-for="tag in step.tags"
                      class="badge badge-primary">
                        {{ tag.content }}
                      </span>
                    </td>
                    <td>{{ step.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div
      class="col"
      v-else>
        <loading />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      steps: [
        {
          title: 'Paso 1',
          desc: 'Este es el primero',
          time: '40 min',
          tags: [
            { type: 'info', content: 'Validación' },
            { type: 'light', content: 'Requiere autorizacíon' },
            { type: 'primary', content: 'Seguridad' },
          ]
        },
        {
          title: 'Paso 2',
          desc: 'Este es el segundo',
          time: '40 min',
          tags: [
            { type: 'primary', content: 'Seguridad' },
          ]
        },
        {
          title: 'Paso 3',
          desc: 'Este es el tercero',
          time: '40 min',
        }
      ],
      loading: false,
    };
  },
  methods: {
    loadList: function loadList() {
    },
  },
};
</script>
<style lang="scss">
@import '../styles/variables.scss';

table {
  thead {
    tr {
      th {
        border-top: none !important;
      }
    }
  }
}

.badge {
  font-size: 12px;
  padding: 4px 6px;
  margin-right: 5px;
}

</style>