<template>
  <div class="login-box pt-5">
    <h1 class="mb-5">{{ $t('signin.title') }}</h1>

    <div class="container container-micro">

      <b-alert
        variant="danger"
        class="mx-auto text-center"
        v-model="showAlert"
      >
        <icon :icon="['fas', 'plug']"/>
        {{ $t('commons.offline') }}
      </b-alert>

      <div class="card">
        <div class="card-body text-center">
          <p>{{ $t('signin.description') }}</p>

          <form
            method="post"
            action="/"
            @submit="signIn($event)"
          >
            <div
              class="text-danger"
              v-if="hasError"
              >
              {{ $t('signin["' + this.errorMessage + '"]') }}
            </div>

            <div class="form-group mt-3">
              <input
                v-model="username"
                type="text"
                :placeholder="$t('signin.username_placeholder')"
                class="form-control"
                :class="{'is-invalid': hasError}">
            </div>

            <div class="form-group">
              <input
                v-model="password"
                type="password"
                :placeholder="$t('signin.password_placeholder')"
                class="form-control"
                :class="{'is-invalid': hasError}">
            </div>

            <small>
              <a href="#" v-on:click="toggleAdvancedOptions">{{ $t('signin.advanced_options') }}</a>
            </small>

            <div class="form-group" v-if="showAdvancedOptions">
              <select
                v-model="provider"
                class="form-control"
                :class="{'is-invalid': hasError}">
                <option
                  v-for="option in providers"
                  :key="option.value"
                  :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <button
              class="btn btn-primary btn-block mt-3"
              :disabled="signingIn">
              {{ $t('signin.button') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '../utils/api';
import { login } from '../utils/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      provider: process.env.CACAHUATE_AUTHS[0].value,
      providers: process.env.CACAHUATE_AUTHS,
      hasError: false,
      signingIn: false,
      showAdvancedOptions: false,
      errorMessage: 'offline',

      timer: null,
      backendUrl: process.env.CACAHUATE_URL,
      online: true,
      showAlert: false,
    };
  },

  methods: {
    toggleAdvancedOptions: function toggleAdvancedOptions(event) {
      event.preventDefault();

      this.showAdvancedOptions = !this.showAdvancedOptions;
    },

    signIn: function signIn(event) {
      event.preventDefault();

      this.hasError = false;
      this.signingIn = true;


      const { username, password, provider } = this;
      login(username, password, provider, (err) => {
        this.signingIn = false;

        if (err) {
          this.hasError = true;
          const errRes = err.response;
          if (!errRes) {
            this.errorMessage = 'offline';
          }

          const a = errRes.json();
          a.then((res) => {
            const code = res.errors[0].code;

            if ([
              'error_signin',
              'validation.invalid',
              'validation.required',
            ].includes(code)) {
              this.errorMessage = code;
            } else {
              this.errorMessage = 'error_signin';
            }
          });
        }

        const { $route, $router } = this;

        let redirect = '/';
        if ($route.query.redirect !== undefined) {
          redirect = $route.query.redirect;
        }

        $router.push(redirect);
      });
    },

    checkOnline() {
      const vm = this;

      get('/execution?limit=1&include=_')
        .then(() => {
          vm.online = true;
          vm.showAlert = false;
        })
        .catch(() => {
          vm.online = false;
          vm.showAlert = true;
        });
    },
  },

  created() {
    this.checkOnline();
    this.timer = setInterval(this.checkOnline, 60000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.login-box  {
  h1 {
    text-align: center;
  }

  .container-micro {
    max-width: 400px;
  }
}
</style>
