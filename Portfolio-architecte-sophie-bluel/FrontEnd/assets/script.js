async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

async function init() {
  const works = await getWorks();
  console.log("Données récupérées :", works);
  displayGallery(works, ".gallery");

  const buttonTous = document.getElementById("Tous");
  const buttonObjets = document.getElementById("Objets");
  const buttonAppartements = document.getElementById("Appartements");
  const buttonHotels = document.getElementById("Hotels");

  // Afficher toutes les œuvres
  buttonTous.addEventListener("click", () => {
    displayGallery(works, ".gallery");
  });

  // Categorie 1
  buttonObjets.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 1);
    displayGallery(filteredWorks, ".gallery");
  });

  // Categorie 2
  buttonAppartements.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 2);
    displayGallery(filteredWorks, ".gallery");
  });

  // Categorie 3
  buttonHotels.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 3);
    displayGallery(filteredWorks, ".gallery");
  });
}

function displayGallery(listeOfWorks, placeGallery) {
  const gallery = document.querySelector(placeGallery);
  gallery.innerHTML = "";
  console.log("Galerie sélectionnée :", gallery);

  for (let i = 0; i < listeOfWorks.length; i++) {
    let figureGallery = document.createElement("figure");

    let imgGallery = document.createElement("img");
    imgGallery.src = listeOfWorks[i].imageUrl;
    imgGallery.alt = listeOfWorks[i].title;

    let titleGallery = document.createElement("figcaption");
    titleGallery.innerText = listeOfWorks[i].title;

    figureGallery.appendChild(imgGallery);
    figureGallery.appendChild(titleGallery);

    gallery.appendChild(figureGallery);
  }
}

function createFilters(listeOfWorks, placeFilters) {
  let tableauRetour = [];
  for (let i = 0; i < listeOfWorks.length; i++) {
    if (listeOfWorks[i].categoryId === placeFilters) {
      tableauRetour.push(listeOfWorks[i]);
    }
  }
  return tableauRetour;
}

function envoyerEmailEtMdp() {
  const informationMdpEmail = document.getElementById("information");

  informationMdpEmail.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const response = await getEmailMdp(email, password);

    if (response !== null && response.token) {
      console.log(response);
      alert("Connexion réussie !");
      localStorage.setItem("token", response.token);
      window.location.href = "index.html";
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  });
}

async function getEmailMdp(email, mdp) {
  const URL = "http://localhost:5678/api/users/login";
  console.log(URL);
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: mdp,
    }),
  });

  if (response.ok) {
    console.log("adfaaf");
    return await response.json();
  } else {
    console.error("Erreur identifiants");
    return null;
  }
}

function updateLoginLogout() {
  const boutonLoginLogout = document.getElementById("changeLoginLogout");
  const modeEdition = document.getElementById("modeEdition");

  // Si un token est présent, on affiche "logout"
  if (localStorage.getItem("token")) {
    boutonLoginLogout.textContent = "logout";
    boutonLoginLogout.href = "#";
    modeEdition.style.display = "block"; // Affiche la barre "Mode Édition"

    boutonLoginLogout.addEventListener("click", () => {
      localStorage.removeItem("token"); // Supprime le token
      window.location.href = "index.html"; // Reste sur index.html après déconnexion
    });
  } else {
    boutonLoginLogout.textContent = "login";
    boutonLoginLogout.href = "pagelogin.html"; // Renvoie vers la page de login
    modeEdition.style.display = "none"; // Cache la barre "Mode Édition"
  }
}
function ouvrirModale() {
  const dialog = document.querySelector("dialog");
  const showButton = document.querySelector("dialog + button");
  const closeButton = document.querySelector("dialog button");

  // Le bouton "Afficher la fenêtre" ouvre le dialogue
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });

  // Le bouton "Fermer" ferme le dialogue
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  ouvrirModale();
  updateLoginLogout();
  init();
  envoyerEmailEtMdp();
});
