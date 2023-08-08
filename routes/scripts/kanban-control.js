let ref = $("#input_Ref").val();
const $all = $(
  ".column-no,.column-content,.column-color,.column-phase,.column-action"
);
const $no = $(".column-no");
const $content = $(".column-content");
const $color = $(".column-color");
const $phase = $(".column-phase");
const $action = $(".column-action");


const socketio = () => {
  const socket = io.connect(socketHost, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  });

  socket.on("connect", () => {
    console.log("connected");
    socket.emit("joinRoom", `KanBanOrder`);
  });

  socket.on("reconnect", () => {
    console.log(`reconnect`);
    socket.emit("joinRoom", `KanBanOrder`);
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
  });
  socket.on("disconnect", () => {
    console.log("disconnectd");
    window.setTimeout(socket.connect(), 5000);
  });
};

function gendata(data) {
  // console.log(data);
  let sql_phase = JSON.parse(data[0].phaseArray);
  // console.log("sql_phase: ", `[${sql_phase}]`);
  $all.html("");

  for (let i = 0; i < data.length; i++) {
    let No_ = i + 1;
    $no.append(`<div class="items item-1"><p>${No_}</p></div>`);

    $content.append(`
      <div class="items item-${data[i].id}">
        <input type="text" class="form-control ip-content" value="${data[i].content}">
      </div>
    `);

    let disabled_color = "disabled";
    if (data[i].color == "custom") {
      disabled_color = "";
    }

    $color.append(`
      <div class="items item-${data[i].id}">
        <div class="d-flex justify-content-center align-items-center">
          <input type="color" class="me-2 ip-color" id="show_color_${data[i].id}" value="${data[i].color}" ${disabled_color}>
          <select class="form-select select-color" id="select_color_${data[i].id}" >
            <option value="#F4B314">#F4B314</option>
            <option value="#F6793A">#F6793A</option>
            <option value="#728BF4">#728BF4</option>
            <option value="#04D5C5">#04D5C5</option>
            <option value="#92E230">#92E230</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
    `);
    $(`#select_color_${data[i].id}`).val(data[i].color);
    if (
      data[i].color != "#F4B314" &&
      data[i].color != "#F6793A" &&
      data[i].color != "#728BF4" &&
      data[i].color != "#04D5C5" &&
      data[i].color != "#92E230"
    ) {
      $(`#select_color_${data[i].id}`).val("custom");
      $(`#show_color_${data[i].id}`).removeAttr("disabled");
    }

    $phase.append(`
      <div class="items item-${data[i].id}">
        <select class="form-select" id="show_phase_${data[i].id}" disabled>
          <option value="0">${sql_phase[0]}</option>
          <option value="1">${sql_phase[1]}</option>
          <option value="2">${sql_phase[2]}</option>
          <option value="3">${sql_phase[3]}</option>
        </select>
        <input class="d-none" id="show_position_${data[i].id}" value="${data[i].position}">
      </div>
    `);
    $(`#show_phase_${data[i].id}`).val(data[i].phase);

    let none = "";
    if (data[i].phase == 3) {
      none = "d-none";
    }
    $action.append(`
      <div class="items item-${data[i].id}">
        <div class="btn-group w-75" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-sm btn-success me-1 btn-save" id="btn_save_${data[i].id}">
            <i class="fa-solid fa-floppy-disk"></i>
          </button>
          <button type="button" class="btn btn-sm btn-primary me-1 btn-next ${none}" id="btn_next_${data[i].id}">
          <i class="fa-solid fa-forward"></i>
          </button>
          <button type="button" class="btn btn-sm btn-danger btn-del" id="btn_del_${data[i].id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `);

    if (i == data.length - 1 && i <= 18) {
      $no.append(`<div class="items item-${data[i].id}"></div> `);
      $content.append(`<div class="items item-${data[i].id}"></div> `);
      $color.append(`<div class="items item-${data[i].id}"></div> `);
      $phase.append(`<div class="items item-${data[i].id}"></div> `);
      $action.append(`
        <div class="items item-${data[i].id}">
          <button type="button" class="btn btn-sm btn-success me-1 w-75" id="btn_add">
            <i class="fa-solid fa-plus"></i>
          </button
        </div>
      `);
    }
  }

  $(".btn-save").unbind();
  $(".btn-save").click(async function () {
    let id = $(this).attr("id").split("btn_save_")[1];
    let content = $(`.item-${id} .ip-content`).val();
    let color = $(`#show_color_${id}`).val();
    // let phase = $(`#show_phase_${id}`).val();

    let url = `/kanban_master/edit/${id}`;
    let data = {
      content: content,
      color: color.toLocaleUpperCase(),
      // phase: phase,
    };

    try {
      let res = await AjaxJasonData(url, "put", data);
      SwalAlert(res, "update");
    } catch (error) {
      SwalAlert(error, "error");
    }
    // console.log(data);
  });

  $(".btn-next").unbind();
  $(".btn-next").click(async function () {
    let id = $(this).attr("id").split("btn_next_")[1];
    let ref = $("#input_Ref").val();
    let phase = $(`#show_phase_${id}`).val();
    let position = $(`#show_position_${id}`).val();
    let phase_select = parseInt(phase) + 1;
    let position_select = parseInt(position) + 1;

    let url = `/kanban_master/next/${ref}&${phase_select}&${position_select}`;

    try {
      let res = await AjaxJasonNoData(url, "put");
      start(ref);
      SwalAlert(res, "update");
    } catch (error) {
      SwalAlert(error, "error");
    }
  });

  $(".btn-del").unbind();
  $(".btn-del").click(async function () {
    let id = $(this).attr("id").split("btn_del_")[1];
    let ref = $("#input_Ref").val();
    let phase = $(`#show_phase_${id}`).val();
    let position = $(`#show_position_${id}`).val();
    let phase_select = parseInt(phase) + 1;
    let position_select = parseInt(position) + 1;

    let url = `/kanban_master/delete/${ref}&${phase_select}&${position_select}`;
    try {
      let res = await AjaxJasonNoData(url, "delete");
      start(ref);
      SwalAlert(res, "update");
    } catch (error) {
      SwalAlert(error, "error");
    }
  });

  $(".select-color").change(function () {
    let $selectId = $(this).attr("id");
    let id = $selectId.split("select_color_")[1];
    let val = $(`#${$selectId}`).val();
    // console.log(val)
    if (val != "custom") {
      $(`#show_color_${id}`).val(val);
      $(`#show_color_${id}`).attr("disabled", "disabled");
    } else {
      $(`#show_color_${id}`).removeAttr("disabled");
    }
  });

  $("#btn_add").unbind();
  $("#btn_add").click(async function () {
    $("#add_content_form input").val("");

    $("#modal_add_content").modal("show");
    $("#add_content_form").unbind();
    $("#add_content_form").submit(async function (e) {
      e.preventDefault(); // ป้องกันการโหลดหน้าเว็บใหม่หลังจากการส่งฟอร์ม

      var formData = $(this).serializeArray(); // ดึงข้อมูลฟอร์มเป็นอาร์เรย์

      var formJasonData = {};
      $.each(formData, function (index, field) {
        formJasonData[field.name] = field.value; // สร้าง JSON object จากข้อมูลฟอร์ม
      });

      let ref = $("#input_Ref").val();
      let content = formJasonData.content;

      let url = `/kanban_master/add/${ref}&${content}&F4B314`;

      try {
        let res = await AjaxJasonNoData(url, "post");
        $("#modal_add_content").modal("hide");
        start(ref);
        SwalAlert(res, "update");
      } catch (error) {
        SwalAlert(error, "error");
      }
    });
  });

  $("#btn_phase_edit").unbind();
  $("#btn_phase_edit").click(async function () {
    let array = JSON.parse(data[0].phaseArray);
    $("#phase_edit_form input[name='phase1']").val(array[0]);
    $("#phase_edit_form input[name='phase2']").val(array[1]);
    $("#phase_edit_form input[name='phase3']").val(array[2]);
    $("#phase_edit_form input[name='phase4']").val(array[3]);

    $("#modal_phase_edit").modal("show");
    $("#phase_edit_form").unbind();
    $("#phase_edit_form").submit(async function (e) {
      e.preventDefault(); // ป้องกันการโหลดหน้าเว็บใหม่หลังจากการส่งฟอร์ม

      var formData = $(this).serializeArray(); // ดึงข้อมูลฟอร์มเป็นอาร์เรย์

      var jason = {};
      $.each(formData, function (index, field) {
        jason[field.name] = field.value; // สร้าง JSON object จากข้อมูลฟอร์ม
      });

      let ref = $("#input_Ref").val();
      let newPhase = `["${jason.phase1}","${jason.phase2}","${jason.phase3}","${jason.phase4}"]`;
      let send = {
        phaseArray: newPhase,
      };
      console.log(send);

      let url = `/kanban_master/edit/phase_content/${ref}`;

      try {
        let res = await AjaxJasonData(url, "put", send);
        $("#modal_phase_edit").modal("hide");
        start(ref);
        SwalAlert(res, "update");
      } catch (error) {
        SwalAlert(error, "error");
      }
    });
  });
}

async function start(ref) {
  try {
    let res = await AjaxJasonData(`/kanban_master/data/${ref}`, "get");
    // console.log("get data", res);
    let sql_data = res;

    gendata(sql_data);
  } catch (error) {
    console.log(error);
    $all.html("");
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
    $all.html("");
  }
});
