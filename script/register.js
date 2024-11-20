// Importando as funções necessárias do SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Selecionando o botão de cadastro
const submit = document.getElementById('btnCadastrar');
submit.addEventListener("click", function(event){
  event.preventDefault();
  
  // Obtendo os valores dos inputs
  const nome = document.getElementById("NomeUsuario").value;
  const email = document.getElementById("InputEmail").value;
  const senha = document.getElementById("InputPassword").value;
  const telefone = document.getElementById("InputTelefone").value;

  // Verificando se os campos estão preenchidos
  if (!nome || !email || !senha || !telefone) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Criando o usuário com o Firebase Auth
  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      // Usuário criado com sucesso
      const user = userCredential.user;
      alert(`Usuário ${nome} cadastrado com sucesso!`);
      
      // Aqui você pode adicionar lógica adicional, como salvar o nome e o telefone no Firestore ou Realtime Database, se necessário.
    })
    .catch((error) => {
      // Exibindo o erro caso o cadastro falhe
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Erro ao cadastrar: ${errorMessage}`);
    });
});
