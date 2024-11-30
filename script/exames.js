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
const form = document.getElementById('exameForm');
const examNameInput = document.getElementById('exam_name');
const vetNameInput = document.getElementById('vet_name');
const examDateInput = document.getElementById('exam_date');
const resultsInput = document.getElementById('results');
const tableBody = document.getElementById('exameTableBody');

// Variável para armazenar o ID do exame em edição
let currentExamKey = null;

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

// Função para salvar ou atualizar o exame no Firebase
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

    if (currentExamKey) {
        // Se houver um exame em edição, chama a função de atualização
        updateExam(userId, petId, currentExamKey, examName, vetName, examDate, results);
    } else {
        // Se não houver exame em edição, cria um novo
        addExam(userId, petId, examName, vetName, examDate, results);
    }
});

// Função para adicionar um novo exame no Firebase
function addExam(userId, petId, examName, vetName, examDate, results) {
    const newExamRef = push(ref(database, `Users/${userId}/Pets/${petId}/Exames`));
    set(newExamRef, {
        exam_name: examName,
        vet_name: vetName,
        exam_date: examDate,
        results: results
    }).then(() => {
        form.reset();
        displayExams(userId, petId);  // Atualiza os exames na tabela
    }).catch((error) => console.error('Erro ao salvar exame:', error));
}

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
                        <td class="py-2 px-4 text-center">
                            <button class="edit-btn bg-blue-500 text-white p-1 rounded-lg" data-key="${key}">Editar</button>
                            <button class="delete-btn bg-red-500 text-white p-1 rounded-lg ml-2" data-key="${key}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(tr);

                    // Adicionar evento de edição
                    tr.querySelector(".edit-btn").addEventListener("click", function() {
                        const examKey = this.getAttribute("data-key");
                        editExam(userId, petId, examKey);
                    });

                    // Adicionar evento de exclusão
                    tr.querySelector(".delete-btn").addEventListener("click", function() {
                        const examKey = this.getAttribute("data-key");
                        deleteExam(userId, petId, examKey);
                    });
                }
            }
        }
    });
}

// Função para editar o exame
function editExam(userId, petId, examKey) {
    const examRef = ref(database, `Users/${userId}/Pets/${petId}/Exames/${examKey}`);
    onValue(examRef, function(snapshot) {
        const exam = snapshot.val();
        if (exam) {
            examNameInput.value = exam.exam_name;
            vetNameInput.value = exam.vet_name;
            examDateInput.value = exam.exam_date;
            resultsInput.value = exam.results;

            // Guardar a chave do exame em edição
            currentExamKey = examKey;
        }
    });
}

// Função para atualizar o exame no Firebase
function updateExam(userId, petId, examKey, examName, vetName, examDate, results) {
    const examRef = ref(database, `Users/${userId}/Pets/${petId}/Exames/${examKey}`);
    set(examRef, {
        exam_name: examName,
        vet_name: vetName,
        exam_date: examDate,
        results: results
    }).then(() => {
        form.reset();
        currentExamKey = null; // Limpar a chave do exame em edição
        displayExams(userId, petId);  // Atualiza os exames na tabela
    }).catch((error) => console.error('Erro ao atualizar exame:', error));
}

// Função para excluir o exame
function deleteExam(userId, petId, examKey) {
    const examRef = ref(database, `Users/${userId}/Pets/${petId}/Exames/${examKey}`);
    remove(examRef).then(() => {
        displayExams(userId, petId);  // Atualiza a tabela após a exclusão
    }).catch((error) => console.error('Erro ao excluir exame:', error));
}

// Função para exportar os exames para PDF
document.getElementById("exportPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text("Exames Registrados", 14, 20);

    // Definir a tabela no PDF
    let yOffset = 30;
    doc.setFontSize(12);
    const tableHeaders = ["Nome do Exame", "Veterinário", "Data", "Resultados"];
    
    // Tabela: cabeçalho
    tableHeaders.forEach((header, index) => {
        doc.text(header, 14 + (index * 45), yOffset);
    });

    // Preencher a tabela com os dados dos exames
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    yOffset += 10; // Ajuste da altura para a primeira linha de dados

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        Array.from(cells).forEach((cell, index) => {
            doc.text(cell.textContent, 14 + (index * 45), yOffset);
        });
        yOffset += 10; // Deslocamento para a próxima linha
    });

    // Salvar o PDF
    doc.save("exames_pet.pdf");
});
