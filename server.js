const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
// const ipAddress = "127.0.11.11";

// Middleware สำหรับรับข้อมูล JSON
app.use(express.json());
app.use(cors());

app.use(express.static("node_modules"));
app.use(express.static("public"));
app.use(express.static("assets"));
app.use(express.static("routes"));

// เรียกใช้งานไฟล์ db.js เพื่อเชื่อมต่อกับฐานข้อมูล SQL Server
const {
  getMasterData,
  getMasterDataByRef,
  addMasterData,
  addMasterRandomData,
  deleteMasterDataById,
} = require("./database");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/sampling", (req, res) => {
  res.sendFile(__dirname + "/views/sampling.html");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// get data
app.get("/masterdata", async (req, res) => {
  try {
    const masterData = await getMasterData();
    res.json(masterData);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล MasterData" });
  }
});

app.get("/masterdata/:ref", async (req, res) => {
 
  try {
    const ref = req.params.ref;
    const masterData = await getMasterDataByRef(ref);
    res.json(masterData);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล MasterData" });
  }
});

app.post("/masterdata/add", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'MasterData'
    if (data.Reference && data.valueData && data.valueDatetime) {
      await addMasterData(data);
      res.status(200).json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง MasterData" });
  }
});

app.post("/masterdata/add/random", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'MasterData'
    if (data.Reference && data.valueRandom && data.valueDatetime) {
      await addMasterRandomData(data);
      res.status(200).json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง MasterData" });
  }
});

app.delete("/masterdata/delete/:id", async (req, res) => {
  try {
    const id = req.params.id; // ค่า ID ที่รับเข้ามาในเส้นทาง
    await deleteMasterDataById(id);
    res.send(`ลบข้อมูลในตาราง MasterData สำเร็จแล้ว ID=${id}`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบข้อมูลในตาราง MasterData" });
  }
});
