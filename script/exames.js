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
const form = document.getElementById('exameForm');
const examNameInput = document.getElementById('exam_name');
const vetNameInput = document.getElementById('vet_name');
const examDateInput = document.getElementById('exam_date');
const resultsInput = document.getElementById('results');
const tableBody = document.getElementById('exameTableBody');

// Função para salvar o exame no Firebase
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const examName = examNameInput.value;
    const vetName = vetNameInput.value;
    const examDate = examDateInput.value;
    const results = resultsInput.value;

    // Adicionar o exame no Firebase Realtime Database
    const newExamRef = push(ref(database, 'exames'));
    set(newExamRef, {
        exam_name: examName,
        vet_name: vetName,
        exam_date: examDate,
        results: results
    });

    // Limpar os campos do formulário após o envio
    form.reset();
});

// Função para exibir os exames na tabela
function displayExams() {
    const examsRef = ref(database, 'exames');
    onValue(examsRef, function(snapshot) {
        const exams = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        for (const key in exams) {
            if (exams.hasOwnProperty(key)) {
                const exam = exams[key];
                const tr = document.createElement("tr");
                tr.classList.add("border-b");
                tr.innerHTML = `
                    <td class="py-2 px-4">${exam.exam_name}</td>
                    <td class="py-2 px-4">${exam.vet_name}</td>
                    <td class="py-2 px-4">${exam.exam_date}</td>
                    <td class="py-2 px-4">${exam.results}</td>
                `;
                tableBody.appendChild(tr);
            }
        }
    });
}

// Chamar a função para carregar os exames quando a página for carregada
window.onload = function() {
    displayExams();
};
