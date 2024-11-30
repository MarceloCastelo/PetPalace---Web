import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    updateProfile, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { 
    getDatabase, 
    ref, 
    update, 
    get 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Função para carregar dados do usuário
function loadUserData(user) {
    if (!user) {
        alert("Por favor, faça login.");
        window.location.href = "/login";
        return;
    }

    const userRef = ref(database, `Users/${user.uid}`);
    get(userRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById("nome").value = data.nome || user.displayName || "Nome não disponível";
                document.getElementById("email").value = data.email || user.email || "Email não disponível";
                document.getElementById("telefone").value = data.telefone || "";
                document.getElementById("endereco").value = data.endereco || "";
                document.getElementById("dataNascimento").value = data.dataNascimento || "";
                document.getElementById("genero").value = data.genero || "nao_informar";
                document.getElementById("fotoPreview").src = data.fotoPerfil || "default-avatar.png";
            } else {
                console.warn("Nenhum dado encontrado para o usuário.");
            }
        })
        .catch(error => {
            console.error("Erro ao carregar dados do usuário:", error);
        });

    document.getElementById("logoutBtn").classList.remove("hidden");
}

// Função para salvar o perfil
function salvarPerfil() {
    const user = auth.currentUser;
    if (!user) {
        alert("Usuário não autenticado.");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value.trim();
    const genero = document.getElementById("genero").value;
    const fotoPerfil = document.getElementById("foto").files[0];

    if (!nome || !telefone || !endereco) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const userRef = ref(database, `Users/${user.uid}`);
    const updates = {
        nome, 
        telefone, 
        endereco, 
        dataNascimento, 
        genero, 
        email: user.email
    };

    // Atualizar a foto do perfil se uma nova for selecionada
    if (fotoPerfil) {
        const reader = new FileReader();
        reader.onload = (event) => {
            updates.fotoPerfil = event.target.result;
            salvarDadosNoBanco(userRef, updates, user, nome);
        };
        reader.readAsDataURL(fotoPerfil);
    } else {
        salvarDadosNoBanco(userRef, updates, user, nome);
    }
}

// Função para salvar dados no Realtime Database
function salvarDadosNoBanco(userRef, updates, user, nome) {
    update(userRef, updates)
        .then(() => {
            alert("Perfil atualizado com sucesso!");
            // Atualizar o perfil no Firebase Authentication
            return updateProfile(user, { displayName: nome });
        })
        .then(() => {
            console.log("Perfil no Auth atualizado.");
            loadUserData(user);
        })
        .catch(error => {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados. Tente novamente.");
        });
}

// Função para alterar senha
function alterarSenha() {
    const user = auth.currentUser;
    const senhaAntiga = document.getElementById("senhaAntiga").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarNovaSenha = document.getElementById("confirmarNovaSenha").value;

    if (novaSenha !== confirmarNovaSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    if (user) {
        const credential = EmailAuthProvider.credential(user.email, senhaAntiga);
        reauthenticateWithCredential(user, credential)
            .then(() => updatePassword(user, novaSenha))
            .then(() => {
                alert("Senha alterada com sucesso!");
                document.getElementById("modalAlterarSenha").classList.add("hidden");
            })
            .catch(error => {
                console.error("Erro ao alterar senha:", error);
                alert("Erro ao alterar a senha. Verifique a senha antiga.");
            });
    } else {
        alert("Usuário não autenticado.");
    }
}

// Função de logout
function logout() {
    signOut(auth)
        .then(() => {
            alert("Você foi deslogado com sucesso!");
            window.location.href = "../pages/login.html";
        })
        .catch(error => console.error("Erro ao deslogar:", error));
}

// Checar se o usuário está autenticado
onAuthStateChanged(auth, user => {
    if (user) {
        loadUserData(user);
    } else {
        window.location.href = "../pages/login.html";
    }
});

// Associar eventos
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
