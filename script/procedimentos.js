// Importar Firebase v11
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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

// Variável para armazenar o ID do procedimento em edição
let currentProcedureKey = null;

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

// Função para salvar ou atualizar o procedimento no Firebase
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

    if (currentProcedureKey) {
        // Se houver um procedimento em edição, chama a função de atualização
        updateProcedure(userId, petId, currentProcedureKey, procedureName, vetName, procedureDate, description);
    } else {
        // Se não houver procedimento em edição, cria um novo
        addProcedure(userId, petId, procedureName, vetName, procedureDate, description);
    }
});

// Função para adicionar um novo procedimento no Firebase
function addProcedure(userId, petId, procedureName, vetName, procedureDate, description) {
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
}

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
                        <td class="py-2 px-4 text-center">
                            <button class="edit-btn bg-blue-500 text-white p-1 rounded-lg" data-key="${key}">Editar</button>
                            <button class="delete-btn bg-red-500 text-white p-1 rounded-lg ml-2" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(tr);

                    // Adicionar evento de edição
                    tr.querySelector(".edit-btn").addEventListener("click", function() {
                        const procedureKey = this.getAttribute("data-key");
                        editProcedure(userId, petId, procedureKey);
                    });

                    // Adicionar evento de exclusão
                    tr.querySelector(".delete-btn").addEventListener("click", function() {
                        const procedureKey = this.getAttribute("data-key");
                        deleteProcedure(userId, petId, procedureKey);
                    });
                }
            }
        }
    });
}

// Função para editar o procedimento
function editProcedure(userId, petId, procedureKey) {
    const procedureRef = ref(database, `Users/${userId}/Pets/${petId}/Procedimentos/${procedureKey}`);
    onValue(procedureRef, function(snapshot) {
        const procedure = snapshot.val();
        if (procedure) {
            procedureNameInput.value = procedure.procedure_name;
            vetNameInput.value = procedure.vet_name;
            procedureDateInput.value = procedure.procedure_date;
            descriptionInput.value = procedure.description;

            // Guardar a chave do procedimento em edição
            currentProcedureKey = procedureKey;
        }
    });
}

// Função para atualizar o procedimento no Firebase
function updateProcedure(userId, petId, procedureKey, procedureName, vetName, procedureDate, description) {
    const procedureRef = ref(database, `Users/${userId}/Pets/${petId}/Procedimentos/${procedureKey}`);
    set(procedureRef, {
        procedure_name: procedureName,
        vet_name: vetName,
        procedure_date: procedureDate,
        description: description
    }).then(() => {
        // alert('Procedimento atualizado com sucesso!');
        form.reset();
        currentProcedureKey = null; // Limpar a chave do procedimento em edição
        displayProcedures(userId, petId);  // Atualiza os procedimentos na tabela
    }).catch((error) => console.error('Erro ao atualizar procedimento:', error));
}

// Função para excluir o procedimento
function deleteProcedure(userId, petId, procedureKey) {
    const procedureRef = ref(database, `Users/${userId}/Pets/${petId}/Procedimentos/${procedureKey}`);
    remove(procedureRef).then(() => {
        // alert('Procedimento excluído com sucesso!');
        displayProcedures(userId, petId);  // Atualiza a tabela após a exclusão
    }).catch((error) => console.error('Erro ao excluir procedimento:', error));
}

// Carrega os procedimentos ao carregar a página
window.onload = function() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html';
    }
};
