const { sql, config, pool } = require("./config");

// 'MasterData'
async function getMasterData() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM MasterData");
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง MasterData:", error);
    return [];
  }
}

async function getMasterDataByRef(ref) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT * FROM MasterData WHERE Reference = '${ref}'`);
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง MasterData:", error);
    return [];
  }
}

async function addMasterData(data) {
  try {
    let { Reference, valueData, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);
    const query = `INSERT INTO MasterData (Reference,valueData, valueDatetime) 
      VALUES ( N'${Reference}',${valueData}, '${valueDatetime}')`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'MasterData'
    const result = await pool.request().query(query);
    console.log("เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง MasterData:", error);
  }
}

async function addMasterRandomData(data) {
  try {
    let { Reference, valueRandom, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);

    for (let i = 0; i < valueRandom.length; i++) {
      const query = `INSERT INTO MasterData (Reference,valueData, valueDatetime) 
      VALUES ( N'${Reference}',${valueRandom[i]}, '${valueDatetime}')`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'MasterData'
      const result = await pool.request().query(query);
    }

    console.log("เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง MasterData:", error);
  }
}

async function deleteMasterDataById(id) {
  try {
    const pool = await sql.connect(config);
    const query = `DELETE FROM MasterData WHERE valueID = @valueID`;
    const result = await pool
      .request()
      .input("valueID", sql.Int, id)
      .query(query);
    console.log(
      `ลบข้อมูลในตาราง MasterData สำเร็จแล้ว ข้อมูลที่ถูกลบ: ID=${id}`
    );
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการลบข้อมูลในตาราง MasterData:", error);
  }
}

// 'Xbar-Chart'
async function getXBarData() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM XBarChart");
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง XBarChart:", error);
    return [];
  }
}

async function getXBarDataByRef(ref) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT * FROM XBarChart WHERE Reference = '${ref}'`);
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง XBarChart:", error);
    return [];
  }
}

async function addXBarData(data) {
  try {
    let { Reference, valueData, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);
    const query = `INSERT INTO XBarChart (Reference,valueArray,valueDatetime) 
      VALUES ( N'${Reference}',N'${valueData}', '${valueDatetime}')`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'XBarChart'
    const result = await pool.request().query(query);
    console.log("เพิ่มข้อมูลในตาราง XBarChart สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง XBarChart:", error);
  }
}

async function uppdateXBarData(data, id) {
  try {
    let { valueArray } = data;
    // valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);
    const query = `UPDATE XBarChart SET valueArray = N'${valueArray}' WHERE id = ${id}`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'XBarChart'
    const result = await pool.request().query(query);
    console.log("อัปเดตข้อมูลในตาราง XBarChart สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง XBarChart:", error);
  }
}

async function addXBarRandomData(data) {
  try {
    let { Reference, valueRandom, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);
    valueRandom = JSON.parse(valueRandom);
    for (let i = 0; i < valueRandom.length; i++) {
      const query = `INSERT INTO XBarChart (Reference,valueArray, valueDatetime)
      VALUES ( N'${Reference}',N'${JSON.stringify(
        valueRandom[i]
      )}', '${valueDatetime}')`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'XBarChart'
      const result = await pool.request().query(query);
    }

    console.log("เพิ่มข้อมูลในตาราง XBarChart สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง XBarChart:", error);
  }
}

module.exports = {
  sql,
  getMasterData,
  getMasterDataByRef,
  addMasterData,
  addMasterRandomData,
  deleteMasterDataById,
  getXBarData,
  getXBarDataByRef,
  addXBarData,
  addXBarRandomData,
  uppdateXBarData,
};
