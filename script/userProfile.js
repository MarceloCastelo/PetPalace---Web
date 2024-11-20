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

// Importando funções do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para preencher os dados do usuário no formulário
function loadUserData(user) {
    if (user) {
        // Verificando se o nome (displayName) está presente, se não, mostra uma mensagem padrão
        const nome = user.displayName ? user.displayName : "Nome não disponível";
        const telefone = user.phoneNumber ? user.phoneNumber : "Telefone não disponível";
        
        // Preenchendo os campos com as informações do usuário
        document.getElementById("nome").value = nome;
        document.getElementById("email").value = user.email || "Email não disponível";
        document.getElementById("telefone").value = telefone;

        // Exibindo o botão de logout
        document.getElementById("logoutBtn").classList.remove("hidden");
    } else {
        // Redireciona para a tela de login se o usuário não estiver logado
        alert("Por favor, faça o login.");
        window.location.href = "./login.html"; // Redireciona para a página de login
    }
}

// Função de logout
function logout() {
    signOut(auth)
        .then(() => {
            alert("Você foi deslogado com sucesso!");
            window.location.href = "./login.html"; // Redireciona para a página de login após deslogar
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error.message);
        });
}

// Checando se o usuário está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserData(user); // Carrega os dados do usuário se ele estiver logado
    } else {
        loadUserData(null); // Redireciona para a página de login se o usuário não estiver logado
    }
});

// Adicionando o evento de logout
document.getElementById("logoutBtn").addEventListener("click", logout);
