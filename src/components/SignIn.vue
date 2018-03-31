<template>
  <div class="login-box pt-5">
    <h1>{{ $t('signin.title') }}</h1>
    <div class="container container-micro">
      <div class="card mt-5">
        <div class="card-body">
          <p>{{ $t('signin.description') }}</p>
          <form
            method="post"
            action="/"
            @submit="signIn($event)"
          >
            <div
              class="text-danger"
              v-if="hasError">
              {{ $t('signin.error_signin') }}
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

import { login } from '../utils/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      hasError: false,
      signingIn: false,
    };
  },
  methods: {
    signIn: function signIn(event) {
      event.preventDefault();

      this.hasError = false;
      this.signingIn = true;

      const { username, password } = this;
      login(username, password, (err) => {
        this.signingIn = false;

        if (err) {
          this.hasError = true;
        }

        const { $route, $router } = this;

        let redirect = '/';
        if ($route.query.redirect !== undefined) {
          redirect = $route.query.redirect;
        }

        $router.push(redirect);
      });
    },
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
