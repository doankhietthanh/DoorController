import {
  get,
  child,
  ref,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

import { auth, database } from "./firebase.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export const init = () => {
  const USER_TOKEN = JSON.parse(localStorage.getItem("user-token"));
  if (!USER_TOKEN) {
    window.location.href = "./login.html";
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      onValue(ref(database, `users/${uid}`), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserProfile(
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
};

export const logOut = () => {
  $("#logout").addEventListener("click", (e) => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user-token");
        if (document.querySelector(".loading"))
          document.querySelector(".loading").style.display = "flex";
        setTimeout(() => {
          if (document.querySelector(".loading"))
            document.querySelector(".loading").style.display = "none";
          window.location.href = "/login.html";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
};

const setUserProfile = (
  username,
  avatarURL,
  birthday,
  email,
  phone,
  address
) => {
  if ($$(".pfname"))
    $$(".pfname").forEach((name) => {
      name.textContent = username;
    });

  if ($$(".avatarURL"))
    $$(".avatarURL").forEach((avatar) => {
      avatar.src = avatarURL;
    });

  if ($$(".pfbirthday"))
    $$(".pfbirthday").forEach((birth) => {
      birth.textContent = birthday;
    });

  if ($$(".pfemail"))
    $$(".pfemail").forEach((e) => {
      e.textContent = email;
    });

  if ($$(".pfphone"))
    $$(".pfphone").forEach((p) => {
      p.textContent = phone;
    });

  if ($$(".pfaddress"))
    $$(".pfaddress").forEach((add) => {
      add.textContent = address;
    });
};
