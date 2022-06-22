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

import { init, logOut } from "./init.js";
init();
logOut();

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;

//     get(child(ref(database), `users/${uid}`)).then((snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setUserDetail(data.address, data.phone, data.birthday);
//       }
//     });
//     // .catch((error) => {
//     //   console.error(error);
//     // });
//   }
// });

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);

  const totalUser = document.getElementById("total-user");
  if (totalUser) totalUser.textContent = listID.length;
  const remainFinger = document.getElementById("remain-finger");
  if (remainFinger) remainFinger.textContent = 128 - listID.length;
});
