import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCV5itkomLJsUWOTq6rgs3DsUa7LB4giMU",
    authDomain: "petvitaoriginal.firebaseapp.com",
    databaseURL: "https://petvitaoriginal-default-rtdb.firebaseio.com",
    projectId: "petvitaoriginal",
    storageBucket: "petvitaoriginal.appspot.com",
    messagingSenderId: "154097214013",
    appId: "1:154097214013:web:383b976afe2f03fd350054"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();

// Elementos DOM
const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');
const petModal = document.getElementById('pet-modal');
const circleButton = document.querySelector('.fixed.bottom-10.right-10 button');
const closeModalButton = document.getElementById('close-modal');
const petCardsContainer = document.getElementById('pet-cards-container');
const petPhotoInput = document.getElementById('pet-photo');
const fileNameDisplay = document.getElementById('file-name');
const savePetButton = document.getElementById('save-pet');
const searchInput = document.querySelector('input[type="search"]'); // Barra de pesquisa

// Variáveis de controle
let isEditMode = false;
let currentPetId = null;

// Verifica autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = './login.html';
    } else {
        loadPets(); // Carrega os pets inicialmente
    }
});


 // Alterna a visibilidade do menu ao clicar no botão
 userMenuButton.addEventListener('click', () => {
    userMenu.classList.toggle('hidden'); // Alterna a classe 'hidden' para mostrar ou esconder o menu
});


// Abre ou fecha o modal
circleButton.addEventListener('click', () => openModal());
closeModalButton.addEventListener('click', () => closeModal());

// Atualiza nome do arquivo selecionado
petPhotoInput.addEventListener('change', (e) => {
    const fileName = e.target.files[0]?.name || '';
    fileNameDisplay.textContent = fileName ? `Arquivo escolhido: ${fileName}` : '';
});

// Salva ou atualiza pet
savePetButton.addEventListener('click', () => {
    const petName = document.getElementById('pet-name').value.trim();
    const petType = document.getElementById('pet-type').value.trim();
    const petGender = document.getElementById('pet-gender').value.trim();
    const petPhoto = petPhotoInput.files[0];

    if (!petName || !petType || !petGender) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (petPhoto) {
        const reader = new FileReader();
        reader.onload = () => {
            if (isEditMode) {
                updatePet(reader.result, petName, petType, petGender);
            } else {
                savePet(reader.result, petName, petType, petGender);
            }
        };
        reader.readAsDataURL(petPhoto);
    } else if (isEditMode) {
        updatePet(null, petName, petType, petGender);
    } else {
        alert('Por favor, selecione uma foto do pet.');
    }
});

// Abre o modal para adicionar ou editar
function openModal(pet = null) {
    resetForm();

    if (pet) {
        isEditMode = true;
        currentPetId = pet.key;

        document.getElementById('pet-name').value = pet.dataPetName;
        document.getElementById('pet-type').value = pet.dataPetType;
        document.getElementById('pet-gender').value = pet.dataPetGender;

        savePetButton.textContent = 'Atualizar';
    } else {
        isEditMode = false;
        currentPetId = null;
        savePetButton.textContent = 'Salvar';
    }

    petModal.classList.remove('hidden');
}

// Fecha o modal
function closeModal() {
    petModal.classList.add('hidden');
    resetForm();
}

// Salva um novo pet
function savePet(imageData, petName, petType, petGender) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const petRef = push(ref(database, `Users/${userId}/Pets`));

        set(petRef, {
            dataPetName: petName,
            dataPetType: petType,
            dataPetGender: petGender,
            dataImage: imageData,
            key: petRef.key
        }).then(() => {
            alert('Pet salvo com sucesso!');
            loadPets();
            closeModal();
        }).catch((error) => console.error('Erro ao salvar o pet:', error));
    }
}

// Atualiza um pet existente
function updatePet(imageData, petName, petType, petGender) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const petRef = ref(database, `Users/${userId}/Pets/${currentPetId}`);

        get(petRef).then((snapshot) => {
            const petData = snapshot.val();
            set(petRef, {
                dataPetName: petName,
                dataPetType: petType,
                dataPetGender: petGender,
                dataImage: imageData || petData.dataImage,
                key: currentPetId
            }).then(() => {
                alert('Pet atualizado com sucesso!');
                loadPets();
                closeModal();
            }).catch((error) => console.error('Erro ao atualizar o pet:', error));
        });
    }
}

// Remove um pet
function removePet(petId) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const petRef = ref(database, `Users/${userId}/Pets/${petId}`);

        if (confirm('Tem certeza que deseja remover este pet?')) {
            remove(petRef).then(() => {
                alert('Pet removido com sucesso!');
                loadPets();
            }).catch((error) => console.error('Erro ao remover o pet:', error));
        }
    }
}

// Carrega os pets do usuário com base na pesquisa
function loadPets(searchTerm = '') {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userPetsRef = ref(database, `Users/${userId}/Pets`);

        get(userPetsRef).then((snapshot) => {
            petCardsContainer.innerHTML = ''; // Limpa os cards existentes

            if (snapshot.exists()) {
                const pets = snapshot.val();
                // Filtra os pets com base no termo de pesquisa
                const filteredPets = Object.values(pets).filter((pet) => {
                    return pet.dataPetName.toLowerCase().includes(searchTerm) ||
                           pet.dataPetType.toLowerCase().includes(searchTerm) ||
                           pet.dataPetGender.toLowerCase().includes(searchTerm);
                });

                // Cria o card para cada pet filtrado
                filteredPets.forEach((pet) => createPetCard(pet));
            } else {
                console.log('Nenhum pet encontrado.');
            }
        }).catch((error) => console.error('Erro ao carregar os pets:', error));
    }
}

// Cria um card para cada pet
function createPetCard(pet) {
    const petCard = document.createElement('div');
    petCard.classList.add('bg-white', 'rounded-lg', 'p-4', 'shadow-lg', 'm-4', 'max-w-xs', 'w-full', 'lg:w-64', 'xl:w-72');
    petCard.setAttribute('data-pet-id', pet.key);

    // Estrutura do card
    petCard.innerHTML = `
        <img src="${pet.dataImage}" alt="${pet.dataPetName}" class="w-full h-48 object-cover rounded-md mb-4">
        <h3 class="text-xl font-semibold text-center">${pet.dataPetName}</h3>
        <p class="text-sm text-gray-600 text-center">${pet.dataPetType}</p>
        <p class="text-sm text-gray-600 text-center">${pet.dataPetGender}</p>
        <div class="flex justify-center mt-4 space-x-4">
            <button class="edit-pet bg-blue-500 text-white px-4 py-2 rounded-md">Editar</button>
            <button class="delete-pet bg-red-500 text-white px-4 py-2 rounded-md">Remover</button>
        </div>
    `;

    // Adiciona evento para redirecionar ao clicar no card
    petCard.addEventListener('click', (event) => {
        if (!event.target.classList.contains('edit-pet') && !event.target.classList.contains('delete-pet')) {
            localStorage.setItem('selectedPetId', pet.key);
            window.location.href = './informacoesPet.html';
        }
    });

    // Botão de editar
    petCard.querySelector('.edit-pet').addEventListener('click', (event) => {
        event.stopPropagation(); // Impede o redirecionamento ao clicar no botão
        openModal(pet);
    });

    // Botão de remover
    petCard.querySelector('.delete-pet').addEventListener('click', (event) => {
        event.stopPropagation(); // Impede o redirecionamento ao clicar no botão
        removePet(pet.key);
    });

    petCardsContainer.appendChild(petCard);
}

// Barra de pesquisa
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    loadPets(searchTerm); // Recarrega os pets filtrados com base no termo de pesquisa
});

// Limpar formulário do modal
function resetForm() {
    document.getElementById('pet-name').value = '';
    document.getElementById('pet-type').value = '';
    document.getElementById('pet-gender').value = '';
    petPhotoInput.value = '';
    fileNameDisplay.textContent = '';
}
