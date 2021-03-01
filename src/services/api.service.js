import axios from 'axios';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

export default() => axios.create({
  baseURL: API_PVM_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
