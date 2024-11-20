import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    // Recupera o ID do pet selecionado
    const petId = localStorage.getItem('selectedPetId');

    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html'; // Redireciona para outra página caso o ID não exista
        return;
    }

    // Verifica a autenticação do usuário
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = './login.html';
        } else {
            loadPetInfo(user.uid, petId);
        }
    });

    // Carrega as informações do pet
    function loadPetInfo(userId, petId) {
        const petRef = ref(database, `Users/${userId}/Pets/${petId}`);

        get(petRef).then((snapshot) => {
            if (snapshot.exists()) {
                const pet = snapshot.val();
                displayPetInfo(pet);
            } else {
                alert('Informações do pet não encontradas.');
                window.location.href = './dashboard.html';
            }
        }).catch((error) => console.error('Erro ao carregar as informações do pet:', error));
    }

    // Exibe as informações do pet na interface
    function displayPetInfo(pet) {
        document.getElementById('pet-name').textContent = pet.dataPetName;
        document.getElementById('pet-type').textContent = pet.dataPetType;
        document.getElementById('pet-gender').textContent = pet.dataPetGender;
        document.getElementById('pet-image').src = pet.dataImage;
    }

    // Adiciona eventos de clique nos cards
    document.getElementById('card-consultas').addEventListener('click', () => {
        window.location.href = './consultas.html'; // Redireciona para a tela de consultas
    });
    document.getElementById('card-exames').addEventListener('click', () => {
        window.location.href = './exames.html'; // Redireciona para a tela de exames
    });
    document.getElementById('card-procedimentos').addEventListener('click', () => {
        window.location.href = './procedimentos.html'; // Redireciona para a tela de procedimentos
    });
    document.getElementById('card-vacinas').addEventListener('click', () => {
        window.location.href = './vacinas.html'; // Redireciona para a tela de vacinas
    });
});
