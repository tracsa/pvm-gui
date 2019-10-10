import Promise from 'promise-polyfill';
import serialize from './serialize';
import { getAuthToken, logout } from './auth';


function apiFetch(
  method,
  route,
  params = {},
  bodyEncoding = 'application/x-www-form-urlencoded',
  parseResponse = true) {
  const endpoint = process.env.CACAHUATE_URL;
  const headers = {
    'Content-Type': 'application/json',
  };

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
  if (method === 'GET') {
    const serialized = serialize(params);
    if (serialized.length) {
      url = `${url}?${serialized}`;
    }
  } else {
    headers['Content-Type'] = bodyEncoding;

    switch (bodyEncoding) {
      case 'application/x-www-form-urlencoded':
        headers.charset = 'UTF-8';
        options.body = serialize(params);
        break;
      case 'application/json':
        headers.charset = 'UTF-8';
        options.body = JSON.stringify(params);
        break;
      default:
        throw new Error(`HTTP body encoding type ${bodyEncoding} not supported`);
    }
  }

  options.headers = headers;

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        if (response.status === 401) {
          logout();
          return Promise.resolve({});
        }

        if (!parseResponse) {
          return Promise.resolve(response);
        }

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
