let ref = $("#input_Ref").val();
const $all = $(
  ".column-no,.column-content,.column-color,.column-phase,.column-action"
);
const $no = $(".column-no");
const $content = $(".column-content");
const $color = $(".column-color");
const $phase = $(".column-phase");
const $action = $(".column-action");

function gendata(data) {
  let sql_phase = JSON.parse(data[0].phaseArray);
  console.log("data: ", data);
  $all.html("");

  for (let i = 0; i < data.length; i++) {
    let No_ = i + 1;
    $no.append(`<div class="items item-1"><p>${No_}</p></div>`);

    $content.append(`
      <div class="items item-${data[i].id}">
        <input type="text" class="ip-content" value="${data[i].content}">
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

    $phase.append(`
      <div class="items item-${data[i].id}">
        <select class="form-select" id="show_phase_${data[i].id}">
          <option value="0">${sql_phase[0]}</option>
          <option value="1">${sql_phase[1]}</option>
          <option value="2">${sql_phase[2]}</option>
          <option value="3">${sql_phase[3]}</option>
        </select>
      </div>
    `);
    $(`#show_phase_${data[i].id}`).val(data[i].phase);

    $action.append(`
        <div class="items item-${data[i].id}">
          <div class="btn-group w-75" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-primary me-1 btn-save" id="btn_save_${data[i].id}">
              <i class="fa-solid fa-floppy-disk"></i>
            </button>
            <button type="button" class="btn btn-sm btn-danger btn-del" id="btn_del_${data[i].id}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `);

    if (i == data.length - 1 && i <= 18) {
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
  $(".btn-save").click(function () {
    let id = $(this).attr("id").split("btn_save_")[1];
    let content = $(`.item-${id} .ip-content`).val();
    let color = $(`#show_color_${id}`).val();
    let phase = $(`#show_phase_${id}`).val();

    let url = `/kanban/add/${id}`
    let data = {
      content: content,
      color: color,
      phase: phase,
    };
    console.log(data);
  });

  $(".btn-del").unbind();
  $(".btn-del").click(function () {
    let id = $(this).attr("id").split("btn_del_")[1];
  })

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
}

async function start(ref) {
  try {
    let res = await AjaxJasonData(`/kanban/get/${ref}`, "get");
    // console.log("get data", res);
    let sql_data = res;
    // console.log("sql_data: ", sql_data);

    // console.log("sql_phase: ", sql_phase);

    gendata(sql_data);
  } catch (error) {
    console.log(error);
  }
}

start(ref);
