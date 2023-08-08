const maxContent = 20;
const maxPhase = 4;
const defaultPhase = ["PLAN", "WORK", "CHECK", "DONE"];
const defaultColor = ["#F4B314", "#F6793A", "#728BF4", "#04D5C5", "#92E230"];
let ref = $("#input_Ref").val();
let phase = [];
const bodyAll = $(`.row-body .col-3`);

const socketio = () => {
  const socket = io.connect(socketHost, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  });

  socket.on("connect", () => {
    console.log("connected");
    socket.emit("joinRoom", `KanBan-Board`);
  });

  socket.on("reconnect", () => {
    console.log(`reconnect`);
    socket.emit("joinRoom", `KanBan-Board`);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("check-connect", (msg) => {
    console.log(msg);
  });

  socket.on("kanban-update", async (msg) => {
    console.log(msg);
    let ref = $("#input_Ref").val();
    start(ref);
    // console.log('reset status')
  });
  socket.on("disconnect", () => {
    console.log("disconnectd");
    window.setTimeout(socket.connect(), 5000);
  });
};

//Head
function genHead(array) {
  for (let i = 0; i < 4; i++) {
    let arrayPhase = [];
    array.length == 0 ? (arrayPhase = defaultPhase) : (arrayPhase = array);
    let head = $(`.row-head .phase-0${i + 1}`);
    head.html("");
    head.html(`<p>${arrayPhase[i]}</p>`);
  }
}

// Body
function genBody(data, sql_phase) {
  // console.log(data);

  for (let i = 0; i < data.length; i++) {
    let show = "";
    let dataPhase = data[i].phase;
    let status = data[i].showStatus;
    status == 0 ? (show = "") : (show = "showing");

    for (let j = 0; j < 4; j++) {
      if (dataPhase == j) {
        let body = $(`.row-body .phase-0${j + 1}`);
        body.append(
          `<div class="cel-card ${show}">
            <div class="cel-card-body"  style="background: ${data[i].color}">
              <span>${data[i].content}</span>
            </div>
          </div>`
        );
      }
    }
  }
}

// Get Data
async function start(ref) {
  try {
    let res = await AjaxJasonData(`/kanban_master/data/${ref}`, "get");
    // console.log("get data", res.length);
    if (res.length != 0) {
      let sql_data = res;
      let sql_phase = JSON.parse(sql_data[0].phaseArray);

      bodyAll.html("");
      genHead(sql_phase);
      genBody(sql_data, sql_phase);
      let reset = await AjaxJasonData(`/kanban_master/reset/status`, "put");
      // console.log(reset);
    } else {
      genHead(defaultPhase);
      bodyAll.html("");
    }
  } catch (error) {
    console.log(error);
    genHead(defaultPhase);
    bodyAll.html("");

  }
}

start(ref);
socketio();

$("#btn_search").unbind();
$("#btn_search").click((e) => {
  let ref = $("#input_Ref").val();
  // console.log(ref);
  if (ref) {
    start(ref);
  } else {
    genHead(defaultPhase);
    bodyAll.html("");
  }
});
