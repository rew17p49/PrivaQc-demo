function calSum(array) {
  let sum = array.reduce((total, num) => total + num, 0);
  return sum;
}

function calMean(array) {
  let sum = calSum(array);
  let mean = sum / array.length;
  return mean;
}



function calSD(array) {
  const mean = calMean(array);
  const squaredDifferences = array.map((value) => Math.pow(value - mean, 2));
  const variance = calMean(squaredDifferences);
  const standardDeviation = Math.sqrt(variance);
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
    count: maxCount
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

function AjaxJasonData(url, method, data = null) {
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

function SwalAlert(txt, title) {
  let action = title.toUpperCase();
  let Text;
  if (action == "ERROR") {
    if (txt.responseJSON.message) Text = txt.responseJSON.message;
    Swal.fire({
      position: "center",
      icon: "warning",
      title: title,
      text: Text,
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#FF5733",
    });
  } else {
    if (txt.message) Text = txt.message;
    Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      text: Text,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}


// // ตัวอย่างการใช้งาน
// const numbers = [1, 2, 3, 2, 2, 4, 5, 4, 2];
// const popularNumberInfo = calPopNumber(numbers);

// console.log(popularNumberInfo.number); // Output: 2
// console.log(popularNumberInfo.count); // Output: 4


