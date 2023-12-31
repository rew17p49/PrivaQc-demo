function calSum(array) {
  let sum = array.reduce(
    (total, num) => parseFloat(total) + parseFloat(num),
    0
  );

  return sum;
}

function calMean(array) {
  let sum = calSum(array);
  let mean = parseFloat(sum) / parseFloat(array.length);
  return mean;
}

function calSD_PPK(array) {
  let mean = calMean(array);
  let squaredDifferences = array.map((value) => Math.pow(value - mean, 2));
  // console.log('squ: ',squaredDifferences)
  let sum = calSum(squaredDifferences);
  let variance = sum / (squaredDifferences.length - 1);
  let standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}

function calPopNumber(array) {
  let numberCount = {};

  // นับจำนวนการเกิดของแต่ละตัวเลขในอาร์เรย์
  for (let i = 0; i < array.length; i++) {
    let number = array[i];
    if (numberCount[number] === undefined) {
      numberCount[number] = 1;
    } else {
      numberCount[number]++;
    }
  }

  let popularNumber;
  let maxCount = 0;

  // หาตัวเลขที่มีความถี่สูงสุด
  for (let number in numberCount) {
    if (numberCount[number] > maxCount) {
      popularNumber = number;
      maxCount = numberCount[number];
    }
  }

  return {
    number: popularNumber,
    count: maxCount,
  };
}

function normalDistribution(x, mean, stdDev) {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

function dataTimeNow() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // January is month 0
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function AjaxJasonData(url, method, data) {
  return new Promise(async (resolve, reject) => {
    $.ajax({
      url: url,
      method: method,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: (res) => {
        resolve(res);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

function AjaxJasonNoData(url, method) {
  return new Promise(async (resolve, reject) => {
    $.ajax({
      url: url,
      method: method,
      contentType: "application/json",
      success: (res) => {
        resolve(res);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

function SwalAlert(txt, title) {
  let action = title.toUpperCase();
  // console.log(txt)
  if (action == "ERROR") {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: title,
      text: txt.responseJSON.message,
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#FF5733",
    });
  } else {
    Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      text: txt.message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

function SwalError(txt) {
  Swal.fire({
    position: "center",
    icon: "warning",
    title: "Error",
    text: txt,
    showConfirmButton: true,
    confirmButtonText: "OK",
    confirmButtonColor: "#FF5733",
  });
}
