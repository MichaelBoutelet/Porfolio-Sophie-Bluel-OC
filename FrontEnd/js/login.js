import { getLogin } from "../data/api.js";

// gestion connexion et stockage localStorage
const handleSuccesLogin = (token) => {
  localStorage.setItem("userToken", token);
  console.log("Token enregistré:", token);
  window.location.href = "./index.html";
};

// gestion message d'erreur
const displayErrorMessage = (message) => {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.innerHTML = message;
  errorMessageDiv.style.display = "block";
};

document.querySelector("#formData").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");
  console.log({ email, password });

  if (!email || !password) {
    displayErrorMessage();
    return;
  }

  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await getLogin(options);

    console.log("reponse de l'API", response);
    localStorage.getItem("token", response.token);

    if (response.token) {
      handleSuccesLogin(response.token);
      console.log("ici", handleSuccesLogin(response.token));
    } else {
      displayErrorMessage("Une erreur est survenue");
    }
  } catch (error) {
    displayErrorMessage("Identifiant et/ou mot de passe incorrect(s)");
  }
});
