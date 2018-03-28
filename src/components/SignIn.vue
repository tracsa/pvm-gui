<template>
    <div class="login-box">
        <h1>SignIn</h1>
        <div class="container form">
            <p>Sign in to start your session</p>
            <form
                method="post"
                action="/"
                @submit="signIn($event)"
            >
                <div
                  class="danger-text"
                  v-bind:class="{ visible: hasError }">
                  We are sorry but it seems the username or password is wrong.
                </div>
                <input
                  v-model="email"
                  id="email"
                  type="text"
                  placeholder="Email"
                  :class="{ 'has-error' : hasError }">
                <input
                  v-model="password"
                  id="pass"
                  type="password"
                  placeholder="Password"
                  :class="{ 'has-error' : hasError }">
                <button class="btn-blue"> Sign In </button>
            </form>
        </div>
    </div>
</template>

<script>
import { login } from '../utils/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      hasError: false,
    };
  },
  methods: {
    signIn: function signIn(event) {
      event.preventDefault();
      this.hasError = login(this.email, this.password);
      console.log(this.hasError);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.login-box  {
  padding-top: 80px;

  h1 {
    color: $gray-700;
    text-align: center;
  }

  .danger-text {
    color: $danger;
    display: none;
    font-size: 15px;
    padding: 10px 0
  }

  .visible {
    display: block;
  }

  .form {
    background: $white;
    max-width: 400px;
    padding: 20px;
    border: 1px solid $gray-100;
    margin-top: 40px;

    input {
      color: $gray-600;
      font-size: 14px;
      height: 40px;
      width: 100%;
      padding: 15px;
      border-radius: 0;
      border: 1px solid $gray-400;
      margin-top: 15px;

      &.has-error {
        border-color: $danger;
      }
    }

    input::placeholder {
      color: $gray-500;
    }

    p {
      color: $gray-600;
      font-size: 14px;
      padding: 5px 0;
      margin-bottom: 0;
    }

    button {
      background: mix($blue, $gray-600);
      font-size: 14px;
      color: white;
      width: 100%;
      border: 0;
      padding: 8px 25px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
}
</style>
