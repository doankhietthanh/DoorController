import { auth } from "./firebase.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Login with email password
$("#submit-login").addEventListener("click", (e) => {
  e.preventDefault();

  const email = $("#email-login").value;
  const password = $("#password-login").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("user-token", JSON.stringify(user.accessToken));
      nextPageSuccess();
    })
    .catch((error) => {
      nextPageError();

      $("#email-login").value = "";
      $("#password-login").value = "";
    });
});

// Login with Google account
const provider = new GoogleAuthProvider();
$(".google").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      nextPageSuccess();
    })
    .catch((error) => {
      nextPageError();
    });
});

document.querySelector(".lds-ring").style.display = "none";

const nextPageSuccess = () => {
  document.querySelector(".lds-ring").style.display = "block";
  Toastify({
    text: "Đăng nhập thành công",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  setTimeout(() => {
    window.location.href = "/index.html";
  }, 3000);
};

const nextPageError = () => {
  Toastify({
    text: "Đăng nhập thất bại",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #cf1322, #820014)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};
