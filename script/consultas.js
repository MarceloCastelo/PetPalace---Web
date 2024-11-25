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
const form = document.getElementById('consultaForm');
const consultationReasonInput = document.getElementById('consultation_reason');  // Alterado para 'consultation_reason'
const vetNameInput = document.getElementById('vet_name');
const consultationDateInput = document.getElementById('consultation_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('consultaTableBody');

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

// Função para salvar a consulta no Firebase dentro do pet
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

    const userId = auth.currentUser.uid;  // Obtém o ID do usuário autenticado

    // Adiciona a consulta no Firebase dentro do pet específico
    const newConsultationRef = push(ref(database, `Users/${userId}/Pets/${petId}/Consultas`));
    set(newConsultationRef, {
        consultation_reason: consultationReason,
        vet_name: vetName,
        consultation_date: consultationDate,
        description: description
    }).then(() => {
        alert('Consulta salva com sucesso!');
        form.reset();
        displayConsultations(userId, petId);  // Atualiza as consultas na tabela
    }).catch((error) => console.error('Erro ao salvar consulta:', error));
});

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
                    `;
                    tableBody.appendChild(tr);
                }
            }
        }
    });
}

// Carrega as consultas ao carregar a página
window.onload = function() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html';
    }
};
