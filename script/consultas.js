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
const form = document.getElementById('consultaForm');
const consultationReasonInput = document.getElementById('consultation_reason');  // Alterado para 'consultation_reason'
const vetNameInput = document.getElementById('vet_name');
const consultationDateInput = document.getElementById('consultation_date');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('consultaTableBody');

// Função para salvar a consulta no Firebase
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const consultationReason = consultationReasonInput.value;  // Alterado para 'consultation_reason'
    const vetName = vetNameInput.value;
    const consultationDate = consultationDateInput.value;
    const description = descriptionInput.value;

    // Adicionar a consulta no Firebase Realtime Database
    const newConsultationRef = push(ref(database, 'consultas'));
    set(newConsultationRef, {
        consultation_reason: consultationReason,  // Alterado para 'consultation_reason'
        vet_name: vetName,
        consultation_date: consultationDate,
        description: description
    });

    // Limpar os campos do formulário após o envio
    form.reset();
});

// Função para exibir as consultas na tabela
function displayConsultations() {
    const consultationsRef = ref(database, 'consultas');
    onValue(consultationsRef, function(snapshot) {
        const consultations = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        for (const key in consultations) {
            if (consultations.hasOwnProperty(key)) {
                const consultation = consultations[key];
                const tr = document.createElement("tr");
                tr.classList.add("border-b");
                tr.innerHTML = `
                    <td class="py-2 px-4">${consultation.consultation_reason}</td>  <!-- Alterado para 'consultation_reason' -->
                    <td class="py-2 px-4">${consultation.vet_name}</td>
                    <td class="py-2 px-4">${consultation.consultation_date}</td>
                    <td class="py-2 px-4">${consultation.description}</td>
                `;
                tableBody.appendChild(tr);
            }
        }
    });
}

// Chamar a função para carregar as consultas quando a página for carregada
window.onload = function() {
    displayConsultations();
};
