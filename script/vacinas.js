// Importar Firebase v11
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Referências do formulário e da tabela
const form = document.getElementById('vacinaForm');
const vaccineNameInput = document.getElementById('vaccine_name');
const vetNameInput = document.getElementById('vet_name');
const vaccineDateInput = document.getElementById('vaccine_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('vacinaTableBody');

// Verifica a autenticação do usuário e carrega o pet selecionado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = './login.html'; // Redireciona para o login se não houver autenticação
    } else {
        const petId = localStorage.getItem('selectedPetId');
        if (!petId) {
            alert('Nenhum pet selecionado!');
            window.location.href = './dashboard.html'; // Redireciona se não houver pet selecionado
            return;
        }
        displayVaccines(user.uid, petId); // Carrega as vacinas do pet
    }
});

// Função para salvar a vacina no Firebase dentro do pet
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const vaccineName = vaccineNameInput.value;
    const vetName = vetNameInput.value;
    const vaccineDate = vaccineDateInput.value;
    const description = descriptionInput.value;

    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        return;
    }

    const userId = auth.currentUser.uid;  // Obtém o ID do usuário autenticado

    // Adiciona a vacina no Firebase dentro do pet específico
    const newVaccineRef = push(ref(database, `Users/${userId}/Pets/${petId}/Vacinas`));
    set(newVaccineRef, {
        vaccine_name: vaccineName,
        vet_name: vetName,
        vaccine_date: vaccineDate,
        description: description
    }).then(() => {
        alert('Vacina salva com sucesso!');
        form.reset();
        displayVaccines(userId, petId);  // Atualiza as vacinas na tabela
    }).catch((error) => console.error('Erro ao salvar vacina:', error));
});

// Função para exibir as vacinas na tabela
function displayVaccines(userId, petId) {
    const vaccinesRef = ref(database, `Users/${userId}/Pets/${petId}/Vacinas`);
    onValue(vaccinesRef, function(snapshot) {
        const vaccines = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        if (vaccines) {
            for (const key in vaccines) {
                if (vaccines.hasOwnProperty(key)) {
                    const vaccine = vaccines[key];
                    const tr = document.createElement("tr");
                    tr.classList.add("border-b");
                    tr.innerHTML = `
                        <td class="py-2 px-4">${vaccine.vaccine_name}</td>
                        <td class="py-2 px-4">${vaccine.vet_name}</td>
                        <td class="py-2 px-4">${vaccine.vaccine_date}</td>
                        <td class="py-2 px-4">${vaccine.description}</td>
                    `;
                    tableBody.appendChild(tr);
                }
            }
        }
    });
}

// Carrega as vacinas ao carregar a página
window.onload = function() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html';
    }
};
