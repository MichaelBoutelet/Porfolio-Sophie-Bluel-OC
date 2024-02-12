import { getWorks, getFullCategories } from "../data/api.js";
import { displayWorks, displayCategories } from "./works.js";
import { createEditionSection, showEditIcon } from "./modal.js";

const init = async () => {
  const works = await getWorks();
  const categories = await getFullCategories();
  displayWorks(works);
  displayCategories(categories, works);
  checkLoginStatus();
};

const handleLogout = (e) => {
  e.preventDefault();
  localStorage.removeItem("userToken");
  window.location.reload(); // Recharger la page pour refléter l'état déconnecté
};

const checkLoginStatus = () => {
  const userToken = localStorage.getItem("userToken");
  const loginLink = document.getElementById("logDelog");
  const filtres = document.querySelector(".filtres");
  const blackBanner = document.getElementById("edition");
  const editIcon = document.getElementById("editIcon");

  if (userToken) {
    console.log("Utilisateur connecté, filtres devraient être cachés");
    createEditionSection();
    showEditIcon();

    if (filtres) {
      filtres.classList.add("hidden"); // Cache les filtres si connecté
    }

    loginLink.textContent = "Logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", handleLogout);
  } else {
    blackBanner.innerHTML = ""; // Efface le contenu de la bannière
    if (editIcon) {
      editIcon.style.display = "none"; // Cache l'icône d'édition
    }
    console.log("Utilisateur non connecté, filtres devraient être affichés");
    if (filtres) {
      filtres.classList.remove("hidden"); // Affiche les filtres si non connecté
    }

    loginLink.textContent = "Login";
    loginLink.href = "./login.html";
    loginLink.removeEventListener("click", handleLogout);
  }
};

init();
