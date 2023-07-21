function runChart(data) {
  let k = data[0].length;
  // console.log(k)
  if (k == 1) {
    let D2 = 1.128;
    let D3 = 0;
    let D4 = 3.267;
    let sumOfDef = 0;
    let array_X = [];
    let array_MR = [];
    for (let i = 0; i < data.length - 1; i++) {
      // console.log("data", data[i][0]);

      array_X.push(data[i][0]);
      let Def = Math.abs(data[i + 1][0] - data[i][0]);
      array_MR.push(Def);
      sumOfDef += Def;
    }
    // console.log(array_X);
    let MR_Bar = (1 / (N - 1)) * sumOfDef;
    let X_Bar = calMean(data);

    //graph X Bar
    let X_UCL = X_Bar + (3 * MR_Bar) / D2;
    let X_CL = X_Bar;
    let X_LCL = X_Bar - (3 * MR_Bar) / D2;
    // console.log(calSum(data))

    //graph MR Bar
    let MR_UCL = D4 * MR_Bar;
    let MR_CL = MR_Bar;
    let MR_LCL = D3 * MR_Bar;

    let chart_X_Data = {
      data: array_X,
      LCL: X_LCL,
      UCL: X_UCL,
      CL: X_CL,
    };

    let chart_MR_Data = {
      data: array_MR,
      LCL: MR_LCL,
      UCL: MR_UCL,
      CL: MR_CL,
    };

    genXbarChart("X-Bar", chart_X_Data);
    genXbarChart("MR", chart_MR_Data);
  }
  // solution กรณี 2 <= k <= 10

  if (k >= 2 && k <= 10) {
    let No = k - 2;
    const D3 = [0, 0, 0, 0, 0, 0.8, 0.14, 0.18, 0.22];
    const D4 = [3.27, 2.57, 2.28, 2.11, 2, 1.92, 1.86, 1.82, 1.78];
    const A2 = [1.88, 1.02, 0.73, 0.58, 0.48, 0.42, 0.37, 0.34, 0.31];

    let array_R = [];
    let array_X_Bar = [];

    for (let i = 0; i < data.length; i++) {
      // console.log("data sum:", calSum(data[i]));
      let group_Max = Math.max(...data[i]);
      let group_Min = Math.min(...data[i]);
      let X_Bar = calSum(data[i]) / data[i].length;
      let R = Math.abs(group_Max - group_Min);
      array_R.push(R);
      array_X_Bar.push(X_Bar);
    }

    let X_DubleBar = calMean(array_X_Bar);
    let R_Bar = calMean(array_R);

    // console.log(R_Bar);

    let X_Bar_UCL = X_DubleBar + A2[No] * R_Bar;
    let X_Bar_CL = X_DubleBar;
    let X_Bar_LCL = X_DubleBar - A2[No] * R_Bar;

    let R_Bar_UCL = D4[No] * R_Bar;
    let R_Bar_CL = R_Bar;
    let R_Bar_LCL = D3[No] * R_Bar;

    let chart_X_Bar_Data = {
      data: array_X_Bar,
      LCL: X_Bar_LCL,
      UCL: X_Bar_UCL,
      CL: X_Bar_CL,
    };

    let chart_R_Bar_Data = {
      data: array_R,
      LCL: R_Bar_LCL,
      UCL: R_Bar_UCL,
      CL: R_Bar_CL,
    };

    genXbarChart("X-Bar", chart_X_Bar_Data);
    genXbarChart("R", chart_R_Bar_Data);
  }

  // solution กรณี 11 <= k <= 25
  if (k >= 11 && k <= 25) {
    let A3 = [
      0.927, 0.886, 0.85, 0.817, 0.789, 0.763, 0.739, 0.718, 0.698, 0.68, 0.663,
      0.647, 0.633, 0.619, 0.606,
    ];
    let B3 = [
      0.321, 0.354, 0.382, 0.406, 0.428, 0.448, 0.466, 0.482, 0.497, 0.51,
      0.523, 0.534, 0.545, 0.555, 0.565,
    ];
    let B4 = [
      1.679, 1.646, 1.618, 1.594, 1.572, 1.552, 1.534, 1.518, 1.503, 1.49,
      1.477, 1.466, 1.455, 1.445, 1.435,
    ];
    let No = k - 11;
    let array_S = [];
    let array_X_Bar = [];

    for (let i = 0; i < data.length; i++) {
      let X_Bar = calMean(data[i]);
      array_X_Bar.push(X_Bar);
      array_S.push(parseFloat(calSD_PPK(data[i]).toFixed(2)));
    }
    let X_DubleBar = calMean(array_X_Bar);
    let S_Bar = calMean(array_S);

    let X_Bar_UCL = X_DubleBar + A3[No] * S_Bar;
    let X_Bar_CL = X_DubleBar;
    let X_Bar_LCL = X_DubleBar - A3[No] * S_Bar;

    let S_Bar_UCL = B4[No] * S_Bar;
    let S_Bar_CL = S_Bar;
    let S_Bar_LCL = B3[No] * S_Bar;

    let chart_X_Bar_Data = {
      data: array_X_Bar,
      LCL: X_Bar_LCL,
      UCL: X_Bar_UCL,
      CL: X_Bar_CL,
    };

    let chart_S_Bar_Data = {
      data: array_S,
      LCL: S_Bar_LCL,
      UCL: S_Bar_UCL,
      CL: S_Bar_CL,
    };

    genXbarChart("X-Bar", chart_X_Bar_Data);
    genXbarChart("S-Bar", chart_S_Bar_Data);
  }
}
// solution กรณี k = 1

////////////////////////////////////////////////////

function genXbarChart(chartName, Data) {
  let { data, LCL, UCL, CL } = Data;
  let cases = [];
  let Data_Viol = { x: [], y: [] };
  for (let i = 1; i <= data.length; i++) cases.push(i);
  let minCase = Math.min(...cases) - 1;
  let maxCase = Math.max(...cases) + 1;
  if (chartName == "R") {
    console.log(UCL);
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] > UCL || data[i] < LCL) {
      Data_Viol.x.push(cases[i]);
      Data_Viol.y.push(data[i]);
    }
  }

  let Data_LCL_UCL = {
    x: [minCase, maxCase, null, minCase, maxCase],
    y: [LCL, LCL, null, UCL, UCL],
  };

  let Data_CL = {
    x: [minCase, maxCase],
    y: [CL, CL],
  };

  let chart = {
    type: "scatter",
    x: cases,
    y: data,
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
    x: Data_Viol.x,
    y: Data_Viol.y,
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

  let chart_LCL_UCL = {
    type: "scatter",
    x: Data_LCL_UCL.x,
    y: Data_LCL_UCL.y,
    mode: "lines",
    name: "LCL/UCL",
    showlegend: true,
    line: {
      color: "red",
      // color: "grey",
      width: 2,
      dash: "dash",
    },
  };

  let chart_CL = {
    type: "scatter",
    x: Data_CL.x,
    y: Data_CL.y,
    mode: "lines",
    name: "CL",
    showlegend: true,
    line: {
      color: "grey",
      width: 2,
    },
  };

  let chart_Data = [chart, chart_Viol, chart_LCL_UCL, chart_CL];

  let ChartLayout = {
    title: `${chartName} Chart`,
    xaxis: {
      zeroline: false,
    },
    yaxis: {
      autorange: true,
      zeroline: false,
    },
  };

  if (chartName == "X-Bar") {
    Plotly.newPlot("xBarChart", chart_Data, ChartLayout);
  } else {
    Plotly.newPlot("RChart", chart_Data, ChartLayout);
  }
}
