import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
  child,
  get,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { auth, database } from "./firebase.js";
import { init } from "./init.js";
import { Validator } from "../lib/validator.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Validator({
  form: "#form-forgot-password",
  rules: [
    Validator.isRequired("#email", "Vui lòng đúng Email"),
    Validator.isEmail("#email"),
  ],
  onSubmit: function (data) {
    // console.log(data.email);
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        console.log("Send email successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  },
});
