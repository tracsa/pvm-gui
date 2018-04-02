import Router from 'vue-router';
import Promise from 'promise-polyfill';
import settings from '@/settings';


const ID_TOKEN_KEY = 'auth_token';
const SIGNIN_PATH = '/signin';
const ROOT_PATH = '/';

const router = new Router();

// Get and store id_token in local storage
export function setAuthToken(authToken) {
  localStorage.setItem(ID_TOKEN_KEY, authToken);
}

export function getAuthToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

function clearAuthToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

export function login(username, password, callback) {
  const { host, port, authProvider } = settings.pvm;
  const authUri = `//${host}:${port}/v1/auth/signin/${authProvider}`;

  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const params = {
    method: 'POST',
    body: form,
  };

  window.fetch(authUri, params)
    .then((response) => {
      if (response.status !== 200) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

      return Promise.resolve(response);
    })
    .then(response => response.json())
    .then((body) => {
      const { data } = body;

      setAuthToken(`${data.username}:${data.token}`);

      if (typeof callback === 'function') {
        callback(null, data);
      }
    })
    .catch((error) => {
      if (typeof callback === 'function') {
        callback(error);
      }
    });
}

export function logout() {
  clearAuthToken();
  router.go(SIGNIN_PATH);
}

export function isLoggedIn() {
  const authToken = getAuthToken();
  return !!authToken;
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: SIGNIN_PATH,
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

export function requireAnon(to, from, next) {
  if (isLoggedIn()) {
    next({ path: ROOT_PATH });
  } else {
    next();
  }
}
