// Importar Firebase v11
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Referências do formulário e da tabela
const form = document.getElementById('vacinaForm');
const vaccineNameInput = document.getElementById('vaccine_name');
const vetNameInput = document.getElementById('vet_name');
const vaccineDateInput = document.getElementById('vaccine_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('vacinaTableBody');

// Função para salvar a vacina no Firebase
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const vaccineName = vaccineNameInput.value;
    const vetName = vetNameInput.value;
    const vaccineDate = vaccineDateInput.value;
    const description = descriptionInput.value;

    // Adicionar a vacina no Firebase Realtime Database
    const newVaccineRef = push(ref(database, 'vacinas'));
    set(newVaccineRef, {
        vaccine_name: vaccineName,
        vet_name: vetName,
        vaccine_date: vaccineDate,
        description: description
    });

    // Limpar os campos do formulário após o envio
    form.reset();
});

// Função para exibir as vacinas na tabela
function displayVaccines() {
    const vaccinesRef = ref(database, 'vacinas');
    onValue(vaccinesRef, function(snapshot) {
        const vaccines = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

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
    });
}

// Chamar a função para carregar as vacinas quando a página for carregada
window.onload = function() {
    displayVaccines();
};
