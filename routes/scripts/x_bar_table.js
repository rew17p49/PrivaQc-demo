function fill_table_Xbar(data, id) {
  let col = data[0].length + 1;
  let row = data.length;
  // console.log("row j: ", row);
  let html = "";
  $("#tbXBar").html(html);
  for (let i = 0; i <= col; i++) {
    if (i == 0)
      $("#tbXBar").append(
        `<tr id = "col_${i}" ><th class="fixed-column"> Group </th></tr>`
      );
    else if (i == col) {
      $("#tbXBar").append(
        `<tr id = "col_${i}" ><th class="fixed-column"> Edit </th></tr>`
      );
    } else
      $("#tbXBar").append(
        `<tr id = "col_${i}" ><th class="fixed-column"> n${i} </th></tr>`
      );

    for (let j = 0; j < row; j++) {
      if (i == 0) $(`#col_${i}`).append(`<td>${j + 1}</td>`);
      else if (i == col) {
        $(`#col_${i}`).append(
          `<td ><button class="btn btn-sm btn-primary edit_xbar" sql ="${id[j]}"><i class="fa-solid fa-pen-to-square"></i></button></td>`
        );
      } else
        $(`#col_${i}`).append(
          `<td class ="sql_${id[j]}">${data[j][i - 1] || 0}</td>`
        );
    }
  }

  $("#tbXBar").on("click", ".edit_xbar", (e) => {
    // console.log("target: ", $(e.target).hasClass("fa-solid"));

    if ($(e.target).hasClass("fa-solid")) {
      $(e.target).closest("button").click();
    } else {
      let sqlId = $(e.target)[0].attributes.sql.value;
      let data = $(`.sql_${sqlId}`);

      let length = data.length;
      let html = `
        <div class="input-group input-group-sm mb-3 d-none">
          <input type="text" class="form-control" name="id" value="${sqlId}">
        </div>
      `;
      for (let i = 0; i < length; i++) {
        html += `
        <div class="input-group input-group-sm mb-3">
          <span class="input-group-text">n${i + 1}</span>
          <input type="text" class="form-control" name="n${i + 1}" value="${
          data[i].innerText
        }">
        </div>
      `;
      }
      $("#edit_xbar_form .modal-body").html(html);
      $("#modal_edit_xbar").modal("show");
    }
  });

  $("#edit_xbar_form").submit(async function (e) {
    e.preventDefault(); // ป้องกันการโหลดหน้าเว็บใหม่หลังจากการส่งฟอร์ม

    let formData = $(this).serializeArray(); // ดึงข้อมูลฟอร์มเป็นอาร์เรย์

    let jsonData = {};
    let array = [];
    let time = dataTimeNow();
    let id;
    $.each(formData, function (index, field) {
      if (field.name == "id") {
        id = field.value;
      } else {
        array.push(parseFloat(field.value));
      }

      // jsonData['Reference'] = $("#input_ref_xbar").val()
      jsonData["valueArray"] = JSON.stringify(array);
      // jsonData['valueDatetime'] = time
    });
    // console.log(jsonData);

    try {
      let res = await AjaxJasonData(`/xbardata/edit/${id}`, "put", jsonData);
      SwalAlert(res, "update");
      $("#modal_edit_xbar").modal("hide");
    } catch (error) {
      SwalAlert(error, "error");
    }
  });
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
  try {
    let res = await AjaxJasonData(`/xbardata/${ref}`, "get");
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function start(ref) {
  getDataXbar(ref)
    .then((res) => {
      if (!res.length == 0) {
        let arrayData = [];
        let idData = [];
        res.forEach((element) => {
          let valueArray_Str = element.valueArray;
          let valueArray_json = JSON.parse(valueArray_Str);
          arrayData.push(valueArray_json);

          let id_Str = element.id;
          let id_json = JSON.parse(id_Str);
          idData.push(id_json);
        });

        fill_table_Xbar(arrayData, idData);
        $(".show_chart").removeClass("d-none");
        runChart(arrayData);
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
