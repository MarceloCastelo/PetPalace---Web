import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Função para carregar os dados do usuário
function loadUserData(user) {
    if (user) {
        const userRef = ref(database, `Users/${user.uid}`); // Corrigido para salvar em 'Users'
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById("nome").value = data.nome || user.displayName || "Nome não disponível";
                document.getElementById("email").value = data.email || user.email || "Email não disponível";
                document.getElementById("telefone").value = data.telefone || "Telefone não disponível";
                document.getElementById("endereco").value = data.endereco || "Endereço não disponível";
                document.getElementById("dataNascimento").value = data.dataNascimento || "";
                document.getElementById("genero").value = data.genero || "nao_informar";
                if (data.fotoPerfil) {
                    document.getElementById("fotoPreview").src = data.fotoPerfil;
                }
            }
        });
        document.getElementById("logoutBtn").classList.remove("hidden");
    } else {
        alert("Por favor, faça o login.");
        window.location.href = "/login"; // Redireciona para a página de login
    }
}

// Função para salvar os dados do perfil
function salvarPerfil() {
    const user = auth.currentUser;
    if (user) {
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const genero = document.getElementById("genero").value;
        const fotoPerfil = document.getElementById("foto").files[0];

        // Atualizando o perfil no Firebase Authentication
        updateProfile(user, {
            displayName: nome,
        }).catch((error) => console.error("Erro ao atualizar o perfil:", error));

        // Atualizando o perfil no Realtime Database
        const userRef = ref(database, `Users/${user.uid}`); // Corrigido para salvar em 'Users'
        const updates = { nome, telefone, endereco, dataNascimento, genero, email: user.email };

        // Se o usuário adicionou uma foto de perfil
        if (fotoPerfil) {
            const reader = new FileReader();
            reader.onload = function (event) {
                updates.fotoPerfil = event.target.result; // Salvar a imagem como base64
                update(userRef, updates).then(() => {
                    alert("Perfil atualizado com sucesso!");
                    loadUserData(user); // Atualiza os dados exibidos
                });
            };
            reader.readAsDataURL(fotoPerfil);
        } else {
            update(userRef, updates).then(() => {
                alert("Perfil atualizado com sucesso!");
                loadUserData(user);
            });
        }
    }
}

// Função para alterar a senha
function alterarSenha() {
    const user = auth.currentUser;
    const senhaAntiga = document.getElementById("senhaAntiga").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarNovaSenha = document.getElementById("confirmarNovaSenha").value;

    if (novaSenha !== confirmarNovaSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    if (user && senhaAntiga && novaSenha) {
        const credential = EmailAuthProvider.credential(user.email, senhaAntiga);
        
        reauthenticateWithCredential(user, credential).then(() => {
            updatePassword(user, novaSenha).then(() => {
                alert("Senha alterada com sucesso!");
                document.getElementById("modalAlterarSenha").classList.add("hidden"); // Fecha o modal
            }).catch((error) => {
                console.error("Erro ao alterar a senha:", error);
                alert("Erro ao alterar a senha.");
            });
        }).catch((error) => {
            console.error("Erro na reautenticação:", error);
            alert("Senha antiga incorreta.");
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função de logout
function logout() {
    signOut(auth).then(() => {
        alert("Você foi deslogado com sucesso!");
        window.location.href = "../pages/login.html";
    }).catch((error) => {
        console.error("Erro ao deslogar:", error.message);
    });
}

// Checando se o usuário está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserData(user);
    } else {
        window.location.href = "../pages/login.html"; // Redireciona para a página de login
    }
});

// Associando eventos
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("salvarBtn").addEventListener("click", salvarPerfil);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("alterarSenhaBtn").addEventListener("click", () => {
        document.getElementById("modalAlterarSenha").classList.remove("hidden");
    });
    document.getElementById("cancelarAlteracao").addEventListener("click", () => {
        document.getElementById("modalAlterarSenha").classList.add("hidden");
    });
    document.getElementById("salvarAlteracao").addEventListener("click", alterarSenha);
});
