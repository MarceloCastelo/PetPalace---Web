// Importando as funções necessárias do Firebase
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const googleButton = document.getElementById("google-login"); // Adicione o botão de login com Google

// Evento de login com email e senha
loginButton.addEventListener("click", (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Por favor, preencha ambos os campos.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login realizado com sucesso!");
      const user = userCredential.user;
      const userHomePage = `./home.html?uid=${user.uid}`;
      window.location.href = userHomePage;
    })
    .catch((error) => {
      alert(`Erro ao fazer login: ${error.message}`);
    });
});

// Login com Google
googleButton.addEventListener("click", (event) => {
  event.preventDefault();

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Bem-vindo(a), ${user.displayName}!`);
      const userHomePage = `./home.html?uid=${user.uid}`;
      window.location.href = userHomePage;
    })
    .catch((error) => {
      alert(`Erro ao fazer login com o Google: ${error.message}`);
    });
});
