import axios from 'axios';
export const baseAPI = axios.create({
  headers: {
    Authorization: 'Bearer ' + process.env.OPENROUTER_KEY,
  },
});
