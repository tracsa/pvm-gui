import Router from 'vue-router';
import Promise from 'promise-polyfill';
import settings from '@/settings';


const ID_TOKEN_KEY = 'auth_token';
const ID_USER_KEY = 'auth_user';
const SIGNIN_PATH = '/signin';
const ROOT_PATH = '/';

const router = new Router();

// Get & set auth token in local storage
function setAuthToken(authToken) {
  localStorage.setItem(ID_TOKEN_KEY, authToken);
}

export function getAuthToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

function clearAuthToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

// Get & set signed user in local storage
function setAuthUser(user) {
  const userJSON = JSON.stringify(user);
  localStorage.setItem(ID_USER_KEY, userJSON);
}

export function getAuthUser() {
  const userJSON = localStorage.getItem(ID_USER_KEY);
  let user;

  if (userJSON) {
    user = JSON.parse(userJSON);
  } else {
    user = null;
  }

  return user;
}

function clearAuthUser() {
  localStorage.removeItem(ID_USER_KEY);
}

export function login(username, password, authProvider, callback) {
  const { protocol, host, port } = settings.pvm;
  const authUri = `${protocol}://${host}:${port}/v1/auth/signin/${authProvider}`;

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

      setAuthUser(data);
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
  clearAuthUser();

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
