import axios from 'axios';
import { env } from './env';

const axiosServer = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default axiosServer;
