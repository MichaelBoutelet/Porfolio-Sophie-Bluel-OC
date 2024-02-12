// api.js
export const fetchData = async (url, options = { method: "GET" }) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erreur ${response.status} lors de l'accès à ${url}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des données : ${error}`);
    throw error;
  }
};

export const getWorks = () => fetchData("http://localhost:5678/api/works");

export const getCategories = () =>
  fetchData("http://localhost:5678/api/categories");

export const getLogin = (options) =>
  fetchData("http://localhost:5678/api/users/login", options);

export const getFullCategories = async () => {
  const categories = await getCategories();
  const allCategory = { id: null, name: "Tous" };
  const fullCategories = [allCategory, ...categories];
  console.log("fullCategories", fullCategories);
  return fullCategories;
};

export const deleteWork = async (workId) => {
  const token = localStorage.getItem("userToken");
  console.log("token", token);
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Erreur ${response.status} lors de la suppression de l'œuvre ${workId}`
      );
    }
    console.log(`Œuvre ${workId} supprimée avec succès`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'œuvre : ${error}`);
    return false;
  }
};
