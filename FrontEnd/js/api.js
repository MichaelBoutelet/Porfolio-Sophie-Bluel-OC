/**
 *  récupération des éléments HTML
 */
const sectionPorfolio = document.querySelector("#portfolio");
console.log("sectionPorfolio", sectionPorfolio);

const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut: ${response.status}`);
    }
    console.log("response", response);
    const data = await response.json();
    console.log("Données reçues dans getData:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données: ", error);
  }
};

const displayData = async (url) => {
  const data = await getData(url);
  if (data && Array.isArray(data) && data.length > 0) {
    const divGallery = document.createElement("div");
    divGallery.classList.add("gallery");

    data.forEach((item) => {
      const { id, title, imageUrl } = item;
      console.log("id", id);
      console.log("title", title);
      console.log("imageUrl", imageUrl);
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <figcaption>${title}</figcaption>
      `;
      // Ajout du nouvel élément figure à la divGallery
      divGallery.appendChild(figure);
    });

    // Ajout de la divGallery à la section "portfolio"
    sectionPorfolio.appendChild(divGallery);
  }
};

displayData("http://localhost:5678/api/works");
