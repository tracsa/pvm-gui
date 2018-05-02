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
            {{ $t('insights.title') }}
          </div>
        </div>
      </div>
      <div
      v-if="!loading"
      class="insights">
        <div 
        v-for="step in steps"
        class="insight col-12">
          <router-link
          :to="{ 
            name: 'insight',
            params: { id: step.id }
          }">
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
                  <span class="float-right">
                    {{$t('insights.insight.time')}}
                    {{ step.time }}
                  </span>
                </span>
              </div>
            </div>
          </router-link>
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
  props: ['id'],
  data() {
    return {
      steps: [
        { id: 1,
          title: 'proceso 1',
          desc: 'Este es el primer proceso',
          time: '40 min',
        },
        { id: 2,
          title: 'proceso 2',
          desc: 'Este es el proceso segundo',
          time: '40 min',
        },
        { id: 3,
          title: 'proceso 3',
          desc: 'Este es el primer tercero',
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

    .card {
      .card-body {
        .card-time {
          border-top: 1px solid #c3c3c3;
          width: 100%;
          display: block;
          padding: 10px 0;
          padding-bottom: 0;
          font-size: 20px;
          color: $gray-600;
        }
      }
    }
  }
}

</style>