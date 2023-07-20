const ip = "http://127.0.11.11:3000";

function histogramChart(data) {
  let mean = parseFloat(data.mean);
  let sd = parseFloat(data.sd);
  let LCL = parseFloat(data.LCL);
  let UCL = parseFloat(data.UCL);

  let normDist = [];
  let maxFrequency = 100;

  let CL = (UCL + LCL) / 2;
  let _3sd = 3 * sd;
  let _6sd = 6 * sd;
  let Inc = _6sd / 100;

  let cp = (UCL - LCL) / _6sd;
  let cpl = (mean - LCL) / _3sd;
  let cpu = (UCL - mean) / _3sd;
  let cpk = Math.min(cpu, cpl);
  cp = parseFloat(cp.toFixed(2));
  cpk = parseFloat(cpk.toFixed(2));
  $("#Show_CP").val(cp);
  $("#Show_CPK").val(cpk);

  for (let i = 0; i < 101; i++) {
    let x = mean - 3 * sd + i * Inc;
    x = parseFloat(x.toFixed(2));
    let nomal = normalDistribution(x, mean, sd);
    nomal = parseFloat(nomal.toFixed(6));
    normDist.push({ x: x, y: nomal });
  }

  let LCL_Histogram = [
    { x: LCL, y: 0 },
    { x: LCL, y: maxFrequency },
  ];

  let UCL_Histogram = [
    { x: UCL, y: 0 },
    { x: UCL, y: maxFrequency },
  ];

  let CL_Histogram = [
    { x: CL, y: 0 },
    { x: CL, y: maxFrequency },
  ];

  return { normDist, LCL_Histogram, UCL_Histogram, CL_Histogram };
}

let mean = $("#input_mean").val();
let sd = $("#input_sd").val();
let LCL = $("#input_LCL").val();
let UCL = $("#input_UCL").val();

let data = { mean, sd, LCL, UCL };
let histogram = histogramChart(data);

let chart_Data = {
  datasets: [
    {
      label: "Normal Distribution",
      data: histogram.normDist,
      showLine: true,
      borderColor: "blue",
      backgroundColor: "rgba(255,255,255,0)",
      borderWidth: 3,
      pointRadius: 0,
      // yAxisID: "y-axis-2",
    },
    {
      label: "Center",
      data: histogram.CL_Histogram,
      showLine: true,
      borderColor: "gray",
      borderWidth: 2,
      backgroundColor: "rgba(255,255,255,0)",
      pointRadius: 0,
      yAxisID: "y-axis-1",
    },
    {
      label: "LCL",
      data: histogram.LCL_Histogram,
      showLine: true,
      borderColor: "red",
      borderWidth: 2,
      backgroundColor: "rgba(255,255,255,0)",
      pointRadius: 0,
      yAxisID: "y-axis-1",
    },
    {
      label: "UCL",
      data: histogram.UCL_Histogram,
      showLine: true,
      borderColor: "red",
      borderWidth: 2,
      backgroundColor: "rgba(255,255,255,0)",
      pointRadius: 0,
      yAxisID: "y-axis-1",
    },
  ],
};

let options = {
  responsive: true,
  scales: {
    x: {
      display: true, // แสดงแกน x
      ticks: {
        display: true, // แสดงเลขบนแกน x
        beginAtZero: true, // ให้เริ่มต้นที่ค่าศูนย์
      },
    },
    y: {
      display: false,
      id: "y-axis-1",
      type: "linear",
      position: "left", // แสดงแกน y ทางซ้าย
    },
    y2: {
      display: false,
      id: "y-axis-2",
      type: "linear",
      position: "right", // แสดงแกน y ทางขวา
    },
  },
};

var ctx = document.getElementById("histogramChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "scatter",
  data: chart_Data,
  options: options,
});

$("#btn_submit").unbind();
$("#btn_submit").click((e) => {
  let mean = $("#input_mean").val();
  let sd = $("#input_sd").val();
  let LCL = $("#input_LCL").val();
  let UCL = $("#input_UCL").val();

  let data = { mean, sd, LCL, UCL };
  let histogram = histogramChart(data);

  myChart.data.datasets[0].data = histogram.normDist;
  myChart.data.datasets[1].data = histogram.CL_Histogram;
  myChart.data.datasets[2].data = histogram.LCL_Histogram;
  myChart.data.datasets[3].data = histogram.UCL_Histogram;

  myChart.update();
});

$("#random_form,#one_form,#random_xbar_form,#one_xbar_form").unbind();
$("#random_form,#one_form,#random_xbar_form,#one_xbar_form").submit(async function (e) {
  e.preventDefault(); // ป้องกันการโหลดหน้าเว็บใหม่หลังจากการส่งฟอร์ม

  var formData = $(this).serializeArray(); // ดึงข้อมูลฟอร์มเป็นอาร์เรย์

  var formJasonData = {};
  $.each(formData, function (index, field) {
    formJasonData[field.name] = field.value; // สร้าง JSON object จากข้อมูลฟอร์ม
  });

  let reference = $("#input_ref").val();
  let reference_XBar = $("#input_ref_xbar").val();
  let time = dataTimeNow();
  if (e.target.id == "random_form") {
    let length = formJasonData.random_quantity;
    let min = parseInt(formJasonData.random_min);
    let max = parseInt(formJasonData.random_max);
    let Def = Math.abs(max - min + 1);
    let value = [];
    for (var i = 0; i < length; i++) {
      var randomNumber = Math.floor(Math.random() * Def) + parseInt(min); // สุ่มตัวเลขระหว่าง 20 - 40
      value.push(randomNumber);
    }
    value.length == 0 ? (value = "") : (value = value);
    console.log(value);

    // console.log(value.length == 0)
    let data = {
      Reference: reference,
      valueRandom: value,
      valueDatetime: time,
    };
    try {
      let res = await AjaxJasonData(`/masterdata/add/random`, "post", data);
      SwalAlert(res, "upload");
    } catch (error) {
      SwalAlert(error, "error");
    }
  } else if (e.target.id == "one_form") {
    let data = {
      Reference: reference,
      valueData: formJasonData.one_data,
      valueDatetime: time,
    };
    try {
      let res = await AjaxJasonData(`/masterdata/add`, "post", data);
      SwalAlert(res, "upload");
    } catch (error) {
      SwalAlert(error, "error");
    }
  } else if (e.target.id == "random_xbar_form") {
    let length = formJasonData.random_quantity;
    let range = formData.random_range;
    let min = parseInt(formJasonData.random_min);
    let max = parseInt(formJasonData.random_max);
    let Def = Math.abs(max - min + 1);
    let value = [];
    for (var i = 0; i < length; i++) {
      let dataGroup = [];
      for (let j = 0; j < range; j++) {
        var randomNumber = Math.floor(Math.random() * Def) + parseInt(min); // สุ่มตัวเลขระหว่าง 20 - 40
        dataGroup.push(randomNumber);
      }
      value.push(dataGroup);
    }

    let data = {
      Reference: reference_XBar,
      valueRandom: value,
      valueDatetime: time,
    };

    try {
      let res = await AjaxJasonData(`/xbardata/add/random`, "post", data);
      SwalAlert(res, "upload");
    } catch (error) {
      SwalAlert(error, "error");
    }
  }
});

$("#btn_toggle_cp").unbind();
$("#btn_toggle_cp").click(() => {
  if ($("#Send_Data_QC").hasClass("show")) {
    $("#Send_Data_QC").toggleClass("show");
  }
  if ($("#Send_Data_Xbar").hasClass("show")) {
    $("#Send_Data_Xbar").toggleClass("show");
  }
});

$("#btn_toggle_send_QC").unbind();
$("#btn_toggle_send_QC").click(() => {
  if ($("#CP_CPK").hasClass("show")) {
    $("#CP_CPK").toggleClass("show");
  }
  if ($("#Send_Data_Xbar").hasClass("show")) {
    $("#Send_Data_Xbar").toggleClass("show");
  }
});

$("#btn_toggle_send_Xbar").unbind();
$("#btn_toggle_send_Xbar").click(() => {
  if ($("#CP_CPK").hasClass("show")) {
    $("#CP_CPK").toggleClass("show");
  }
  if ($("#Send_Data_QC").hasClass("show")) {
    $("#Send_Data_QC").toggleClass("show");
  }
});
