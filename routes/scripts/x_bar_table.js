let min = 20;
let max = 30;
let k = 5; // ความกว้างของชุดข้อมูล
let N = 20; // จำนวนชุดข้อมูล
let data = [];
let Def = Math.abs(max - min + 1);

for (var i = 0; i < N; i++) {
  let dataGroup = [];
  for (let j = 0; j < k; j++) {
    var randomNumber = Math.floor(Math.random() * Def) + parseInt(min); // สุ่มตัวเลขระหว่าง 20 - 40
    dataGroup.push(randomNumber);
  }
  data.push(dataGroup);
}

// console.log(data);
getDataXbar('test')
async function getDataXbar(ref) {
  let arrayData = [];

  try {
    let res = await AjaxJasonData(`/xbardata/${ref}`, "get");
    // console.log(res)
    res.forEach((element) => {
      let jsonString = element.valueArray;
      let jsonArray = JSON.parse(jsonString);
      arrayData.push(jsonArray);
    });
  } catch (error) {
    console.log(error);
  }

  console.log(arrayData)
  fill_table_Xbar(arrayData);
}

// fill_table_Xbar(data);

function fill_table_Xbar(data) {
  let col = data[0].length + 1;
  let row = data.length;
  // console.log("row j: ", row);
  // console.log("col i: ", col);
  let html = "";
  $("#tbXBar").html(html);
  for (let i = 0; i < col; i++) {
    if (i == 0)
      $("#tbXBar").append(`<tr id = "col_${i}"><th> Group </th></tr>`);
    else $("#tbXBar").append(`<tr id = "col_${i}" ><th> n${i} </th></tr>`);

    for (let j = 0; j < row; j++) {
      if (i == 0) $(`#col_${i}`).append(`<td>${j + 1}</td>`);
      else $(`#col_${i}`).append(`<td>${data[j][i - 1]}</td>`);
    }
  }
}
