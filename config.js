const sql = require("mssql");

const config = {
  // main
  user: "privaQc",
  password: "p@ssw0rd",
  server: "119.59.96.61",
  database: "privaQC",

  // test
  // user: "sa",
  // password: "P@ssw0rd",
  // server: "192.169.1.7",
  // database: "IMCT_DEMO",

  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: true,
  },
};

const pool = new sql.ConnectionPool(config);

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("เชื่อมต่อกับฐานข้อมูล SQL Server สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล SQL Server:", error);
  }
}

// เรียกใช้ฟังก์ชันเพื่อเชื่อมต่อกับฐานข้อมูล
connectToDatabase();

module.exports = {
  sql,
  config,
  pool
}