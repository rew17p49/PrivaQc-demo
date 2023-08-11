const express = require("express");
const router = express.Router();

const { sql, config, pool } = require("../../config");

const defaultPhaseArray = ["PLAN", "WORK", "CHECK", "DONE"];
const defaultPhase = 0;
const { sendData } = require("../../libs/socket-io");

router.get("/data/:ref", async (req, res) => {
  try {
    let { ref } = req.params;
    let query = `SELECT * FROM KanBan 
    WHERE reference = '${ref}'
    ORDER BY phase ASC, position ASC;`;
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก KanBan: ${error}` });
  }
});

router.put("/reset/status", async (req, res) => {
  try {
    let query = `UPDATE KanBan
        SET showStatus = 0
      WHERE showStatus = 1;`;
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    res.json("reset status");
    console.log("reset status");
  } catch (error) {
    res
      .status(500)
      .json({ message: `เกิดข้อผิดพลาดในการรับข้อมูลจาก KanBan: ${error}` });
  }
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let data = req.body;
    let { content, color } = data;
    let pool = await sql.connect(config);
    if (content && color) {
      let query = `UPDATE KanBan
        SET content  = N'${content}',color = N'${color}'
      WHERE id = ${id};`;
      let result = await pool.request().query(query);
      res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จแล้ว" });
      sendData("KanBan-Board", "kanban-update", "refresh");
      sendData("KanBan-Control", "kanban-update", "refresh");
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูล: ${error} `,
    });
  }
});

router.put("/edit/phase_content/:ref", async (req, res, next) => {
  try {
    let { ref } = req.params;
    let data = req.body;
    let { phaseArray } = data;
    // phaseArray = JSON.stringify(phaseArray);
    let pool = await sql.connect(config);
    if (ref) {
      let query = `UPDATE KanBan
        SET phaseArray  = N'${phaseArray}'
      WHERE reference = N'${ref}';`;
      let result = await pool.request().query(query);
      res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จแล้ว" });
      sendData("KanBan-Board", "kanban-update", "refresh");
      sendData("KanBan-Control", "kanban-update", "refresh");
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูล: ${error} `,
    });
  }
});

// API
router.post("/add/:ref&:content&:color", async (req, res, next) => {
  const defaultColor = "#F4B314";
  try {
    let { ref, content, color } = req.params;
    let phaseArray = JSON.stringify(defaultPhaseArray);
    if (ref && content) {
      let input_color;
      color ? (input_color = `#${color}`) : (input_color = defaultColor);
      console.log("color: ", input_color);
      let query_count_phase = `SELECT COUNT(*) AS TotalPhase FROM KanBan WHERE reference = N'${ref}' AND phase = N'${defaultPhase}'`;
      let query_last_position = `SELECT MAX(position) AS last_position FROM KanBan WHERE reference = N'${ref}' AND phase = N'${defaultPhase}'`;
      let query_check_content = `SELECT COUNT(*) AS sameContent  FROM KanBan WHERE reference = N'${ref}' AND content = N'${content}'`;
      let pool = await sql.connect(config);
      let count_phase = await pool.request().query(query_count_phase);
      let last_position = await pool.request().query(query_last_position);
      let count_content = await pool.request().query(query_check_content);
      let count = count_phase.recordset[0].TotalPhase;
      let last = last_position.recordset[0].last_position;
      let sameContent = count_content.recordset[0].sameContent;
      let position;
      if (count <= 4 && sameContent == 0) {
        last == null ? (position = 0) : (position = parseInt(last) + 1);
        let query = `INSERT INTO KanBan (reference, phaseArray,content ,phase ,color,position,showStatus) 
        VALUES ( N'${ref}',N'${phaseArray}', N'${content}', ${defaultPhase}, N'${input_color}',${position},1)`;
        let result = await pool.request().query(query);
        res.status(200).json({ message: "เพิ่ม Content สำเร็จแล้ว" });
        sendData("KanBan-Board", "kanban-update", "refresh");
        sendData("KanBan-Control", "kanban-update", "refresh");
      } else if (sameContent != 0) {
        res.status(500).json({
          message: `มี '${content}' อยู่แล้ว`,
        });
      } else {
        res.status(500).json({ message: "มี Content ใน Phase ได้ไม่เกิน 5" });
      }
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูล: ${error} `,
    });
  }
});

router.put("/next/:ref&:phase&:position", async (req, res, next) => {
  try {
    let { ref, phase, position } = req.params;
    let pool = await sql.connect(config);
    console.log(ref);
    if (ref && phase && position && phase < 4) {
      let phase_select = parseInt(phase) - 1;
      let phase_new = parseInt(phase_select) + 1;
      let position_select = parseInt(position) - 1;
      let query_count_phase = `SELECT COUNT(*) AS TotalPhase FROM KanBan WHERE reference = N'${ref}' AND phase = N'${phase_new}'`;
      let query_last_position = `SELECT MAX(position) AS last_position FROM KanBan WHERE reference = N'${ref}' AND phase = N'${phase_new}'`;
      let count_phase = await pool.request().query(query_count_phase);
      let last_position = await pool.request().query(query_last_position);
      let count = count_phase.recordset[0].TotalPhase;
      let last = last_position.recordset[0].last_position;

      let command = "";
      for (let i = 0; i < position_select; i++) {
        command += `WHEN position = ${i} THEN ${i}`;
      }
      for (let i = position_select; i <= 4; i++) {
        command += `WHEN position = ${i + 1} THEN ${i}`;
      }

      let query_re_position_select = `UPDATE KanBan
                              SET position = CASE
                                ${command}
                              END
                            WHERE reference = N'${ref}' AND phase = ${phase_select};`;

      let position_new;

      if (count <= 4) {
        last == null ? (position_new = 0) : (position_new = parseInt(last) + 1);
        let query_next = `
          UPDATE KanBan 
          SET phase = ${phase_new},position = ${position_new},showStatus = 1
          WHERE reference = N'${ref}' AND phase = ${phase_select} AND position = ${position_select};
      `;
        let result = await pool.request().query(query_next);
        let re = await pool.request().query(query_re_position_select);
        res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จแล้ว" });
        sendData("KanBan-Board", "kanban-update", "refresh");
        sendData("KanBan-Control", "kanban-update", "refresh");
      } else {
        res.status(500).json({ message: "มี Content ใน Phase ได้ไม่เกิน 5" });
      }
    } else if (phase >= 4) {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ถูกต้อง" });
    } else {
      res.status(500).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูล: ${error} `,
    });
  }
});

router.delete("/delete/:ref&:phase&:position", async (req, res, next) => {
  try {
    let { ref, phase, position } = req.params;
    let pool = await sql.connect(config);
    let phase_select = parseInt(phase) - 1;
    let position_select = parseInt(position) - 1;
    let phaseArray = JSON.stringify(defaultPhaseArray);
    let command = "";
    for (let i = 0; i < position_select; i++) {
      command += `WHEN position = ${i} THEN ${i}`;
    }
    for (let i = position_select; i <= 4; i++) {
      command += `WHEN position = ${i + 1} THEN ${i}`;
    }

    let query_delete = `DELETE FROM KanBan
                WHERE reference = N'${ref}' AND phase = ${phase_select} AND position = ${position_select};`;
    let query_re_position = `UPDATE KanBan
                              SET position = CASE
                                ${command}
                              END
                            WHERE reference = N'${ref}' AND phase = ${phase_select};`;

    let result = await pool.request().query(query_delete);
    let re = await pool.request().query(query_re_position);
    res.status(200).json({ message: "ลบ Content สำเร็จแล้ว" });
    sendData("KanBan-Board", "kanban-update", "refresh");
    sendData("KanBan-Control", "kanban-update", "refresh");
  } catch (error) {
    res.status(500).json({
      message: `เกิดข้อผิดพลาดในการรับข้อมูล: ${error} `,
    });
  }
});

module.exports = router;
