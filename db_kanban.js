const { sql, config, pool } = require("./config");

async function getKanbanDataByRef(ref) {

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT * FROM KanBan WHERE Reference = '${ref}'`);
    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง KanBan:", error);
    return [];
  }
}

async function countKanbanPhase(ref, phase) {

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT COUNT(*) AS TotalPhase FROM KanBan WHERE Reference = '${ref}' AND phase = N'${phase}'`
      );

    return result.recordset;
  } catch (error) {
    console.log("เกิดข้อผิดพลาดในการเรียกข้อมูลจากตาราง KanBan:", error);
    return [];
  }
}

async function addKanbanData(data) {
  try {
    let { Reference, phaseArray, content, phase, color, valueDatetime } = data;
    valueDatetime = valueDatetime.replace(",", " ");
    const pool = await sql.connect(config);
    const query = `INSERT INTO KanBan (Reference , phaseArray ,content, phase ,color , valueDatetime) 
      VALUES ( N'${Reference}',N'${phaseArray}', N'${content}', N'${phase}', N'${color}','${valueDatetime}')`;
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
};
