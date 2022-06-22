import {
  onValue,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";
import { init, logOut, lockSystem } from "./init.js";

init();
logOut();
lockSystem();

let listFingerID = [];

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);

  listFingerID.push(...listID);

  let docs = [];
  listID.forEach((id) => {
    onValue(ref(database, `finger/${id}`), (snap) => {
      const doc = snap.val();
      docs.push(doc);
    });
  });

  docs.sort((a, b) => b.timestamp - a.timestamp);
  document.getElementById("tbody-history").innerHTML = "";
  docs.forEach((doc, index) => {
    document.getElementById("tbody-history").innerHTML += `
      <tr>
        <td class="text-nowrap">
            <div>${index + 1}</div>
        </td>
        <td class="text-nowrap">${
          doc.name === undefined ? "anonymous" : doc.name
        }</td>
        <td class="text-center">${doc.id}</td>
        <td class="text-center">${
          doc.description === undefined ? "door" : doc.description
        }</td>
        <td class="text-center">${getDate(doc.timestamp)}</td>
        <td class="text-center">
          <span class="badge badge-pill bg-success inv-badge">${getTime(
            doc.timestamp
          )}</span>
        </td>
      </tr>
    `;
  });
});

const getDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${year}/${month}/${day}`;
};

const getTime = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${hour}:${minute}:${second}`;
};
