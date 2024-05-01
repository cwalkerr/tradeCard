const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Add an interceptor to the Axios instance
api.interceptors.response.use(undefined, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    // If a request returns a 401 response, refresh the token
    try {
      const response = await axios.post("http://localhost:4000/auth/refresh");
      const newToken = response.data.accessToken;

      // Update the token in the original request and retry it
      error.config.headers["Authorization"] = `Bearer ${newToken}`;
      return api.request(error.config);
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});

window.onload = async () => {
  try {
    await api.put(`/api/messages/${userId}/${otherUserId}`, {
      is_read: true,
    });
  } catch (err) {
    console.error("Error updating read status:", err);
  }
};
