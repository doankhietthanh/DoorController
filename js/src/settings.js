import {
  onValue,
  ref,
  set,
  remove,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { auth, database } from "./firebase.js";
import { init, logOut } from "./init.js";

init();
logOut();

let LIST_FINGER_ID = [];
let TIME_CLOSE;

const loading = document.querySelector(".loading");
loading.style.display = "none";

onValue(ref(database, "auto/"), (snapshot) => {
  TIME_CLOSE = snapshot.val();
});

const doorControl = document.getElementById("door-button");
const doorImage = document.getElementById("door-image");

let isDoor = false;

onValue(ref(database, "door/"), (snapshot) => {
  const status = snapshot.val();
  if (status) {
    doorImage.src = "./assets/door/door-open.png";
    doorControl.textContent = "Tap to close";
    doorControl.style.backgroundColor = "#1890ff";
    isDoor = true;
  } else {
    doorImage.src = "./assets/door/door-close.png";
    doorControl.textContent = "Tap to open";
    doorControl.style.backgroundColor = "#1890ff";
    isDoor = false;
  }
});

doorControl.addEventListener("click", () => {
  if (isDoor) {
    doorImage.src = "./assets/door/door-close.png";
    doorControl.textContent = "Tap to open";
    doorControl.style.backgroundColor = "#1890ff";
    set(ref(database, "door/"), false);
    set(ref(database, "action/"), "close");
    set(ref(database, "startAction/"), 1);
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
  if (TIME_CLOSE !== 0) {
    autoCloseDoor();
  }
});

onValue(ref(database, "finger/"), (snapshot) => {
  const data = snapshot.val();
  const listID = Object.keys(data);
  LIST_FINGER_ID.push(...listID);

  document.getElementById("tbody-list-finger").innerHTML = "";

  listID.forEach((id, index) => {
    onValue(ref(database, `finger/${id}`), (snap) => {
      const doc = snap.val();

      const trElement = document.createElement("tr");
      const tdIndexElement = document.createElement("td");
      const tdNameElement = document.createElement("td");
      const tdDescriptionElement = document.createElement("td");
      const tdIDElement = document.createElement("td");
      const tdDeleteElement = document.createElement("td");
      const spanDeleteElement = document.createElement("span");

      document.getElementById("tbody-list-finger").appendChild(trElement);
      trElement.appendChild(tdIndexElement);
      trElement.appendChild(tdNameElement);
      trElement.appendChild(tdDescriptionElement);
      trElement.appendChild(tdIDElement);
      trElement.appendChild(tdDeleteElement);
      tdDeleteElement.appendChild(spanDeleteElement);

      tdIndexElement.className = "text-nowrap";
      tdNameElement.className = "text-nowrap";
      tdDescriptionElement.className = "text-nowrap";
      tdIDElement.className = "text-center";
      tdDeleteElement.className = "text-center";
      tdDeleteElement.style = "cursor: pointer";

      tdIndexElement.textContent = index + 1;
      tdNameElement.textContent = doc.name;
      tdDescriptionElement.textContent = doc.description;
      tdIDElement.textContent = id;
      spanDeleteElement.textContent = "❌";

      tdDeleteElement.addEventListener("click", () => {
        removeFinger(id);
        successAction("delete");
        trElement.remove();
      });
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
      id: id,
      name: name,
      description: description,
      status: false,
    });
    setAction("enroll", Number(id));
    Toastify({
      text: "Đang thêm vân tay",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#f07700",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
  }
};

const removeFinger = (id) => {
  if (LIST_FINGER_ID.includes(id)) {
    remove(ref(database, "finger/" + id));
    setAction("delete", Number(id));
    Toastify({
      text: "Đang xóa vân tay",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#f07700",
      },
      onClick: () => {
        window.location.reload(true);
      },
    }).showToast();
  } else {
    Toastify({
      text: "Không tìm thấy vân tay",
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
    text: "Đang đổi mật khẩu",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#f07700",
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
    text: "Đang đổi thời gian",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#f07700",
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
      successAction("enroll");
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
        successAction("delete");
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
          successAction("pass");
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
        set(ref(database, "action/"), "time");
        successAction("timeAuto");
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

let isActionSuccess;
const successAction = (action) => {
  onValue(ref(database, "successAction"), (snapshot) => {
    const message = snapshot.val();
    if (message === 1) {
      document.getElementById("modal_" + action).classList.remove("show");
      document.getElementById("modal_" + action).removeAttribute("style");
      document.body.classList.remove("modal-open");
      if (document.querySelector(".modal-backdrop.fade.show")) {
        document.querySelector(".modal-backdrop.fade.show").remove();
      }
      document.body.style = "";

      loading.style.display = "flex";
      isActionSuccess = true;
    } else {
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
    }
  });
};
