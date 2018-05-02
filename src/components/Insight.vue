<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
         <div class="card">
          <div class="card-header">
            <div style="float:right;">
              <a
                href="javascript:void(0);"
                @click="loadList">
                  <icon :icon="['fas', 'sync-alt']" />
              </a>
            </div>
            {{ $t('insights.insight.title') }}
          </div>
        </div>
      </div>
      <div 
      v-if="!loading"
      class="insights">
        <div 
        v-for="step in steps"
        class="insight col-12">
          <div 
          class="card">
            <div class="card-body">
              <h4 class="card-title">
                {{ step.title }}
              </h4>
              <p class="card-text">
                {{ step.desc }}
              </p>
              <span class="card-time">
                <span
                v-for="tag in step.tags"
                class="badge badge-primary">
                  {{ tag.content }}
                </span>
                <span class="float-right">
                  {{$t('insights.insight.time')}}
                  {{ step.time }}
                </span>
              </span>
            </div>
          </div>
          <div class="arrow">
            <icon :icon="['fas', 'arrow-down']" />
          </div>
        </div>
      </div>

      <div
      class="col-12"
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

$insight-arrow-color: $purple;
$insight-arrow-size: 25px;

.insights {
  width: 100%;
  
  a {
    color: $gray-700;

    &:hover {
    text-decoration: none;
    }
  }

  .insight {

    &:nth-child(odd) {
      padding: 15px;
    }

    &:last-child .arrow {
      display: none;
    }

    .arrow {
      padding-top: 15px;
      text-align: center;
      font-size: $insight-arrow-size;
      color: $insight-arrow-color;
    }

    .card {
      .card-body {
        .card-time {
          display: block;
          width: 100%;
          padding: 10px 0;
          padding-bottom: 0;
          border-top: 1px solid #c3c3c3;
          font-size: 20px;
          color: $gray-600;
          
          .badge {
            font-size: 12px;
            padding: 7px 8px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}

</style>