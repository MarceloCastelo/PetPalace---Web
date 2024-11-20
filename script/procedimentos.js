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
const form = document.getElementById('procedimentoForm');
const procedureNameInput = document.getElementById('procedure_name');
const vetNameInput = document.getElementById('vet_name');
const procedureDateInput = document.getElementById('procedure_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('procedimentoTableBody');

// Função para salvar o procedimento no Firebase
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const procedureName = procedureNameInput.value;
    const vetName = vetNameInput.value;
    const procedureDate = procedureDateInput.value;
    const description = descriptionInput.value;

    // Adicionar o procedimento no Firebase Realtime Database
    const newProcedureRef = push(ref(database, 'procedimentos'));
    set(newProcedureRef, {
        procedure_name: procedureName,
        vet_name: vetName,
        procedure_date: procedureDate,
        description: description
    });

    // Limpar os campos do formulário após o envio
    form.reset();
});

// Função para exibir os procedimentos na tabela
function displayProcedures() {
    const proceduresRef = ref(database, 'procedimentos');
    onValue(proceduresRef, function(snapshot) {
        const procedures = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        for (const key in procedures) {
            if (procedures.hasOwnProperty(key)) {
                const procedure = procedures[key];
                const tr = document.createElement("tr");
                tr.classList.add("border-b");
                tr.innerHTML = `
                    <td class="py-2 px-4">${procedure.procedure_name}</td>
                    <td class="py-2 px-4">${procedure.vet_name}</td>
                    <td class="py-2 px-4">${procedure.procedure_date}</td>
                    <td class="py-2 px-4">${procedure.description}</td>
                `;
                tableBody.appendChild(tr);
            }
        }
    });
}

// Chamar a função para carregar os procedimentos quando a página for carregada
window.onload = function() {
    displayProcedures();
};
