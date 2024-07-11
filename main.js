// Déclaration des variables : Récupération des éléments du DOM
const libelle = document.getElementById('libelle');
const categorie = document.getElementById('categorie');
const description = document.getElementById('message');
const form = document.getElementById('ideaForm');
const ideasTableBody = document.getElementById('ideasTableBody');
let idees = [];


// Récupérer les données depuis localStorage au chargement de la page
const ideesFromStorage = JSON.parse(localStorage.getItem('idees')) || [];
idees = ideesFromStorage; // Mettre à jour le tableau personnes avec les données récupérées


// Ajout d'un écouteur d'événement pour la soumission du formulaire
form.addEventListener('submit', e => {
    e.preventDefault(); // Empêche la soumission par défaut du formulaire
    validateInputs(); // Appelle la fonction pour valider les entrées du formulaire
});

// Fonction pour afficher un message d'erreur
const setError = (element, message) => {
    const inputControl = element.parentElement; // Récupère le parent de l'élément (contrôle de saisie)
    const errorDisplay = inputControl.querySelector('.error'); // Sélectionne l'élément d'affichage de l'erreur

    errorDisplay.innerText = message; // Affiche le message d'erreur
    inputControl.classList.add('error'); // Ajoute la classe 'error' au contrôle de saisie
    inputControl.classList.remove('success'); // Supprime la classe 'success' si elle est présente
};

// Fonction pour afficher un succès
const setSuccess = element => {
    const inputControl = element.parentElement; // Récupère le parent de l'élément (contrôle de saisie)
    const errorDisplay = inputControl.querySelector('.error'); // Sélectionne l'élément d'affichage de l'erreur

    errorDisplay.innerText = ''; // Vide le message d'erreur
    inputControl.classList.add('success'); // Ajoute la classe 'success' au contrôle de saisie
    inputControl.classList.remove('error'); // Supprime la classe 'error' si elle est présente
};


// Fonction pour Réinitialiser les classes de succès/erreur
const resetFormFields = () => {
    libelle.value = '';
    categorie.value = '';
    description.value = '';

    libelle.parentElement.classList.remove('success', 'error');
    categorie.parentElement.classList.remove('success', 'error');
    description.parentElement.classList.remove('success', 'error');
    };

    const regexNoDigits = /^[^\d]*$/; // Expression régulière pour vérifier l'absence de chiffres

// Fonction pour valider les entrées du formulaire lors de la soumission
const validateInputs = () => {
    let isValid = true;

   // Validation du libelle
const valeurLibelle = libelle.value.trim();

if (valeurLibelle === '') {
    setError(libelle, 'Le libelle est obligatoire'); 
    isValid = false;
} else if (valeurLibelle.length < 5 || valeurLibelle.length > 50) {
    setError(libelle, 'Le libelle doit contenir entre 5 et 50 caractères'); 
    isValid = false;
} else if (!regexNoDigits.test(valeurLibelle)) {
    setError(libelle, 'Le libelle ne doit pas contenir de chiffres'); 
    isValid = false;
} else {
    setSuccess(libelle);
}


    // Validation de la categorie
    const valeurCategorie = categorie.value.trim();
    if (valeurCategorie === '') {
        setError(categorie, 'Vous devez choisir une catégorie'); 
        isValid = false;
    } else {
        setSuccess(categorie);
    }

    // Validation de la description
const valeurDescription = description.value.trim();
if (valeurDescription === '') {
    setError(description, 'La description est obligatoire'); 
    isValid = false;
} else if (valeurDescription.length < 10 || valeurDescription.length > 300) {
    setError(description, 'La description doit contenir entre 10 et 300 caractères'); 
    isValid = false;
} else if (!regexNoDigits.test(valeurDescription)) {
    setError(description, 'La description ne doit pas contenir de chiffres'); 
    isValid = false;
} else {
    setSuccess(description);
}


    // Si toutes les validations sont réussies, ajouter l'idée à la liste
    if (isValid) {
        const idee = {
            libelle: valeurLibelle,
            categorie: valeurCategorie,
            description: valeurDescription,
            status: 'Non Approuvée'
        };

        idees.push(idee); // Ajoute l'idée au tableau
        affichageIdee(); // Met à jour l'affichage de la liste des idées
        resetFormFields(); // Réinitialise le formulaire

        // Sauvegarder dans localStorage
        localStorage.setItem('idees', JSON.stringify(idees));
 
    }
};

// Fonction pour afficher la liste des idées
const affichageIdee = () => {
    ideasTableBody.innerHTML = ''; // Vide la table avant de la remplir à nouveau

    idees.forEach((idee, index) => {
        const row = ideasTableBody.insertRow(); // Insère une nouvelle ligne dans la table

        // Insertion des cellules dans la ligne
        const cellLibelle = row.insertCell();
        const cellCategorie = row.insertCell();
        const cellDescription = row.insertCell();
        const cellActions = row.insertCell();

        // Remplissage des cellules avec les informations de l'idée
        cellLibelle.textContent = idee.libelle;
        cellCategorie.textContent = idee.categorie;
        cellDescription.textContent = idee.description;


        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener('click', () => deleteIdea(index));

        cellActions.appendChild(deleteButton);

        
    });
    // Convertir le tableau idées en JSON pour le stockage ou l'envoi
    const ideesJSON = JSON.stringify(idees);
};
// Fonction pour supprimer une idée
const deleteIdea = index => {
    idees.splice(index, 1);
    affichageIdee();
    localStorage.setItem('idees', JSON.stringify(idees));
};

affichageIdee();
