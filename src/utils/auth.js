import Router from 'vue-router';

const ID_TOKEN_KEY = 'auth_token';
const SIGNIN_PATH = '/signin';

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

function isTokenExpired() {
  // @todo request auth token to pvm
  return false;
}

export function login(username, password) {
  // @todo request auth token to pvm
  setAuthToken(`${username}:${password}`);
}

export function logout() {
  clearAuthToken();
  router.go(SIGNIN_PATH);
}

export function isLoggedIn() {
  const authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
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
