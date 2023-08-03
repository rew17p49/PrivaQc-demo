const express = require("express");
const app = express();
const cors = require("cors");
const { sendData } = require("./libs/socket-io");
const port = 3000;

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
  getXBarData,
  getXBarDataByRef,
  addXBarData,
  addXBarRandomData,
  uppdateXBarData,
} = require("./database");

const {
  countKanbanPhase,
  getKanbanDataByRef,
  addKanbanData,
} = require("./db_kanban");

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

app.get("/ref", (req, res) => {
  res.sendFile(__dirname + "/views/reference.html");
});

app.get("/xbar", (req, res) => {
  res.sendFile(__dirname + "/views/xbarChart.html");
});

app.get("/simulation", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});

app.get("/kanban", (req, res) => {
  res.sendFile(__dirname + "/views/kanban-board.html");
});

app.get("/kanban-control", (req, res) => {
  res.sendFile(__dirname + "/views/kanban-control.html");
});

let server = require("http").createServer(app);
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});

// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });

// get Masterdata
app.get("/masterdata", async (req, res) => {
  try {
    const masterData = await getMasterData();
    res.json(masterData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล MasterData" });
  }
});

app.get("/masterdata/:ref", async (req, res) => {
  try {
    const ref = req.params.ref;
    const masterData = await getMasterDataByRef(ref);
    res.json(masterData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล MasterData" });
  }
});

app.post("/masterdata/add", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'MasterData'
    if (data.Reference && data.valueData && data.valueDatetime) {
      await addMasterData(data);
      sendData("ChartOrder", "chart-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
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
    // console.log(data)
    if (data.Reference && data.valueRandom && data.valueDatetime) {
      await addMasterRandomData(data);
      sendData("ChartOrder", "chart-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
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
    sendData("ChartOrder", "chart-update", "reload table");

    res.send(`ลบข้อมูลในตาราง MasterData สำเร็จแล้ว ID=${id}`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลบข้อมูลในตาราง MasterData" });
  }
});

// Xbar
app.get("/xbardata", async (req, res) => {
  try {
    const XBar = await getXBarData();
    res.json(XBar);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล xbar" });
  }
});

app.get("/xbardata/:ref", async (req, res) => {
  try {
    const ref = req.params.ref;
    const XBar = await getXBarDataByRef(ref);
    res.json(XBar);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล X-Bar" });
  }
});

app.post("/xbardata/add", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'xbardata'
    if (data.Reference && data.valueData && data.valueDatetime) {
      await addXBarData(data);
      sendData("XBarOrder", "x-bar-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง Xbardata สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง Xbardata" });
  }
});

app.post("/xbardata/add/random", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'MasterData'
    if (data.Reference && data.valueRandom && data.valueDatetime) {
      await addXBarRandomData(data);
      sendData("XBarOrder", "x-bar-update", "reload table");
      res
        .status(200)
        .json({ message: "เพิ่มข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง MasterData" });
  }
});

app.put("/xbardata/edit/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'MasterData'
    if (data.valueArray) {
      await uppdateXBarData(data, id);
      sendData("XBarOrder", "x-bar-update", "reload table");
      res
        .status(200)
        .json({ message: "อัปเดตข้อมูลในตาราง MasterData สำเร็จแล้ว" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    next(error);
  }
});

// Kanban

app.get("/kanban/test", async (req, res) => {
  try {
    const XBar = await countKanbanPhase("demo", "PLAN");
    res.json(XBar);
    console.log(XBar[0].TotalPhase);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล xbar" });
  }
});

app.get("/kanban/get/:ref", async (req, res) => {
  try {
    const {ref} = req.params;
    const kanban = await getKanbanDataByRef(ref);
    res.json(kanban);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรับข้อมูล KanBan" });
  }
});

app.post("/kanban/add", async (req, res) => {
  try {
    const data = req.body; // ข้อมูลที่คุณต้องการเพิ่มในตาราง 'xbardata'
    let { Reference, phaseArray, content, phase, color, valueDatetime } = data;
    if (Reference && phase) {
      let check = await countKanbanPhase(Reference, phase);
      let phaseLength = check[0].TotalPhase;
      if (phaseLength < 5) {
        await addKanbanData(data);
        sendData("KanbanOrder", "Kanban-update", "reload");
        res
          .status(200)
          .json({ message: "เพิ่มข้อมูลในตาราง KanBan สำเร็จแล้ว" });
      } else {
        res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
      }
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง KanBan" });
  }
});

const { socketConnection } = require("./libs/socket-io");
socketConnection(server);
