import { getWorks, getFullCategories } from "../data/api.js";

const gallery = document.querySelector(".gallery");

// Fonction pour afficher les œuvres dans la galerie
export const displayWorks = (works) => {
  gallery.innerHTML = works
    .map(
      (work) => `
    <figure>
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

// Fonction pour afficher les catégories de filtres.
export const displayCategories = (categories, works) => {
  const isFiltres = document.querySelector(".filtres");
  const filtres = document.createElement("div");

  if (!isFiltres) {
    filtres.classList.add("filtres");
    const gallery = document.querySelector(".gallery");
    gallery.before(filtres);
  }

  // Création de boutons pour chaque catégorie.
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => categoryClicked(category.id, works));
    filtres.appendChild(button);
  });
};

const categoryClicked = (categoryId, works) => {
  if (!categoryId) {
    return displayWorks(works);
  }
  // Filtrage des œuvres selon la catégorie sélectionnée.
  const filteredWorks = works.filter((work) => work.category.id === categoryId);
  displayWorks(filteredWorks);
};
