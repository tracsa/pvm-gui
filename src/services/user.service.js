import axios from 'axios';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

class UserService {
  getUserInfo = (identifier) => {
    const urlId = encodeURIComponent(identifier);
    const userInfoUrl = `${API_PVM_URL}/v1/user/_identifier/${urlId}/info`;

    return axios.get(`${userInfoUrl}`);
  };
}

export default new UserService();
