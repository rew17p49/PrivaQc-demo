// let min = 20;
// let max = 30;
// let k = 5; // ความกว้างของชุดข้อมูล
// let N = 20; // จำนวนชุดข้อมูล
// let data = [];
// let Def = Math.abs(max - min + 1);

// for (var i = 0; i < N; i++) {
//   let dataGroup = [];
//   for (let j = 0; j < k; j++) {
//     var randomNumber = Math.floor(Math.random() * Def) + parseInt(min); // สุ่มตัวเลขระหว่าง 20 - 40
//     dataGroup.push(randomNumber);
//   }
//   data.push(dataGroup);
// }

function fill_table_Xbar(data) {
  let col = data[0].length + 1;
  let row = data.length;
  // console.log("row j: ", row);
  // console.log("col i: ", col);
  let html = "";
  $("#tbXBar").html(html);
  for (let i = 0; i < col; i++) {
    if (i == 0)
      $("#tbXBar").append(
        `<tr id = "col_${i}" ><th class="fixed-column"> Group </th></tr>`
      );
    else
      $("#tbXBar").append(
        `<tr id = "col_${i}" ><th class="fixed-column"> n${i} </th></tr>`
      );

    for (let j = 0; j < row; j++) {
      if (i == 0) $(`#col_${i}`).append(`<td>${j + 1}</td>`);
      else $(`#col_${i}`).append(`<td>${data[j][i - 1]}</td>`);
    }
  }
}

function no_table() {
  let html = "";
  html += `<tr id = "col_0" >
            <th class="fixed-column"> Group </th>
          </tr>`;
  html += `<tr id = "col_1" >
            <td> No data available in table </td>
          </tr>`;
  $("#tbXBar").html(html);
}

async function getDataXbar(ref) {
  // console.log(ref);
  let arrayData = [];
  try {
    let res = await AjaxJasonData(`/xbardata/${ref}`, "get");
    // console.log(res)
    res.forEach((element) => {
      let jsonString = element.valueArray;
      let jsonArray = JSON.parse(jsonString);
      arrayData.push(jsonArray);
    });
    return arrayData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function start(ref) {
  getDataXbar(ref)
    .then((res) => {
      if (!res.length == 0) {
        fill_table_Xbar(res);
        $(".show_chart").removeClass("d-none");
        runChart(res);
      } else {
        no_table();
        $(".show_chart").addClass("d-none");
        // No data available in table
      }
    })
    .catch((err) => {
      console.error("เกิดข้อผิดพลาด:", err);
    });
}

const socketio = () => {
  const socket = io.connect(socketHost, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  });

  socket.on("connect", () => {
    console.log("connected");
    socket.emit("joinRoom", `XBarOrder`);
  });

  socket.on("reconnect", () => {
    console.log(`reconnect`);
    socket.emit("joinRoom", `XBarOrder`);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("check-connect", (msg) => {
    console.log(msg);
  });

  socket.on("x-bar-update", (msg) => {
    console.log(msg);
    let ref = $("#input_ref_xbar").val();
    // console.log(ref)
    start(ref);
  });
  socket.on("disconnect", () => {
    console.log("disconnectd");
    window.setTimeout(socket.connect(), 5000);
  });
};

start("demo");
socketio();

$("#ref_xbar_search").unbind();
$("#ref_xbar_search").click((e) => {
  let ref = $("#input_ref_xbar").val();
  start(ref);
  
});
