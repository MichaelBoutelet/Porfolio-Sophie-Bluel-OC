import { getWorks, getCategories } from "./api.js";
import {
  openModal as openGalleryModal,
  closeModal as closeGalleryModal,
  openOverlay,
  closeOverlay,
} from "./modal.js";
import {
  openModal as openAddPhotoModal,
  closeModal as closeAddPhotoModal,
  displayGallery,
} from "./modal.js";

export const getList = async () => {
  const categories = await getFullCategories();
  const works = await getWorks();
  displayCategories(categories, works);
  getFullCategories();
  displayWorks(works);
};
// gallery d'affichage
const galleryContainer = document.getElementById("gallery");

export const displayWorks = async (works) => {
  galleryContainer.innerHTML = works
    .map(
      (work) => `
    <figure>
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
    </figure>

`
    )
    .join("");
};

// gestion du login et de l'affichage de la page
document.addEventListener("DOMContentLoaded", async () => {
  await getList();
  const loginLogoutBtn = document.querySelector(".loginButton");
  const loginBanner = document.getElementById("black-container");
  const editIcon = document.querySelector(".edit-icon");
  // gestion des modals
  const addPhotoButton = document.getElementById("openPhotoAddModal");

  // verifie si l'utilisateur est connecté
  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    loginBanner.style.display = "flex";
    editIcon.classList.remove("hidden");
  } else {
    loginBanner.style.display = "none";
    editIcon.classList.add("hidden");
  }
  loginLogoutBtn.textContent = userToken ? "Logout" : "Login";

  loginLogoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (loginLogoutBtn.textContent === "Login") {
      window.location.href = "login.html";
    } else {
      // si l'utilisateur est connecté et souhaite se deconnecter
      localStorage.removeItem("userToken");
      loginLogoutBtn.textContent = "Login";
      window.location.reload();
    }
  });

  editIcon.addEventListener("click", () => {
    openGalleryModal();
    openOverlay();
    displayGallery();
  });
  addPhotoButton.addEventListener("click", () => {
    openAddPhotoModal(); // Ouvrir la deuxième modal (ajout de photo)
  });
});

// creation  des catégories pour trier la galerie
export const getFullCategories = async () => {
  const categories = await getCategories();
  const allCategory = { id: null, name: "Tous" };
  const fullCategories = [allCategory, ...categories];
  console.log("fullCategories", fullCategories);
  return fullCategories;
};

// fonction de tri des categories
const categoryClicked = (categoryId, works) => {
  if (!categoryId) {
    return displayWorks(works);
  }

  const filteredWorks = works.filter((work) => work.category.id === categoryId);
  displayWorks(filteredWorks);
};
// affichage des categories
export const displayCategories = (categories, works) => {
  const isFiltres = document.querySelector(".filtres");

  // verifie si l'utilisateur est connecté
  const userToken = localStorage.getItem("userToken");

  if (!userToken) {
    const filtres = document.createElement("div");
    filtres.classList.add("filtres");

    if (!isFiltres) {
      gallery.before(filtres);
    }

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.addEventListener("click", () =>
        categoryClicked(category.id, works)
      );
      filtres.appendChild(button);
    });
  } else {
    // Si l'utilisateur est connecté, masquer les filtres s'ils existent
    if (isFiltres) {
      isFiltres.style.display = "none";
    }
  }
};
