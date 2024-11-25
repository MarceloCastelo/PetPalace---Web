// Importando as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Selecionando os elementos
const resetEmailInput = document.getElementById("resetEmail");
const resetPasswordButton = document.getElementById("resetPasswordButton");

// Evento para enviar o link de redefinição de senha
resetPasswordButton.addEventListener("click", (event) => {
  event.preventDefault();

  const email = resetEmailInput.value;

  if (!email) {
    alert("Por favor, insira seu e-mail.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("E-mail de redefinição enviado com sucesso. Verifique sua caixa de entrada.");
    })
    .catch((error) => {
      alert(`Erro ao enviar o e-mail de redefinição: ${error.message}`);
    });
});
