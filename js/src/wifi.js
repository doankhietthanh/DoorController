import {
  onValue,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";
import { init, logOut, statusHardware, lockSystem } from "./init.js";

init();
logOut();
statusHardware();
lockSystem();

const loading = document.querySelector(".loading");
loading.style.display = "none";

const WIFI1el = document.querySelector("#WIFI1");
const WIFI2el = document.querySelector("#WIFI2");
const SSID1el = document.querySelector("#SSID1");
const SSID2el = document.querySelector("#SSID2");
const PASS1el = document.querySelector("#PASS1");
const PASS2el = document.querySelector("#PASS2");

const showPASSel = document.querySelectorAll(".show-password i");

let WIFI = [[], []];

onValue(ref(database, "WIFI"), (snapshot) => {
  const data = snapshot.val();

  const WIFIusing = data.using;
  console.log(WIFIusing);
  if (WIFIusing === 1) {
    WIFI2el.querySelector(".wifi-status").classList.remove("active");
    WIFI1el.querySelector(".wifi-status").classList.add("active");
  } else if (WIFIusing === 2) {
    WIFI1el.querySelector(".wifi-status").classList.remove("active");
    WIFI2el.querySelector(".wifi-status").classList.add("active");
  }

  const WIFI1data = data.WIFI1;
  const WIFI2data = data.WIFI2;

  WIFI[0][0] = WIFI1data.SSID;
  WIFI[0][1] = WIFI1data.PASS;

  WIFI[1][0] = WIFI2data.SSID;
  WIFI[1][1] = WIFI2data.PASS;

  SSID1el.textContent = WIFI[0][0];
  SSID2el.textContent = WIFI[1][0];

  PASS1el.textContent = "••••••••";
  PASS2el.textContent = "••••••••";

  console.log(WIFI);
});

showPASSel.forEach((el, index) => {
  let isShowing = true;

  el.addEventListener("click", () => {
    if (isShowing) {
      el.classList.remove("fa-eye-slash");
      el.classList.add("fa-eye");

      el.parentElement.parentElement.querySelector(
        ".password-value"
      ).textContent = WIFI[index][1];
      isShowing = false;
    } else {
      el.classList.remove("fa-eye");
      el.classList.add("fa-eye-slash");

      el.parentElement.parentElement.querySelector(
        ".password-value"
      ).textContent = "••••••••";
      isShowing = true;
    }
  });
});

document.getElementById("form-add-wifi").addEventListener("submit", (e) => {
  e.preventDefault();

  const WIFIref = e.target[0].value;

  set(ref(database, "WIFI/" + WIFIref), {
    SSID: e.target[1].value,
    PASS: e.target[2].value,
  });

  set(ref(database, "action/"), WIFIref);
  set(ref(database, "startAction/"), 1);
  set(ref(database, "successAction/"), -1);

  Toastify({
    text: "Đang thêm WIFI",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#00c853",
    stopOnFocus: true,
  }).showToast();

  successAction(WIFIref);
});

document.getElementById("btn-change-wifi").addEventListener("click", (e) => {
  e.preventDefault();
  Toastify({
    text: "Đang chuyển đổi WIFI",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#00c853",
    stopOnFocus: true,
  }).showToast();

  set(ref(database, "action/"), "changeWIFI");
  set(ref(database, "startAction/"), 1);
  set(ref(database, "successAction/"), -1);

  successAction("changeWIFI");
});

let isActionSuccess;
const successAction = (action) => {
  onValue(ref(database, "successAction"), (snapshot) => {
    const message = snapshot.val();
    if (message === 1) {
      if (document.getElementById("modal_" + action)) {
        document.getElementById("modal_" + action).classList.remove("show");
        document.getElementById("modal_" + action).removeAttribute("style");
        document.body.classList.remove("modal-open");
        if (document.querySelector(".modal-backdrop.fade.show")) {
          document.querySelector(".modal-backdrop.fade.show").remove();
        }
        document.body.style = "";
      }

      loading.style.display = "flex";
      isActionSuccess = true;
    } else if (message === 0) {
      loading.style.display = "none";
      if (isActionSuccess) {
        Toastify({
          text: "Thành công",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#00c853",
          },
        }).showToast();
      }
      isActionSuccess = false;
    } else {
      loading.style.display = "none";
      if (isActionSuccess) {
        Toastify({
          text: "Thất bại",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#fa541c",
          },
        }).showToast();
      }
    }
  });
};
