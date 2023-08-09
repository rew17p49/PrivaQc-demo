let value = [];
const demo = "demo";
const d2 = 1.128; // มาจากตาราง
const w = 2;
$("#input_ref").val(demo);

const socketio = () => {
  const socket = io.connect(socketHost, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  });

  socket.on("connect", () => {
    console.log("connected");
    socket.emit("joinRoom", `ChartOrder`);
  });

  socket.on("reconnect", () => {
    console.log(`reconnect`);
    socket.emit("joinRoom", `ChartOrder`);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("check-connect", (msg) => {
    console.log(msg);
  });

  socket.on("chart-update", (msg) => {
    console.log(msg);
    let ref = $("#input_ref").val();
    // console.log(ref)
    start(ref);
  });
  socket.on("disconnect", () => {
    console.log("disconnectd");
    window.setTimeout(socket.connect(), 5000);
  });
};

function genChart(value, M = null, SD_PPK = null, lcl = null, ucl = null) {
  if (M) M = parseFloat(M);
  if (SD_PPK) SD_PPK = parseFloat(SD_PPK);
  if (lcl) lcl = parseFloat(lcl);
  if (ucl) ucl = parseFloat(ucl);

  let cases = [];
  let viol = { x: [], y: [] };
  let rule = 1.2;
  for (let i = 1; i <= value.length; i++) cases.push(i);

  // PPK
  let mean = M || calMean(value);
  let sd_PPK = SD_PPK || calSD_PPK(value);
  let _3sd_PPK = 3 * sd_PPK;
  let _6sd_PPK = 6 * sd_PPK;

  let minCase = Math.min(...cases) - 1;
  let maxCase = Math.max(...cases) + 1;

  let LCL = lcl || parseFloat((mean - rule * sd_PPK).toFixed(2));
  let UCL = ucl || parseFloat((mean + rule * sd_PPK).toFixed(2));

  let pp = (UCL - LCL) / _6sd_PPK;
  // console.log(pp)
  let ppl = (mean - LCL) / _3sd_PPK;
  let ppu = (UCL - mean) / _3sd_PPK;
  let ppk = Math.min(ppu, ppl);

  // CPK
  let AMR; // Averange Moving Range
  let sumValueDef = 0;
  for (let i = 0; i < value.length; i++) {
    if (i == 0) sumValueDef += 0;
    else {
      sumValueDef += Math.abs(value[i] - value[i - 1]);
    }
  }
  AMR = sumValueDef / (value.length - w + 1);
  let sd_CPK = SD_PPK || AMR / d2;
  let _3sd_CPK = 3 * sd_CPK;
  let _6sd_CPK = 6 * sd_CPK;

  let cp = (UCL - LCL) / _6sd_CPK;
  let cpl = (mean - LCL) / _3sd_CPK;
  let cpu = (UCL - mean) / _3sd_CPK;
  let cpk = Math.min(cpu, cpl);
  // console.log("cpk: ", sd_CPK);

  // Show
  $("#show_Mean").val(mean.toFixed(2));
  $("#show_SD_PPK").val(sd_PPK.toFixed(2));
  $("#show_LCL").val(LCL.toFixed(2));
  $("#show_UCL").val(UCL.toFixed(2));

  $(".show_SD_Ppk").val(sd_PPK.toFixed(2));
  $(".show_Pp").val(pp.toFixed(2));
  $(".show_Ppl").val(ppl.toFixed(2));
  $(".show_Ppu").val(ppu.toFixed(2));
  $(".show_Ppk").val(ppk.toFixed(2));

  $(".show_SD_Cpk").val(sd_CPK.toFixed(2));
  $(".show_Cp").val(cp.toFixed(2));
  $(".show_Cpl").val(cpl.toFixed(2));
  $(".show_Cpu").val(cpu.toFixed(2));
  $(".show_Cpk").val(cpk.toFixed(2));

  let CL = {
    x: [minCase, maxCase, null, minCase, maxCase],
    y: [LCL, LCL, null, UCL, UCL],
  };

  let Centre = {
    x: [minCase, maxCase],
    y: [(UCL + LCL) / 2, (UCL + LCL) / 2],
  };

  // Control Chart

  for (let i = 0; i < cases.length; i++) {
    if (value[i] > UCL || value[i] < LCL) {
      viol.x.push(cases[i]);
      viol.y.push(value[i]);
    }
  }

  let chart_Value = {
    type: "scatter",
    x: cases,
    y: value,
    name: "Data",
    mode: "lines",
    showlegend: true,
    hoverinfo: "all",
    line: {
      color: "blue",
      width: 2,
    },
    marker: {
      color: "blue",
      size: 8,
      symbol: "circle",
    },
  };

  let chart_Viol = {
    type: "scatter",
    x: viol.x,
    y: viol.y,
    mode: "markers",
    name: "Violation",
    showlegend: true,
    marker: {
      color: "rgb(255,65,54)",
      line: { width: 3 },
      opacity: 0.5,
      size: 12,
      symbol: "circle-open",
    },
  };

  let chart_CL = {
    type: "scatter",
    x: CL.x,
    y: CL.y,
    mode: "lines",
    name: "LCL/UCL",
    showlegend: true,
    line: {
      color: "grey",
      width: 2,
      dash: "dash",
    },
  };

  let chart_Centre = {
    type: "scatter",
    x: Centre.x,
    y: Centre.y,
    mode: "lines",
    name: "CL",
    showlegend: true,
    line: {
      color: "grey",
      width: 2,
    },
  };

  let data = [chart_Value, chart_Viol, chart_CL, chart_Centre];

  let controlChartLayout = {
    title: "Control Chart",
    xaxis: {
      zeroline: false,
    },
    yaxis: {
      autorange: true,
      zeroline: false,
    },
  };

  Plotly.newPlot("controlChart", data, controlChartLayout);

  // Histogram

  let bin_width = Math.round(1 + 3.3 * Math.log10(value.length));
  // bin_width  = 4
  // console.log("log: ", bin_width );
  let minValue = Math.min(...value);
  let maxValue = Math.max(...value);
  let valueDiff = maxValue - minValue;
  let num_bins = Math.round(valueDiff / bin_width);

  if (num_bins < 5) bin_width = Math.round(valueDiff / 5);
  if (num_bins > 20) bin_width = Math.round(valueDiff / 20);

  // ND PPK
  let Inc_PPK = _6sd_PPK / 100;
  let normDist_PPK = { x: [], y: [] };

  for (let i = 0; i < 101; i++) {
    let x = mean - 3 * sd_PPK + i * Inc_PPK;
    x = parseFloat(x.toFixed(2));
    let nomal = normalDistribution(x, mean, sd_PPK);
    nomal = parseFloat(nomal.toFixed(6));
    normDist_PPK.x.push(x);
    normDist_PPK.y.push(nomal);
  }

  // ND CPK
  let Inc_CPK = _6sd_CPK / 100;
  let normDist_CPK = { x: [], y: [] };

  for (let i = 0; i < 101; i++) {
    let x = mean - 3 * sd_CPK + i * Inc_CPK;
    x = parseFloat(x.toFixed(2));
    let nomal = normalDistribution(x, mean, sd_CPK);
    nomal = parseFloat(nomal.toFixed(6));
    normDist_CPK.x.push(x);
    normDist_CPK.y.push(nomal);
  }

  // console.log(normDist_CPK);

  let histogramChart = {
    x: value,
    type: "histogram",
    name: "Histogram",
    marker: {
      color: "#adadad98",
      line: {
        color: "#969696", // Change the border color
        width: 1, // Change the border width
      },
    },
    yaxis: "y",
    xbins: {
      start: minValue,
      end: maxValue,
      size: bin_width, // กำหนดขนาดช่วงเป็น 3
    },
  };

  let histogramBins = [];
  let maxFrequency = 0;

  for (
    var i = histogramChart.xbins.start;
    i <= histogramChart.xbins.end;
    i += histogramChart.xbins.size
  ) {
    let count = 0;

    for (var j = 0; j < histogramChart.x.length; j++) {
      if (
        histogramChart.x[j] >= i &&
        histogramChart.x[j] < i + histogramChart.xbins.size
      ) {
        count++;
      }
    }

    histogramBins.push(count);
    if (count > maxFrequency) {
      maxFrequency = count;
    }
  }

  let CL_Histogram = {
    x: [LCL, LCL, null, UCL, UCL],
    y: [minCase, maxFrequency, null, minCase, maxFrequency],
  };

  let chart_Histogram_CL = {
    type: "scatter",
    x: CL_Histogram.x,
    y: CL_Histogram.y,
    mode: "lines",
    name: "LCL/UCL",
    showlegend: true,
    yaxis: "y",
    line: {
      color: "blue",
      width: 2,
      dash: "dash",
    },
  };

  let chart_NormalDistribution_PPK = {
    type: "scatter",
    x: normDist_PPK.x,
    y: normDist_PPK.y,
    mode: "lines",
    name: "ND PPK",
    showlegend: true,
    yaxis: "y2",
    line: {
      // color: "rgba(255, 100, 100, 0.7)",
      color: "black",
      width: 3,
      dash: "dash",
    },
  };

  let chart_NormalDistribution_CPK = {
    type: "scatter",
    x: normDist_CPK.x,
    y: normDist_CPK.y,
    mode: "lines",
    name: "ND CPK",
    showlegend: true,
    yaxis: "y2",
    line: {
      color: "rgba(255, 100, 100, 0.9)",
      width: 3,
    },
  };

  let histogramChartLayout = {
    // bargap: 0.05,
    // title: false,
    title: "Proess Capability Report",
    xaxis: {
      title: false,
      tickmode: "linear",
      tick0: 0,
      dtick: histogramChart.xbins.size,
    },
    yaxis: [
      {
        title: "Count",
      },
      {
        title: "Frequency",
        overlaying: "y",
        side: "right",
      },
    ],
    yaxis2: {
      // title: "Chart 2 Scale",
      overlaying: "y",
      side: "right",
      showgrid: false, //
    },
  };

  Plotly.newPlot(
    "histogramChart",
    [
      histogramChart,
      chart_Histogram_CL,
      chart_NormalDistribution_PPK,
      chart_NormalDistribution_CPK,
    ],
    histogramChartLayout
  );
}

async function start(ref) {
  value.splice(0);
  fill_table(ref);
  try {
    let res = await AjaxJasonData(`/masterdata/${ref}`, "get");
    res.forEach((element) => {
      value.push(element.valueData);
    });

    if (res.length == 0) {
      // genChart(value);
      SwalError("ไม่พบข้อมูลในฐานข้อมูล");
    }
  } catch (error) {
    console.log(error);
  }
  genChart(value);

}

// $(function () {
start(demo);
socketio();

$("#btn_change").unbind();
$("#btn_change").click((e) => {
  let this_btn = $(e.target);
  if (this_btn.hasClass("toLines")) {
    this_btn.removeClass("toLines");
    Plotly.restyle("controlChart", { mode: "lines" }, [0]);
  } else {
    this_btn.addClass("toLines");
    Plotly.restyle("controlChart", { mode: "markers" }, [0]);
  }
});

$("#ref_search").unbind();
$("#ref_search").click((e) => {
  let ref = $("#input_ref").val();

  if (ref) {
    start(ref);
  } else {
    fill_table(null);
    value = [];
    genChart(value);
  }
});

$("#change_data").unbind();
$("#change_data").click(async (e) => {
  let Mean = $("#show_Mean").val();
  let SD_PPK = $("#show_SD_PPK").val();
  let LCL = $("#show_LCL").val();
  let UCL = $("#show_UCL").val();
  // console.log(value)
  genChart(value, Mean, SD_PPK, LCL, UCL);
});
// });
