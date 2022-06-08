import {
  onValue,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";

let listFingerID = [];

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);

  listFingerID.push(...listID);

  listID.forEach((id, index) => {
    onValue(ref(database, `finger/${id}`), (snap) => {
      const doc = snap.val();
      const timestamp = getTime(12412515);
      document.getElementById("tbody-history").innerHTML += `
          <tr>
            <td class="text-nowrap">
                <div>${index + 1}</div>
            </td>
            <td class="text-nowrap">${doc.name}</td>
            <td class="text-center">${id}</td>
            <td class="text-center">${doc.description}</td>
            <td class="text-center">
              <span class="badge badge-pill bg-success inv-badge">${timestamp}</span>
            </td>
  
          </tr>
        `;
    });
  });

  const totalUser = document.getElementById("total-user");
  if (totalUser) totalUser.textContent = listID.length;
  const remainFinger = document.getElementById("remain-finger");
  if (remainFinger) remainFinger.textContent = 128 - listID.length;
});

const getTime = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${hour}:${minute}:${second}`;
};
