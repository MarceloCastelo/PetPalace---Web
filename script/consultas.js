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
const form = document.getElementById('consultaForm');
const consultationReasonInput = document.getElementById('consultation_reason');
const vetNameInput = document.getElementById('vet_name');
const consultationDateInput = document.getElementById('consultation_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('consultaTableBody');

// Variável para armazenar o ID da consulta em edição
let currentConsultationKey = null;

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
        displayConsultations(user.uid, petId); // Carrega as consultas do pet
    }
});

// Função para salvar ou atualizar a consulta no Firebase
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const consultationReason = consultationReasonInput.value;
    const vetName = vetNameInput.value;
    const consultationDate = consultationDateInput.value;
    const description = descriptionInput.value;

    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        return;
    }

    const userId = auth.currentUser.uid; // Obtém o ID do usuário autenticado

    if (currentConsultationKey) {
        // Se houver uma consulta em edição, chama a função de atualização
        updateConsultation(userId, petId, currentConsultationKey, consultationReason, vetName, consultationDate, description);
    } else {
        // Se não houver consulta em edição, cria uma nova
        addConsultation(userId, petId, consultationReason, vetName, consultationDate, description);
    }
});

// Função para adicionar uma nova consulta no Firebase
function addConsultation(userId, petId, consultationReason, vetName, consultationDate, description) {
    const newConsultationRef = push(ref(database, `Users/${userId}/Pets/${petId}/Consultas`));
    set(newConsultationRef, {
        consultation_reason: consultationReason,
        vet_name: vetName,
        consultation_date: consultationDate,
        description: description
    }).then(() => {
        // alert('Consulta salva com sucesso!');
        form.reset();
        displayConsultations(userId, petId); // Atualiza as consultas na tabela
    }).catch((error) => console.error('Erro ao salvar consulta:', error));
}

// Função para exibir as consultas na tabela
function displayConsultations(userId, petId) {
    const consultationsRef = ref(database, `Users/${userId}/Pets/${petId}/Consultas`);
    onValue(consultationsRef, function(snapshot) {
        const consultations = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        if (consultations) {
            for (const key in consultations) {
                if (consultations.hasOwnProperty(key)) {
                    const consultation = consultations[key];
                    const tr = document.createElement("tr");
                    tr.classList.add("border-b");
                    tr.innerHTML = `
                        <td class="py-2 px-4">${consultation.consultation_reason}</td>
                        <td class="py-2 px-4">${consultation.vet_name}</td>
                        <td class="py-2 px-4">${consultation.consultation_date}</td>
                        <td class="py-2 px-4">${consultation.description}</td>
                        <td class="py-2 px-4 text-center">
                            <button class="edit-btn bg-blue-500 text-white p-1 rounded-lg" data-key="${key}">Editar</button>
                            <button class="delete-btn bg-red-500 text-white p-1 rounded-lg ml-2" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(tr);

                    // Adicionar evento de edição
                    tr.querySelector(".edit-btn").addEventListener("click", function() {
                        const consultationKey = this.getAttribute("data-key");
                        editConsultation(userId, petId, consultationKey);
                    });

                    // Adicionar evento de exclusão
                    tr.querySelector(".delete-btn").addEventListener("click", function() {
                        const consultationKey = this.getAttribute("data-key");
                        deleteConsultation(userId, petId, consultationKey);
                    });
                }
            }
        }
    });
}

// Função para editar a consulta
function editConsultation(userId, petId, consultationKey) {
    const consultationRef = ref(database, `Users/${userId}/Pets/${petId}/Consultas/${consultationKey}`);
    onValue(consultationRef, function(snapshot) {
        const consultation = snapshot.val();
        if (consultation) {
            consultationReasonInput.value = consultation.consultation_reason;
            vetNameInput.value = consultation.vet_name;
            consultationDateInput.value = consultation.consultation_date;
            descriptionInput.value = consultation.description;

            // Guardar a chave da consulta em edição
            currentConsultationKey = consultationKey;
        }
    });
}

// Função para atualizar a consulta no Firebase
function updateConsultation(userId, petId, consultationKey, consultationReason, vetName, consultationDate, description) {
    const consultationRef = ref(database, `Users/${userId}/Pets/${petId}/Consultas/${consultationKey}`);
    set(consultationRef, {
        consultation_reason: consultationReason,
        vet_name: vetName,
        consultation_date: consultationDate,
        description: description
    }).then(() => {
        // alert('Consulta atualizada com sucesso!');
        form.reset();
        currentConsultationKey = null; // Limpar a chave da consulta em edição
        displayConsultations(userId, petId); // Atualiza as consultas na tabela
    }).catch((error) => console.error('Erro ao atualizar consulta:', error));
}

// Função para excluir a consulta
function deleteConsultation(userId, petId, consultationKey) {
    const consultationRef = ref(database, `Users/${userId}/Pets/${petId}/Consultas/${consultationKey}`);
    remove(consultationRef).then(() => {
        // alert('Consulta excluída com sucesso!');
        displayConsultations(userId, petId); // Atualiza a tabela após a exclusão
    }).catch((error) => console.error('Erro ao excluir consulta:', error));
}
