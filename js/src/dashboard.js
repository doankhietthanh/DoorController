import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
  child,
  get,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { auth, database } from "./firebase.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { init, logOut, statusHardware, lockSystem } from "./init.js";

init();
logOut();
statusHardware();
lockSystem();

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);

  const totalUser = document.getElementById("total-user");
  if (totalUser) totalUser.textContent = listID.length;
  const remainFinger = document.getElementById("remain-finger");
  if (remainFinger) remainFinger.textContent = 128 - listID.length;
});
