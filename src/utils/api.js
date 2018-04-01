import Promise from 'promise-polyfill';
import settings from '@/settings';
import serialize from './serialize';
import { getAuthToken } from './auth';


function apiFetch(method, route, params = {}) {
  const { host, port } = settings.pvm;
  const endpoint = `//${host}:${port}`;
  const headers = {};
  const options = {
    method,
  };

  // Append autorization
  let auth = getAuthToken();
  if (auth) {
    if (typeof window !== 'undefined') {
      auth = btoa(auth);
    } else {
      auth = new Buffer(auth).toString('base64');
    }

    headers.Authorization = `Basic ${auth}`;
  }

  let url;
  if (route.charAt(0) !== '/') {
    url = `${endpoint}/v1/${route}`;
  } else {
    url = `${endpoint}/v1${route}`;
  }

  // Append params as form urlencoded in body request
  const rawbody = serialize(params);

  if (rawbody.length > 0) {
    if (method === 'GET') {
      url = `${url}?${rawbody}`;
    } else {
      headers.charset = 'UTF-8';
      headers['Content-Type'] = 'application/x-www-form-urlencoded';

      options.body = rawbody;
    }
  }

  options.headers = headers;

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        // No content to parse
        if (response.status === 204) {
          return Promise.resolve({});
        }

        return response.json();
      })
      .then((body) => {
        if (body.errors) {
          throw body.errors;
        }

        resolve(body);
      })
      .catch(err => reject(err));
  });
}

export const get = apiFetch.bind(this, 'GET');
export const put = apiFetch.bind(this, 'PUT');
export const post = apiFetch.bind(this, 'POST');
