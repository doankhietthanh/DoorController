import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { Validator } from "../lib/validator.js";
import { nextPageError, nextPageSuccess } from "./login.js";
import { auth, database } from "./firebase.js";

Validator({
  form: "#form-register",
  rules: [
    Validator.isRequired("#username"),
    Validator.isName("#username"),
    Validator.isRequired("#email", "Vui lòng nhập Email"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password", "Vui lòng nhập Mật khẩu"),
    Validator.isPassword("#password"),
    Validator.isRequired("#confirmpassword", "Vui lòng xác nhận lại Mật khẩu"),
    Validator.confirmed(
      "#confirmpassword",
      function () {
        return document.querySelector("#form-register #password").value;
      },
      "Mật khẩu bạn nhập không khớp"
    ),
  ],
  onSubmit: function (data) {
    console.log(data);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        set(ref(database, "users/" + user.uid), {
          username: data.name,
          avatarURL: `https://joeschmoe.io/api/v1/${Math.floor(
            Math.random() * 28
          )}`,
          email: data.email,
          password: data.password,
          phone: "none",
          address: "none",
          birthday: "none",
        });
        nextPageSuccess("Đăng kí thành công");
      })
      .catch((error) => {
        nextPageError("Đăng kí thất bại");
      });
  },
});
