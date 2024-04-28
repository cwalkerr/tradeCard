window.onload = async () => {
  try {
    await axios.put(
      `http://localhost:4000/api/messages/${userId}/${otherUserId}`,
      {
        is_read: true,
      }
    );
  } catch (err) {
    console.error("Error updating read status:", err);
  }
};
