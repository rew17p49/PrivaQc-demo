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