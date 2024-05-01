const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  headers: {
    keepAlive: true,
  },
});

api.interceptors.request.use(undefined, async (err) => {
  if (err.config && err.response && err.response.status === 401) {
    try {
      const response = await api.post("/auth/refresh");
      const newToken = response.data.accessToken;
      err.config.headers["Authorization"] = `Bearer ${newToken}`;
      return api.request(err.config);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  throw err;
});

module.exports = api;
