// Déclaration des variables : Récupération des éléments du DOM
const libelle = document.getElementById('libelle');
const categorie = document.getElementById('categorie');
const description = document.getElementById('message');
const form = document.getElementById('ideaForm');
const ideasTableBody = document.getElementById('ideasTableBody');
let idees = [];
// Expressions régulières pour vérifier l'absence de chiffres et de balises HTML
const regexNoDigits = /^[^\d]*$/; 
const regexNoHTML = /<\/?[^>]+(>|$)/g; 

// Liste des catégories valides
const validCategories = ["politique", "sport", "sante", "education", "autre"];

// Récupérer les données depuis localStorage au chargement de la page
const ideesFromStorage = JSON.parse(localStorage.getItem('idees')) || [];
idees = ideesFromStorage; // Mettre à jour le tableau idees avec les données récupérées

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

// Fonction pour réinitialiser les champs
const resetFormFields = () => {
    libelle.value = '';
    categorie.value = '';
    description.value = '';

    libelle.parentElement.classList.remove('success', 'error');
    categorie.parentElement.classList.remove('success', 'error');
    description.parentElement.classList.remove('success', 'error');
};


// Fonction pour afficher un message pendant une durée spécifiée
const displayMessage = (message, isSuccess) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isSuccess ? 'success' : 'error');
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Masquer le formulaire pendant l'affichage du message
    form.style.display = 'none';

    setTimeout(() => {
        document.body.removeChild(messageDiv);
        form.style.display = 'block'; // Afficher à nouveau le formulaire après 2 secondes
    }, 2000); // Affiche le message pendant 2 secondes
};

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
    } else if (regexNoHTML.test(valeurLibelle)) {
        setError(libelle, 'Le libelle ne doit pas contenir de balises HTML');
        isValid = false;
    } else {
        setSuccess(libelle);
    }

    // Validation de la categorie
    const valeurCategorie = categorie.value.trim();
    if (valeurCategorie === '') {
        setError(categorie, 'Vous devez choisir une catégorie');
        isValid = false;
    } else if (!validCategories.includes(valeurCategorie)) {
        setError(categorie, "Cette catégorie n'existe pas");
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

    // Afficher un message d'erreur si les validations ont échoué
    if (!isValid) {
        displayMessage('Veuillez corriger les erreurs dans le formulaire.', false);
        return;
    }

    // Si toutes les validations sont réussies, ajouter l'idée à la liste
    const idee = {
        libelle: valeurLibelle,
        categorie: valeurCategorie,
        description: valeurDescription,
        status: 'Approuvée' // Par défaut, chaque idée est approuvée
    };

    // Si nous éditons une idée existante, mettre à jour cette idée
    if (editIndex !== null) {
        idees[editIndex] = idee; // Met à jour l'idée existante dans le tableau idees à l'index editIndex
        editIndex = null; // Réinitialise l'index d'édition pour indiquer que l'édition est terminée
        form.querySelector('button[type="submit"]').textContent = 'Soumettre'; // Rétablit le texte du bouton de soumission
    } else {
        idees.push(idee); // Ajoute l'idée au tableau idees s'il s'agit d'une nouvelle idée
    }


    affichageIdee(); // Met à jour l'affichage de la liste des idées
    resetFormFields(); // Réinitialise le formulaire

    // Afficher un message de succès
    displayMessage('L\'idée a été ajoutée avec succès.', true);

    // Sauvegarder dans localStorage
    localStorage.setItem('idees', JSON.stringify(idees));
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
        const cellStatut = row.insertCell();
        const cellActions = row.insertCell();

        // Remplissage des cellules avec les informations de l'idée
        cellLibelle.textContent = idee.libelle;
        cellCategorie.textContent = idee.categorie;
        cellDescription.textContent = idee.description;

        // Affichage du statut 
        const statusIcon = document.createElement('i');
        statusIcon.classList.add('fas', idee.status === 'Approuvée' ? 'fa-check-circle' : 'fa-times-circle');
        statusIcon.style.color = idee.status === 'Approuvée' ? 'green' : 'red';
        cellStatut.appendChild(statusIcon);

        // Création des boutons d'actions
        const approveButton = document.createElement('button');
        approveButton.classList.add('btn', 'btn-success', 'btn-sm');
        approveButton.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        approveButton.addEventListener('click', () => approveIdea(index));

        const disapproveButton = document.createElement('button');
        disapproveButton.classList.add('btn', 'btn-warning', 'btn-sm');
        disapproveButton.innerHTML = '<i class="fas fa-thumbs-down"></i>';
        disapproveButton.addEventListener('click', () => disapproveIdea(index));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener('click', () => deleteIdea(index));

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'btn-sm');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => editIdea(index));

        cellActions.appendChild(approveButton);
        cellActions.appendChild(disapproveButton);
        cellActions.appendChild(deleteButton);
        cellActions.appendChild(editButton);
    });
};

// Fonction pour approuver une idée
const approveIdea = index => {
    idees[index].status = 'Approuvée';
    affichageIdee();
    localStorage.setItem('idees', JSON.stringify(idees));
};

// Fonction pour désapprouver une idée
const disapproveIdea = index => {
    idees[index].status = 'Désapprouvée';
    affichageIdee();
    localStorage.setItem('idees', JSON.stringify(idees));
};

// Fonction pour supprimer une idée
const deleteIdea = index => {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette idée ?");
    if (confirmation) {
        idees.splice(index, 1); // Utilisation de splice pour supprimer l'idée à l'index donné
        affichageIdee();
        localStorage.setItem('idees', JSON.stringify(idees));
    }
};


// Variable pour stocker l'index de l'idée à modifier
let editIndex = null;

// Fonction pour éditer une idée
const editIdea = index => {
    editIndex = index;
    const idee = idees[index];

    libelle.value = idee.libelle;
    categorie.value = idee.categorie;
    description.value = idee.description;

    // Modifier le texte du bouton de soumission
    form.querySelector('button[type="submit"]').textContent = 'Modifier l\'idée';
};

// Afficher les idées au chargement de la page
affichageIdee();
