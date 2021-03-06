import ApiService from './api.service';

function getUser(identifier) {
  const urlId = encodeURIComponent(identifier);

  return ApiService().get(
    `/v1/user/_identifier/${urlId}/info`,
  );
}

export const userService = {
  getUser,
};

export default {
  install(Vue, name = '$userService') {
    Object.defineProperty(Vue.prototype, name, { value: userService });
  },
};
