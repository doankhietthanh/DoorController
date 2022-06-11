import {
  onValue,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";

let listFingerID = [];
let docs = [];

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);

  const totalUser = document.getElementById("total-user");
  if (totalUser) totalUser.textContent = listID.length;
  const remainFinger = document.getElementById("remain-finger");
  if (remainFinger) remainFinger.textContent = 128 - listID.length;
});
