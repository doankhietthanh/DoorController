import {
  onValue,
  ref,
  set,
  remove,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";

let LIST_FINGER_ID = [];
let TIME_CLOSE;

onValue(ref(database, "auto/"), (snapshot) => {
  TIME_CLOSE = snapshot.val();
});

const doorControl = document.getElementById("door-button");
const doorImage = document.getElementById("door-image");

let isDoor = false;
if (doorControl) {
  doorControl.addEventListener("click", () => {
    if (isDoor) {
      doorImage.src = "./assets/door/door-close.png";
      doorControl.textContent = "Tap to open";
      doorControl.style.backgroundColor = "#1890ff";
      set(ref(database, "door/"), false);
      set(ref(database, "action/"), "close");
      set(ref(database, "startAction/"), 0);
      ToastifyNotify(false);
      isDoor = false;
    } else {
      doorImage.src = "./assets/door/door-open.png";
      doorControl.textContent = "Tap to close";
      doorControl.style.backgroundColor = "#fa541c";
      set(ref(database, "door/"), true);
      set(ref(database, "action/"), "open");
      set(ref(database, "startAction/"), 1);
      ToastifyNotify(true);
      isDoor = true;
    }
    autoCloseDoor();
  });
}

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);
  LIST_FINGER_ID.push(...listID);

  listID.forEach((id, index) => {
    onValue(ref(database, `finger/${id}`), (snap) => {
      const doc = snap.val();
      document.getElementById("tbody-list-finger").innerHTML += `
          <tr>
            <td class="text-nowrap">
                <div>${index + 1}</div>
            </td>
            <td class="text-nowrap">${doc.name}</td>
            <td class="text-nowrap">${doc.description}</td>
            <td class="text-center"><span class="badge badge-pill bg-success inv-badge">${id}</span></td>
            <td class="text-center">❌</td>
          </tr>
        `;
    });
  });
});

const autoCloseDoor = () => {
  setTimeout(() => {
    isDoor = false;
    set(ref(database, "door/"), false);
    LIST_FINGER_ID.forEach((id) => {
      doorImage.src = "./assets/door/door-close.png";
      doorControl.textContent = "Tap to open";
      doorControl.style.backgroundColor = "#1890ff";
      set(ref(database, `finger/${id}/status`), false);
    });
    ToastifyNotify(false);
  }, TIME_CLOSE);
};

const ToastifyNotify = (status) => {
  Toastify({
    text: status ? "Đã mở cửa" : "Đã đóng cửa",
    close: true,
    duration: 3000,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: status ? "#1890ff" : "#fa541c",
    },
  }).showToast();
};

const setAction = (action, id) => {
  set(ref(database, "action/"), action);
  set(ref(database, "IDtemp/"), id);
  set(ref(database, "startAction/"), 1);
};

const addFinger = (name, description, id) => {
  if (LIST_FINGER_ID.includes(id) || id === "") {
    Toastify({
      text: "ID đã tồn tại",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#fa541c",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
  } else {
    set(ref(database, "finger/" + id), {
      name: name,
      description: description,
      status: false,
    });
    setAction("enroll", Number(id));
    Toastify({
      text: "Thêm vân tay thành công",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#1890ff",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
    // setTimeout(() => {
    //   setAction("", 0);
    //   // console.log(LIST_FINGER_ID);
    // }, 5000);
  }
};

const removeFinger = (id) => {
  if (LIST_FINGER_ID.includes(id)) {
    remove(ref(database, "finger/" + id));
    setAction("delete", Number(id));
    Toastify({
      text: "Xóa vân tay thành công",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#1890ff",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
  } else {
    Toastify({
      text: "Xóa vân tay thất bại",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#fa541c",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
  }
};

const changePasswordDoor = (password) => {
  set(ref(database, "password/"), password);
  set(ref(database, "action/"), "pass");
  set(ref(database, "startAction/"), 1);
  Toastify({
    text: "Đổi mật khẩu thành công",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#1890ff",
    },
    onClick: () => {
      window.location.reload(true);
    },
  }).showToast();
};

const changeTimeAuto = (time) => {
  set(ref(database, "auto/"), time);
  set(ref(database, "startAction/"), 1);
  Toastify({
    text: "Đổi thời gian thành công",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#1890ff",
    },
    onClick: () => {
      window.location.reload(true);
    },
  }).showToast();
};

document.getElementById("form-add-finger").addEventListener("submit", (e) => {
  e.preventDefault();

  get(child(ref(database), "password")).then((snapshot) => {
    const password = snapshot.val();
    if (e.target[3].value === password) {
      addFinger(e.target[0].value, e.target[1].value, e.target[2].value);
    } else {
      Toastify({
        text: "Mật khẩu không đúng",
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
  });
});

document
  .getElementById("form-remove-finger")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    get(child(ref(database), "password")).then((snapshot) => {
      const password = snapshot.val();
      if (e.target[1].value === password) {
        removeFinger(e.target[0].value);
      } else {
        Toastify({
          text: "Mật khẩu không đúng",
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
    });
  });

document
  .getElementById("form-change-password")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    get(child(ref(database), "password")).then((snapshot) => {
      const password = snapshot.val();
      if (e.target[0].value !== password) {
        Toastify({
          text: "Mật khẩu không đúng",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#fa541c",
          },
        }).showToast();
      } else {
        if (e.target[1].value !== e.target[2].value) {
          Toastify({
            text: "Mật khẩu không khớp",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "#fa541c",
            },
          }).showToast();
        } else {
          changePasswordDoor(e.target[1].value);
        }
      }
    });
  });

document
  .getElementById("form-change-time-auto")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    get(child(ref(database), "password")).then((snapshot) => {
      const password = snapshot.val();
      if (e.target[0].value === password) {
        changeTimeAuto(Number(e.target[1].value));
        set(ref(database, "action/"), "timeAuto");
      } else {
        Toastify({
          text: "Mật khẩu không đúng",
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
    });
  });
