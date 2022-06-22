import {
  get,
  child,
  ref,
  update,
  onValue,
  set,
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

export const lockSystem = () => {
  onValue(ref(database, "lock"), (snapshot) => {
    const lock = snapshot.val();
    let OTP;
    if (lock === 1) {
      if ($(".locking")) $(".locking").style.display = "flex";

      onValue(ref(database, "OTP"), (snapshot) => {
        OTP = snapshot.val();
      });

      if ($("#form-unlock"))
        $("#form-unlock").addEventListener("submit", (e) => {
          e.preventDefault();
          const data = e.target[0].value;

          if (parseInt(data) === OTP) {
            $(".loading").style.display = "flex";

            set(ref(database, "lock"), 0);
            setTimeout(() => {
              $(".loading").style.display = "none";
              $(".locking").style.display = "none";
              window.location.reload();
            }, 3000);
          } else if (OTP === -1) {
            alert("OTP đã hết hạn");
          }
        });
    }
  });

  if ($("#send-again-otp"))
    $("#send-again-otp").addEventListener("click", (e) => {
      set(ref(database, "lock"), 2);
      $(".loading").style.display = "flex";
      setTimeout(() => {
        $(".loading").style.display = "none";
      }, 1500);
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

export const statusHardware = () => {
  let lockTemp;
  setInterval(() => {
    get(child(ref(database), "internet")).then((snapshot) => {
      const lock = snapshot.val();
      // console.log(lock);
      lockTemp = lock;

      setTimeout(() => {
        if (lockTemp === lock) {
          // console.log("HW disconnect");
          if ($("#status-connect-hw")) {
            $("#status-connect-hw").textContent = "Disconnected";
            $("#status-connect-hw").style.color = "red";
          }
        } else {
          if ($("#status-connect-hw")) {
            $("#status-connect-hw").textContent = "Connecting";
            $("#status-connect-hw").style.color = "green";
          }
        }
      }, 5000);
    });
  }, 5000);
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
