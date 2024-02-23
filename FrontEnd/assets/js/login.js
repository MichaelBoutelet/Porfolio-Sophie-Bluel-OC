import { getLogin } from "./api.js";

const loginForm = document.querySelector(".login-form");

// gestion affichage error message
const displayMessageError = (message) => {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.innerHTML = "";
  const paraMessage = document.createElement("p");
  paraMessage.textContent = message;
  errorMessage.appendChild(paraMessage);
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Créer FormData à partir du formulaire
  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");
  console.log({ email, password });
  try {
    const login = await getLogin(email, password);
    console.log("login :", login);

    // stockage dans le
    localStorage.setItem("userToken", login.token);

    // redirection vers index.html
    window.location.href = "index.html";
  } catch (error) {
    let errorMessage = "Une erreur inconnue est survenue.";
    if (error.message.includes("401")) {
      errorMessage = "Adresse e-mail ou mot de passe incorrect.";
    }
    displayMessageError(errorMessage);
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
  }
});
