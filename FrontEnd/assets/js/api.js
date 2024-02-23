const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getWorks = async () =>
  await fetchData("http://localhost:5678/api/works");

export const getLogin = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getCategories = async () =>
  await fetchData("http://localhost:5678/api/categories");

export const deleteWork = async (workId) => {
  try {
    const token = localStorage.getItem("userToken");
    console.log("token", token);
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};

export const addWork = async (categoryId, image, title) => {
  try {
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", categoryId);
    formData.append("title", title);
    const response = await fetch(`http://localhost:5678/api/works/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Works added successfully");
  } catch (error) {
    console.error("Error adding image:", error.message);
  }
};
