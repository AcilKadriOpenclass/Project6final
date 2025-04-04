// Pour récupérer les travaux depuis l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Pour initialiser la page: récupération des données et filtres
async function init() {
  const works = await getWorks();
  console.log("Données récupérées :", works);
  displayGallery(works, ".gallery");

  // Récupérer les boutons
  const buttonTous = document.getElementById("Tous");
  const buttonObjets = document.getElementById("Objets");
  const buttonAppartements = document.getElementById("Appartements");
  const buttonHotels = document.getElementById("Hotels");

  // Cliquer sur Tous
  buttonTous.addEventListener("click", () => {
    displayGallery(works, ".gallery");
  });

  // Cliquer sur Objets (catégorie 1)
  buttonObjets.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 1);
    displayGallery(filteredWorks, ".gallery");
  });

  // Cliquer sur Appartements (catégorie 2)
  buttonAppartements.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 2);
    displayGallery(filteredWorks, ".gallery");
  });

  // Cliquer sur Hotels (catégorie 3)
  buttonHotels.addEventListener("click", () => {
    const filteredWorks = createFilters(works, 3);
    displayGallery(filteredWorks, ".gallery");
  });
}

// Fonction pour afficher les images dans la galerie
function displayGallery(listeOfWorks, placeGallery) {
  const gallery = document.querySelector(placeGallery);
  gallery.innerHTML = ""; // vider la galerie

  // boucle pour parcourir chaque travail
  for (let i = 0; i < listeOfWorks.length; i++) {
    let figureGallery = document.createElement("figure");

    let imgGallery = document.createElement("img");
    imgGallery.src = listeOfWorks[i].imageUrl;
    imgGallery.alt = listeOfWorks[i].title;

    let titleGallery = document.createElement("figcaption");
    titleGallery.innerText = listeOfWorks[i].title;

    // ajouter image et titre à la figure
    figureGallery.appendChild(imgGallery);
    figureGallery.appendChild(titleGallery);

    // ajouter figure à la galerie
    gallery.appendChild(figureGallery);
  }
}

// Fonction pour filtrer les projets par catégorie
function createFilters(listeOfWorks, placeFilters) {
  // créer un tableau vide pour stocker les projets filtrés
  let tableauRetour = [];
  for (let i = 0; i < listeOfWorks.length; i++) {
    // si le projet correspond à la catégorie demandée
    if (listeOfWorks[i].categoryId === placeFilters) {
      // je l'ajoute au tableau
      tableauRetour.push(listeOfWorks[i]);
    }
  }
  return tableauRetour;
}

// Fonction pour la connexion
function envoyerEmailEtMdp() {
  const informationMdpEmail = document.getElementById("information");
  if (!informationMdpEmail) {
    return; // Sortir si on n'est pas sur la page de connexion
  }

  // Quand on soumet le formulaire de connexion
  informationMdpEmail.addEventListener("submit", async (event) => {
    event.preventDefault(); // empêcher le rechargement de la page
    console.log("Tentative de connexion");

    // récupérer l'email et le mot de passe
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // vérifier que les champs sont remplis
    if (email === "" || password === "") {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // envoyer les identifiants
    const response = await getEmailMdp(email, password);

    // vérifier si connexion réussie
    if (response !== null && response.token) {
      console.log("Connexion réussie");
      alert("Connexion réussie !");
      localStorage.setItem("token", response.token); // sauvegarder le token
      window.location.href = "index.html"; // rediriger vers la page d'accueil
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  });
}

// Fonction pour envoyer les identifiants
async function getEmailMdp(email, mdp) {
  const URL = "http://localhost:5678/api/users/login";

  // j'utilise fetch pour envoyer les données
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
    return await response.json();
  } else {
    console.error("Erreur identifiants");
    return null;
  }
}

// Fonction pour mettre à jour l'affichage selon l'état de connexion
function updateLoginLogout() {
  const boutonLoginLogout = document.getElementById("changeLoginLogout");
  const modeEdition = document.getElementById("modeEdition");
  const editButton = document.getElementById("editButton");
  const filters = document.getElementById("filters");

  if (!boutonLoginLogout) {
    return; // Si les éléments n'existent pas
  }

  // Si l'utilisateur est connecté
  if (localStorage.getItem("token")) {
    // Changer le bouton login en logout
    boutonLoginLogout.textContent = "logout";
    boutonLoginLogout.href = "#";

    // Afficher le mode édition
    if (modeEdition) modeEdition.style.display = "block";

    // Cacher les filtres
    if (filters) filters.style.display = "none";

    // Afficher le bouton modifier
    if (editButton) editButton.style.display = "block";

    // Déconnexion quand on clique sur logout
    boutonLoginLogout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
  // Si l'utilisateur n'est pas connecté
  else {
    boutonLoginLogout.textContent = "login";
    boutonLoginLogout.href = "pagelogin.html";

    // Cacher le bouton modifier
    if (editButton) editButton.style.display = "none";

    // Cacher le mode édition
    if (modeEdition) modeEdition.style.display = "none";

    // Afficher les filtres
    if (filters) filters.style.display = "flex";
  }
}

// Fonction pour afficher les images dans la modale
function displayGalleryInModal(works) {
  // Trouver la galerie dans la modale
  const modalGallery = document.querySelector(".gallerymodale");
  if (!modalGallery) {
    return;
  }

  // Vider la galerie
  modalGallery.innerHTML = "";

  // Pour chaque projet, créer une figure
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const figure = document.createElement("figure");

    // Créer l'image
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Créer le bouton de suppression
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteButton";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Fonction quand on clique sur supprimer
    deleteBtn.addEventListener("click", function () {
      deleteImage(work.id);
    });

    // Ajouter les éléments à la figure
    figure.appendChild(deleteBtn);
    figure.appendChild(img);

    // Ajouter la figure à la galerie
    modalGallery.appendChild(figure);
  }
}

// Fonction pour supprimer une image
async function deleteImage(id) {
  console.log("Suppression d'un projet");
  // Récupérer le token
  const token = localStorage.getItem("token");

  // J'essaie de supprimer l'image
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Image supprimée avec succès");

      // Mettre à jour les galeries
      const works = await getWorks();
      displayGallery(works, ".gallery"); // Mettre à jour galerie principale
      displayGalleryInModal(works); // Mettre à jour galerie modale
    } else {
      alert("Erreur lors de la suppression de l'image.");
    }
  } catch (error) {
    alert("Une erreur est survenue.");
  }
}

// Quand la page est chargée
document.addEventListener("DOMContentLoaded", function () {
  // Initialiser les fonctionnalités
  updateLoginLogout();
  init();
  envoyerEmailEtMdp();

  // Les éléments de la modale
  const editButton = document.getElementById("editButton");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  // Si les éléments n'existent pas, on arrête
  if (!editButton || !modal) {
    return;
  }

  // Quand on clique sur modifier
  editButton.addEventListener("click", async () => {
    console.log("Ouverture de la modale");
    // Ouvrir la modale
    modal.classList.add("show");
    modal.showModal();

    // Afficher la vue galerie par défaut
    const galleryView = document.getElementById("gallery-view");
    const addFormView = document.getElementById("add-form-view");

    if (galleryView && addFormView) {
      galleryView.style.display = "block";
      addFormView.style.display = "none";
    }

    // Charger les projets
    const works = await getWorks();
    displayGalleryInModal(works);
  });

  // Quand on clique pour fermer la modale
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      // Fermer la modale
      modal.classList.remove("show");
      modal.close();
    });
  }

  // Fermer la modale quand on clique à l'extérieur
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.close();
    }
  });

  // Basculer entre les vues
  const toggleFormButton = document.getElementById("toggleFormButton");
  const backButton = document.getElementById("backToGallery");
  const galleryView = document.getElementById("gallery-view");
  const addFormView = document.getElementById("add-form-view");

  // Quand on clique sur "Ajouter une photo"
  if (toggleFormButton && galleryView && addFormView) {
    toggleFormButton.addEventListener("click", () => {
      console.log("Navigation vers le formulaire d'ajout");
      galleryView.style.display = "none";
      addFormView.style.display = "block";

      // Réinitialiser le formulaire
      document.getElementById("uploadForm")?.reset();
    });
  }

  // Quand on clique sur la flèche retour
  if (backButton && galleryView && addFormView) {
    backButton.addEventListener("click", () => {
      console.log("Retour à la galerie");
      galleryView.style.display = "block";
      addFormView.style.display = "none";
    });
  }

  // Prévisualisation simplifiée de l'image
  document
    .getElementById("imageUpload")
    ?.addEventListener("change", function () {
      console.log("Prévisualisation de l'image");
      if (this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = document.getElementById("imagePreview");
          preview.innerHTML = `<img src="${e.target.result}" alt="Prévisualisation">`;
          preview.style.display = "block";

          // Cacher les éléments d'upload d'un coup
          document
            .querySelectorAll(
              ".image-upload-container i, .custom-file-upload, .image-upload-container p"
            )
            .forEach((el) => (el.style.display = "none"));
        };
        reader.readAsDataURL(this.files[0]);
      }
    });

  // Soumission simplifiée du formulaire
  document
    .getElementById("uploadForm")
    ?.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("Ajout d'un nouveau projet");

      // Récupérer les champs
      const imageFile = document.getElementById("imageUpload").files[0];
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;

      // Vérifier que tous les champs sont remplis
      if (!imageFile || !title || !category) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      // Envoyer à l'API
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", category);

        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        });

        if (response.ok) {
          console.log("Projet ajouté avec succès");

          // Mettre à jour les galeries
          const works = await getWorks();
          displayGallery(works, ".gallery");

          // Revenir à la vue galerie
          galleryView.style.display = "block";
          addFormView.style.display = "none";
          displayGalleryInModal(works);

          alert("Projet ajouté avec succès !");
        } else {
          alert("Erreur lors de l'ajout du projet");
        }
      } catch (error) {
        alert("Une erreur est survenue lors de l'envoi du projet.");
      }
    });
});
