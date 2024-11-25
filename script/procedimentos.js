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
const form = document.getElementById('procedimentoForm');
const procedureNameInput = document.getElementById('procedure_name');
const vetNameInput = document.getElementById('vet_name');
const procedureDateInput = document.getElementById('procedure_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('procedimentoTableBody');

// Verifica autenticação do usuário e carrega o pet selecionado
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
        displayProcedures(user.uid, petId); // Carrega os procedimentos do pet
    }
});

// Função para salvar o procedimento no Firebase dentro do pet
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const procedureName = procedureNameInput.value;
    const vetName = vetNameInput.value;
    const procedureDate = procedureDateInput.value;
    const description = descriptionInput.value;

    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        return;
    }

    const userId = auth.currentUser.uid;  // Obtém o ID do usuário autenticado

    // Adiciona o procedimento no Firebase dentro do pet específico
    const newProcedureRef = push(ref(database, `Users/${userId}/Pets/${petId}/Procedimentos`));
    set(newProcedureRef, {
        procedure_name: procedureName,
        vet_name: vetName,
        procedure_date: procedureDate,
        description: description
    }).then(() => {
        alert('Procedimento salvo com sucesso!');
        form.reset();
        displayProcedures(userId, petId);  // Atualiza os procedimentos na tabela
    }).catch((error) => console.error('Erro ao salvar procedimento:', error));
});

// Função para exibir os procedimentos na tabela
function displayProcedures(userId, petId) {
    const proceduresRef = ref(database, `Users/${userId}/Pets/${petId}/Procedimentos`);
    onValue(proceduresRef, function(snapshot) {
        const procedures = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        if (procedures) {
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
        }
    });
}

// Carrega os procedimentos ao carregar a página
window.onload = function() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html';
    }
};
