import ApiService from './api.service';

class UserService {
  getUser = (identifier) => {
    const urlId = encodeURIComponent(identifier);

    return ApiService().get(
      `/v1/user/_identifier/${urlId}/info`,
    );
  };
}

export default {
  install(Vue, name = '$userService') {
    Object.defineProperty(Vue.prototype, name, { value: new UserService() });
  },
};
