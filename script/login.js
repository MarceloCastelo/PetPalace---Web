// Importando as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Selecionando os inputs e o botão
const emailInput = document.getElementById("InputEmail1");
const passwordInput = document.getElementById("exampleInputPassword1");
const loginButton = document.querySelector("button[type='button']");

// Adicionando evento de clique no botão de login
loginButton.addEventListener("click", (event) => {
  event.preventDefault();  // Previne o envio do formulário

  // Capturando os valores do email e senha
  const email = emailInput.value;
  const password = passwordInput.value;

  // Verificando se os campos estão preenchidos
  if (!email || !password) {
    alert("Por favor, preencha ambos os campos.");
    return;
  }

  // Autenticando o usuário com Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login bem-sucedido
      const user = userCredential.user;
      alert("Login realizado com sucesso!");

      // Redirecionando para a página 'home' específica do usuário
      const userHomePage = `./home.html?uid=${user.uid}`;
      window.location.href = userHomePage; // Redireciona para a página do usuário
    })
    .catch((error) => {
      // Exibindo erro se o login falhar
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Erro ao fazer login: ${errorMessage}`);
    });
});
