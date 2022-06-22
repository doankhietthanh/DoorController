// Import the functions you need from the SDKs you need
import { auth, database } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import {
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { Validator } from "../lib/validator.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Login with email password
Validator({
  form: "#form-login",
  rules: [
    Validator.isRequired("#email-login", "Vui lòng nhập Email"),
    Validator.isEmail("#email-login"),
    Validator.isRequired("#password-login", "Vui lòng nhập Mật khẩu"),
    Validator.isPassword("#password-login"),
  ],
  onSubmit: function (data) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("user-token", JSON.stringify(user.accessToken));
        const dt = new Date();
        update(ref(database, "users/" + user.uid), {
          last_login: dt,
        });
        nextPageSuccess("Đăng nhập thành công");
      })
      .catch((error) => {
        nextPageError("Đăng nhập thất bại");
      });
  },
});

export const nextPageSuccess = (text) => {
  document.querySelector(".loading").style.display = "flex";
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#1890ff",
    },
  }).showToast();
  setTimeout(() => {
    document.querySelector(".loading").style.display = "none";
    window.location.href = "/index.html";
  }, 3000);
};

export const nextPageError = (text) => {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#fa541c",
    },
  }).showToast();
};
