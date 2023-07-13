var value = [];
const demo = "demo";
$("#input_ref").val(demo);

function genChart(value, M = null, SD = null, lcl = null, ucl = null) {
  if (M) M = parseFloat(M);
  if (SD) SD = parseFloat(SD);
  if (lcl) lcl = parseFloat(lcl);
  if (ucl) ucl = parseFloat(ucl);

  let cases = [];
  let viol = { x: [], y: [] };
  let rule = 1.2;
  for (let i = 1; i <= value.length; i++) cases.push(i);

  let mean = M || calMean(value);
  let sd = SD || calSD(value);
  let _3sd = 3 * sd;
  let _6sd = 6 * sd;

  let minCase = Math.min(...cases) - 1;
  let maxCase = Math.max(...cases) + 1;

  let LCL = lcl || parseFloat((mean - rule * sd).toFixed(2));
  let UCL = ucl || parseFloat((mean + rule * sd).toFixed(2));

  let cp = (UCL - LCL) / _6sd;
  let cpl = (mean - LCL) / _3sd;
  let cpu = (UCL - mean) / _3sd;
  let ppk = Math.min(cpu, cpl);

  // Show
  $(".show_Cp").val(cp.toFixed(2));
  $(".show_Cpl").val(cpl.toFixed(2));
  $(".show_Cpu").val(cpu.toFixed(2));
  $(".show_Ppk").val(ppk.toFixed(2));

  $("#show_Mean").val(mean.toFixed(2));
  $("#show_SD").val(sd.toFixed(2));
  $("#show_LCL").val(LCL.toFixed(2));
  $("#show_UCL").val(UCL.toFixed(2));

  let CL = {
    x: [minCase, maxCase, null, minCase, maxCase],
    y: [LCL, LCL, null, UCL, UCL],
  };

  let Centre = {
    x: [minCase, maxCase],
    y: [(UCL+LCL)/2, (UCL+LCL)/2],
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
    name: "Centre",
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
      // range: [minCase - sd, maxCase + sd],
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
  // console.log("min : ",minValue);
  // console.log('max : ',maxValue);
  // console.log('จำนวนแท่ง histrogram',num_bins);
  if (num_bins < 5) bin_width = Math.round(valueDiff / 5);
  if (num_bins > 20) bin_width = Math.round(valueDiff / 20);

  let popNum = calPopNumber(value);
  let Inc = _6sd / 100;
  let normDist = { x: [], y: [] };

  for (let i = 0; i < 101; i++) {
    let x = mean - 3 * sd + i * Inc;
    x = parseFloat(x.toFixed(2));
    let nomal = normalDistribution(x, mean, sd);
    nomal = parseFloat(nomal.toFixed(6));
    normDist.x.push(x);
    normDist.y.push(nomal);
  }
  // console.log(normDist);

  let histogramChart = {
    x: value,
    type: "histogram",
    name: "Histogram",
    marker: {
      color: "rgba(255, 100, 100, 0.7)",
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

  let chart_Histrogram_CL = {
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

  let chart_NormalDistribution = {
    type: "scatter",
    x: normDist.x,
    y: normDist.y,
    mode: "lines",
    name: "nomal distribution",
    showlegend: true,
    yaxis: "y2",
    line: {
      color: "yellow",
      width: 1.5,
    },
  };

  let histogramChartLayout = {
    bargap: 0.05,
    title: "Histogram with Frequency",
    xaxis: {
      title: "Value",
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
    [histogramChart, chart_Histrogram_CL, chart_NormalDistribution],
    histogramChartLayout
  );
}

async function start(ref) {
  fill_table(ref);
  try {
    let res = await AjaxJasonData(`/masterdata/${ref}`, "get");
    res.forEach((element) => {
      value.push(element.valueData);
    });
  } catch (error) {
    console.log(error);
  }
  genChart(value);
}

start(demo);

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
$("#ref_search").click( (e) => {
  let ref = $("#input_ref").val();
  value = [];

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
  let SD = $("#show_SD").val();
  let LCL = $("#show_LCL").val();
  let UCL = $("#show_UCL").val();
  // console.log(value)
  genChart(value, Mean, SD, LCL, UCL);
});
