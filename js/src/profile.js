import {
  get,
  child,
  ref,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  onAuthStateChanged,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { Validator } from "../lib/validator.js";
import { init, logOut } from "./init.js";
import { auth, database } from "./firebase.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let uid;
let password;

init();
logOut();

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    onValue(ref(database, `users/${uid}`), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        password = data.password;
        $("#user-address").textContent = data.address;
        setEditUserDetail(
          data.username,
          data.avatarURL,
          data.birthday,
          data.email,
          data.phone,
          data.address
        );
      }
    });
  }
});

const setEditUserDetail = (
  username,
  avatarURL,
  birthday,
  email,
  phone,
  address
) => {
  $("#change-username").value = username;
  $("#change-avatar").value = avatarURL;
  $("#change-birthday").value = birthday;
  $("#change-email").value = email;
  $("#change-phone").value = phone;
  $("#change-address").value = address;
};

Validator({
  form: "#form-change-details",
  rules: [
    Validator.isRequired("#change-username"),
    Validator.isName("#change-username"),
    Validator.isRequired("#change-birthday", "Vui lòng nhập Ngày sinh"),
    Validator.isDate("#change-birthday"),
    Validator.isRequired("#change-phone", "Vui lòng nhập Số điện thoại"),
    Validator.isPhoneNumber("#change-phone"),
    Validator.isRequired("#change-address", "Vui lòng nhập Địa chỉ"),
  ],
  onSubmit: function (data) {
    console.log(data);
    update(ref(database, "users/" + uid), {
      username: data.name,
      avatarURL: data.avatar,
      birthday: data.birthday,
      phone: data.phone,
      address: data.address,
    });
  },
});

Validator({
  form: "#form-change-password",
  rules: [
    Validator.isRequired("#old_password", "Vui lòng nhập Mật khẩu"),
    Validator.confirmed(
      "#old_password",
      function () {
        return password;
      },
      "Mật khẩu bạn nhập không khớp"
    ),
    Validator.isRequired("#new_password", "Vui lòng nhập Mật khẩu"),
    Validator.isPassword("#new_password"),
    Validator.isRequired(
      "#new_password_confirmed",
      "Vui lòng xác nhận lại Mật khẩu"
    ),
    Validator.confirmed(
      "#new_password_confirmed",
      function () {
        return document.querySelector("#form-change-password #new_password")
          .value;
      },
      "Mật khẩu bạn nhập không khớp"
    ),
  ],
  onSubmit: function (data) {
    console.log(data);
    update(ref(database, "users/" + uid), {
      password: data.new_password,
    });
    updatePassword(auth.currentUser, data.new_password)
      .then(() => {
        alert("Update success");
      })
      .catch((error) => {
        alert(error.message);
      });
  },
});
