const { sql, config, pool } = require("./config");

async function getKanbanDataByRef(ref) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT * FROM KanBan 
              WHERE reference = '${ref}'
              ORDER BY phase ASC, position ASC;`);
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง KanBan:", error);
    return [];
  }
}

async function countKanbanPhase(id, phase) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT COUNT(*) AS TotalPhase FROM KanBan WHERE id = ${id} AND phase = N'${phase}'`
      );

    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง KanBan:", error);
    return [];
  }
}

async function addKanbanData(ref, content) {
  try {
    let phaseArray = ["PLAN", "WORK", "CHECK", "DONE"];
    phaseArray = JSON.stringify(phaseArray);
    const pool = await sql.connect(config);
    const query = `INSERT INTO KanBan (reference, phaseArray,content ,phase ,color,position ) 
      VALUES ( N'${ref}',N'${phaseArray}', N'${content}', 0, N'#F4B314',0)`;
    const result = await pool.request().query(query);
    console.log("เพิ่มข้อมูลในตาราง KanBan สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง KanBan:", error);
  }
}

async function updateKanbanData(data, id) {
  try {
    let { content, color } = data;
    const pool = await sql.connect(config);
    const query = `
      UPDATE KanBan 
      SET content = N'${content}',color = N'${color}''
      WHERE id = ${id};
    `;
    const result = await pool.request().query(query);
    // console.log("เพิ่มข้อมูลในตาราง KanBan สำเร็จแล้ว");
    return "เพิ่มข้อมูลในตาราง KanBan สำเร็จแล้ว";
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง KanBan:", error.message);
    return "เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง KanBan:" + error.message; 
  }
}

async function updateKanbanPhase(data, id) {
  try {
    let { phase, phaseArray } = data;
    let nextPhase = parseInt(phase) + 1;
    const pool = await sql.connect(config);
    const query = `
      UPDATE KanBan 
      SET phase = N'${nextPhase}'
      WHERE id = ${id};
    `;
    const result = await pool.request().query(query);
    console.log("เพิ่มข้อมูลในตาราง KanBan สำเร็จแล้ว");
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเพิ่มข้อมูลในตาราง KanBan:", error);
  }
}

module.exports = {
  getKanbanDataByRef,
  addKanbanData,
  countKanbanPhase,
  updateKanbanData,
  updateKanbanPhase,
};
