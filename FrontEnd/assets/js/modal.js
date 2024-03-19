import { getWorks, deleteWork, getCategories, addWork } from "./api.js";
import { displayWorks } from "./script.js";

const photoUploadInput = document.getElementById("photoUploadInput");
const photoTitleInput = document.getElementById("photoTitle");
const submitButton = document.getElementById("submitPhoto");

export const openModal = () => {
  const photoGalleryModal = document.getElementById("photoGalleryModal");
  const photoModalOverlay = document.querySelector(".photo-modal-overlay");
  photoGalleryModal.classList.remove("hidden");
  photoModalOverlay.classList.remove("hidden");
};

export const closeModal = () => {
  const photoGalleryModal = document.getElementById("photoGalleryModal");
  const addPhotoGallery = document.getElementById("photoAddModal");
  const photoModalOverlay = document.querySelector(".photo-modal-overlay");
  photoGalleryModal.classList.add("hidden");
  addPhotoGallery.classList.add("hidden");
  photoModalOverlay.classList.add("hidden");
};

const closeButtons = document.querySelectorAll(".modal-close");

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal();
  });
});

// gestion overlay
export const openOverlay = () => {
  const photoModalOverlay = document.querySelector(".photo-modal-overlay");
  photoModalOverlay.classList.remove("hidden");
  photoModalOverlay.addEventListener("click", closeModalsAndOverlay);
};

export const closeOverlay = () => {
  const photoModalOverlay = document.querySelector(".photo-modal-overlay");
  photoModalOverlay.classList.add("hidden");
  photoModalOverlay.removeEventListener("click", closeModalsAndOverlay);
};

const closeModalsAndOverlay = () => {
  closeModal();
  closeOverlay();
};

// gestion affichage de la gallerie dans la première modal
export const displayGallery = async () => {
  const works = await getWorks();
  console.log("works", works);
  const galleryContainer = document.querySelector(".gallery-container");
  galleryContainer.innerHTML = works
    .map(
      (image) => `
    <div class="image-item">
      <img src="${image.imageUrl}" alt="${image.title}" />
      <i class="fas fa-trash-can" data-id="${image.id}"></i>
    </div>
    `
    )
    .join("");

  trash();
};

// gestion pour effacer les images
export const handleDeleteImage = async (workId) => {
  try {
    await deleteWork(workId);
    console.log("Image deleted successfully");

    // Mettre à jour la galerie dans la modalité après la suppression
    await updateModal();
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};

const trash = async () => {
  const trashIcons = document.querySelectorAll(".fa-trash-can");

  trashIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const workId = icon.dataset.id;
      await deleteWork(workId);
      const works = await getWorks();

      await displayWorks(works);
      await displayGallery();
    });
  });
};

const resetPhotoAddModal = () => {
  // Réinitialise l'aperçu de l'image
  const photoPreview = document.getElementById("photoPreview");
  photoPreview.src = ""; // Ou mettre le chemin d'une image par défaut si nécessaire
  photoPreview.classList.add("hidden");

  // Réaffiche les éléments icon et label
  const photoIcon = document.querySelector(".fa-picture");
  const photoLabel = document.querySelector(".photo-upload-label");
  const tailleImage = document.querySelector(".taille-image");
  photoIcon.style.display = ""; // Ou "block" si c'était leur display initial
  photoLabel.style.display = ""; // Ou "block"
  tailleImage.style.display = ""; // Ou "block"

  // Réinitialise le formulaire (facultatif, si vous voulez également effacer les champs de saisie)
  document.querySelector(".photo-add-form").reset();

  // Réinitialise l'état du bouton de soumission
  updateButtonState();
};

const addPhotoModal = document.querySelector("#openPhotoAddModal");
const photoGalleryModal = document.querySelector("#photoGalleryModal");
const photoAddModal = document.getElementById("photoAddModal");
addPhotoModal.addEventListener("click", (e) => {
  setTimeout(() => {
    photoAddModal.classList.remove("hidden");
    photoGalleryModal.classList.add("hidden"); // Ouvrir la seconde modal
    resetPhotoAddModal();
  }, 100);
  updateButtonState();
  // Délai de 100 millisecondes avant d'ouvrir la seconde modal
});

// gestion de la seconde modal
const arrowBack = document.querySelector(".modal-back");
console.log(arrowBack);
arrowBack.addEventListener("click", () => {
  console.log("click click click");
  photoAddModal.classList.add("hidden");
  photoGalleryModal.classList.remove("hidden");
});

photoUploadInput.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const photoPreview = document.getElementById("photoPreview");
      photoPreview.src = e.target.result;
      photoPreview.classList.remove("hidden");
      const photoIcon = document.querySelector(".fa-picture");
      const photoLabel = document.querySelector(".photo-upload-label");
      const tailleImage = document.querySelector(".taille-image");
      photoIcon.style.display = "none";
      photoLabel.style.display = "none";
      tailleImage.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
  updateButtonState();
});
// Sélectionne l'élément select
const photoCategorySelect = document.getElementById("photoCategory");

// Fonction pour afficher les catégories dans le select
export const displayCategoriesInSelect = async () => {
  try {
    const categories = await getCategories();

    // parcours les cate pour les ajouter
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      photoCategorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error displaying categories in select:", error.message);
  }
};
displayCategoriesInSelect();

function updateButtonState() {
  const isPhotoChosen = photoUploadInput.files.length > 0;
  const isTitleDefined = photoTitleInput.value.trim() !== "";
  const isCategorySelected = photoCategorySelect.value !== "";

  if (isPhotoChosen && isTitleDefined && isCategorySelected) {
    submitButton.classList.remove("inactive");
    submitButton.classList.add("active");
    submitButton.disabled = false; // Rendre le bouton cliquable
  } else {
    submitButton.classList.add("inactive");
    submitButton.classList.remove("active");
    submitButton.disabled = true; // Garder le bouton désactivé
  }
}

photoUploadInput.addEventListener("change", updateButtonState);
photoTitleInput.addEventListener("input", updateButtonState);
photoCategorySelect.addEventListener("change", updateButtonState);

document
  .querySelector(".photo-add-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("photoUploadInput");
    const title = document.getElementById("photoTitle").value;
    const categoryId = document.getElementById("photoCategory").value;

    if (fileInput.files.length > 0) {
      const imageFile = fileInput.files[0];

      await addWork(categoryId, imageFile, title);
      document.querySelector(".photo-add-form").reset();
      const works = await getWorks();

      await displayWorks(works);
      closeModal();
    }
  });
