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
/*********************pour afficher les images du tableau *******************/
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
/* filtrer */
function createFilters(listeOfWorks, placeFilters) {
  let tableauRetour = [];
  for (let i = 0; i < listeOfWorks.length; i++) {
    if (listeOfWorks[i].categoryId === placeFilters) {
      tableauRetour.push(listeOfWorks[i]);
    }
  }
  return tableauRetour;
}
/***********************************page de connexion ************************************/
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
  const editButton = document.getElementById("editButton");

  if (localStorage.getItem("token")) {
    boutonLoginLogout.textContent = "logout";
    boutonLoginLogout.href = "#";
    modeEdition.style.display = "block";

    boutonLoginLogout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
      editButton.style.display = "block";
    });
  } else {
    boutonLoginLogout.textContent = "login";
    boutonLoginLogout.href = "pagelogin.html";
    editButton.style.display = "none";
    modeEdition.style.display = "none";
  }
}

/*****************ici c'est la modale et toute les fonctions associé *******************/

document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  editButton.addEventListener("click", async () => {
    modal.classList.add("show");
    modal.showModal();

    const works = await getWorks();
    console.log("Projets récupérés pour la modale :", works);
    displayGalleryInModal(works);
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.close();
  });
});
/*********** cette fonction a le meme fonctionnement que displayGallery*****/
/***********avec les boutons pour supprimer en + *****/
function displayGalleryInModal(listeOfWorks) {
  const modalGallery = document.getElementsByClassName("gallerymodale")[0];
  modalGallery.innerHTML = "";

  for (let i = 0; i < listeOfWorks.length; i++) {
    let figureGallery = document.createElement("figure");

    let imgGallery = document.createElement("img");
    imgGallery.src = listeOfWorks[i].imageUrl;
    imgGallery.alt = listeOfWorks[i].title;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    deleteButton.addEventListener("click", async () => {
      await deleteImage(listeOfWorks[i].id);
    });

    figureGallery.appendChild(deleteButton);
    figureGallery.appendChild(imgGallery);
    modalGallery.appendChild(figureGallery);
  }
}
/************ fonction pour supprimer avec l'id **********/
async function deleteImage(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const works = await getWorks();
    displayGalleryInModal(works);
  } else {
    alert("Erreur lors de la suppression de l'image.");
  }
}

/************Ajouter des images ***************/

document.addEventListener("DOMContentLoaded", function () {
  const toggleFormButton = document.getElementById();
  const modalContent = document.getElementById("modalContent");
});
/* lancer mes fonctions */
document.addEventListener("DOMContentLoaded", function () {
  updateLoginLogout();
  init();
  envoyerEmailEtMdp();
});
