let stars = document.getElementsByClassName("star");
let output = document.getElementById("output");

let clickedRating = 0;
let initialRating = 0;

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Add an interceptor to the Axios instance
api.interceptors.response.use(undefined, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    try {
      const response = await axios.post("http://localhost:4000/auth/refresh");
      const newToken = response.data.accessToken;

      error.config.headers["Authorization"] = `Bearer ${newToken}`;
      return api.request(error.config);
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});

// Get stored rating if user has rated the collection
window.onload = async () => {
  try {
    const getUserRating = await api.get(
      `/api/collections/${collectionId}/ratings/${userId}`
    );
    if (getUserRating.data) {
      initialRating = getUserRating.data;
    }
    handleRatingUpdate(initialRating); // colour stars to reflect stored rating, if no rating found, defaults to 0
  } catch (error) {
    console.error("Error loading user rating:", error);
  }
};

const handleRatingUpdate = async (clickedStars) => {
  remove();
  for (let i = 0; i < clickedStars; i++) stars[i].className = "star gold";
  output.innerText = clickedStars + "/5";
  clickedRating = clickedStars;

  try {
    if (initialRating === 0 && clickedRating > 0) {
      await api.post(`/api/collections/${collectionId}/ratings`, {
        rating: clickedRating,
        user_id: userId,
      });
      initialRating = clickedRating; // Update initial rating to allow for changing if page is loaded with no rating
    } else {
      await api.put(`/api/collections/${collectionId}/ratings`, {
        rating: clickedRating,
        user_id: userId,
      });
    }

    const getUpdatedRatings = await api.get(
      `/api/collections/${collectionId}/ratings`
    );
    const updatedRatings = getUpdatedRatings.data;
    const averageRating = getUpdatedRatings.data.average;

    document.getElementById(
      "averageRating"
    ).innerText = `Community Rating : (★ ${averageRating}/5)`;

    for (let i = 1; i <= 5; i++) {
      let count = 0;
      const rating = updatedRatings.ratings.find(
        (rating) => Number(rating.rating) === i
      );
      if (rating) {
        count = rating.count;
      }
      document.getElementById(`count${i}`).innerText = `(${count})`;
    }
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

const hover = (clickedStars) => {
  remove();
  for (let i = 0; i < clickedStars; i++) stars[i].className = "star gold";
};

const remove = () => {
  for (let i = 0; i < stars.length; i++) {
    if (i >= clickedRating) {
      stars[i].className = "star";
    }
  }
};
