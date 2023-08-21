const express = require("express");
const router = express.Router();

const { sql, config, pool } = require("../../config");
const { sendData } = require("../../libs/socket-io");

// MasterData
router.get("/data/:ref", async (req, res) => {
  try {
    let { ref } = req.params;
    let query = `SELECT * FROM MasterData WHERE Reference = '${ref}'`;
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก MasterData: ${error}`,
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    const data = req.body;
    let { Reference, valueData, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    if (data.Reference && data.valueData && data.valueDatetime) {
      let query = `INSERT INTO MasterData (Reference,valueData, valueDatetime) 
      VALUES ( N'${Reference}',${valueData}, '${valueDatetime}')`;
      let pool = await sql.connect(config);
      let result = await pool.request().query(query);
      sendData("ChartOrder", "chart-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก MasterData: ${error}`,
    });
  }
});

router.post("/add_radom", async (req, res) => {
  try {
    const data = req.body;
    let { Reference, valueRandom, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    if (data.Reference && data.valueData && data.valueDatetime) {
      for (let i = 0; i < valueRandom.length; i++) {
        const query = `INSERT INTO MasterData (Reference,valueData, valueDatetime) 
        VALUES ( N'${Reference}',${valueRandom[i]}, '${valueDatetime}')`; // เปลี่ยน column1, column2, column3 เป็นชื่อคอลัมน์ที่เหมาะสมในตาราง 'MasterData'
        const result = await pool.request().query(query);
      }
      sendData("ChartOrder", "chart-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก MasterData: ${error}`,
    });
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const query = `DELETE FROM MasterData WHERE valueID = ${id}`;
    const result = await pool.request().query(query);
    sendData("ChartOrder", "chart-update", "reload table");
    res.send(`ลบข้อมูลในตาราง MasterData สำเร็จแล้ว ID=${id}`);
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก MasterData: ${error}`,
    });
  }
});
