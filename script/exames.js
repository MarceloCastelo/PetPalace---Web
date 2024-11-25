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
const form = document.getElementById('exameForm');
const examNameInput = document.getElementById('exam_name');
const vetNameInput = document.getElementById('vet_name');
const examDateInput = document.getElementById('exam_date');
const resultsInput = document.getElementById('results');
const tableBody = document.getElementById('exameTableBody');

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
        displayExams(user.uid, petId); // Carrega os exames do pet
    }
});

// Função para salvar o exame no Firebase dentro do pet
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const examName = examNameInput.value;
    const vetName = vetNameInput.value;
    const examDate = examDateInput.value;
    const results = resultsInput.value;

    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        return;
    }

    const userId = auth.currentUser.uid;  // Obtém o ID do usuário autenticado

    // Adiciona o exame no Firebase dentro do pet específico
    const newExamRef = push(ref(database, `Users/${userId}/Pets/${petId}/Exames`));
    set(newExamRef, {
        exam_name: examName,
        vet_name: vetName,
        exam_date: examDate,
        results: results
    }).then(() => {
        alert('Exame salvo com sucesso!');
        form.reset();
        displayExams(userId, petId);  // Atualiza os exames na tabela
    }).catch((error) => console.error('Erro ao salvar exame:', error));
});

// Função para exibir os exames na tabela
function displayExams(userId, petId) {
    const examsRef = ref(database, `Users/${userId}/Pets/${petId}/Exames`);
    onValue(examsRef, function(snapshot) {
        const exams = snapshot.val();
        tableBody.innerHTML = ""; // Limpar a tabela antes de preencher

        if (exams) {
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
        }
    });
}

// Carrega os exames ao carregar a página
window.onload = function() {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        alert('Nenhum pet selecionado!');
        window.location.href = './dashboard.html';
    }
};
