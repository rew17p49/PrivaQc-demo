const maxContent = 20;
const maxPhase = 4;
const defaultPhase = ["PLAN", "WORK", "CHECK", "DONE"];
const defaultColor = ["#F4B314", "#F6793A", "#728BF4", "#04D5C5", "#92E230"];
let ref = $("#input_Ref").val();
let phase = [];
const bodyAll = $(`.row-body .col-3`);

// let testData = [
//   {
//     id: 1,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 1",
//     phase: "PLAN",
//     color: "#F4B314",
//     valueDatetime: "2022-08-02 12:40",
//   },

//   {
//     id: 2,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 2",
//     phase: "CHECK",
//     color: "#F6793A",
//     valueDatetime: "2022-08-02 12:40",
//   },
//   {
//     id: 3,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 3",
//     phase: "PLAN",
//     color: "#728BF4",
//     valueDatetime: "2022-08-02 12:40",
//   },
//   {
//     id: 4,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 4",
//     phase: "WORK",
//     color: "#F4B314",
//     valueDatetime: "2022-08-02 12:40",
//   },
//   {
//     id: 5,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 5",
//     phase: "PLAN",
//     color: "#F4B314",
//     valueDatetime: "2022-08-02 12:40",
//   },
//   {
//     id: 6,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 6",
//     phase: "PLAN",
//     color: "#F4B314",
//     valueDatetime: "2022-08-02 12:40",
//   },

//   {
//     id: 7,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "content 7",
//     phase: "PLAN",
//     color: "#F4B314",
//     valueDatetime: "2022-08-02 12:40",
//   },
// ];

// let newData = [
//   {
//     id: 8,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "new content 1",
//     phase: "DONE",
//     color: "#92E230",
//     valueDatetime: "2022-08-02 12:40",
//   },
//   {
//     id: 9,
//     Reference: "demo",
//     phaseArray: '["PLAN", "WORK", "CHECK", "DONE"]',
//     content: "new content 2",
//     phase: "WORK",
//     color: "#92E230",
//     valueDatetime: "2022-08-02 12:40",
//   },
// ];

// let arrayPhase = JSON.parse(testData[0].phaseArray);


//Head
function genHead(array) {
  for (let i = 0; i < 4; i++) {
    let arrayPhase = [];
    phase.length == 0 ? (arrayPhase = defaultPhase) : (arrayPhase = array);
    let head = $(`.row-head .phase-0${i + 1}`);
    head.html("");
    head.html(`<p>${arrayPhase[i]}</p>`);
  }
}

// Body
function genBody(data,sql_phase, showing = null) {
  let Showing = showing;

  for (let i = 0; i < data.length; i++) {
    let dataPhase = data[i].phase;

    for (let j = 0; j < 4; j++) {
      if (dataPhase == j) {
        let body = $(`.row-body .phase-0${j + 1}`);
        body.append(
          `<div class="cel-card ${Showing}">
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
    let res = await AjaxJasonData(`/kanban/get/${ref}`, "get");
    // console.log("get data", res);
    let sql_data = res;
    let sql_phase = JSON.parse(sql_data[0].phaseArray);

    bodyAll.html("");
    genHead(sql_phase)
    genBody(sql_data,sql_phase);

  } catch (error) {
    console.log(error);
  }
}

start(ref);

$("#btn_search").unbind();
$("#btn_search").click((e) => {
  let ref = $("#input_ref").val();
  if (ref) {
    start(ref);
  } else {
    bodyAll.html("");
  }
});


