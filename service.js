const config = require('./dbconfig')
const sql = require('mssql')
const res = require('express/lib/response')

// get data from outbox
async function getOutboxData() {
  try {
    let pool = await sql.connect(config)
    let res = await pool
      .request()
      .query(
        'select * from outbox where wa_mode = 0 and len(wa_no) >=10 and len(wa_no) <= 13',
      )
    return res.recordset
  } catch (err) {
    console.log(err)
    return false
  }
}

// update status of success message
async function updateStatusSuccess(seq, wa_no) {
  try {
    let pool = await sql.connect(config)
    let res = await pool
      .request()
      .query(
        `update outbox set wa_mode = 1 where id=${seq} and wa_no= CAST(${wa_no} as varchar(200))`,
      )
    return res.recordset
  } catch (err) {
    console.log(err)
    return false
  }
}

// update status of failed message
async function updateStatusFailed(seq, wa_no) {
  try {
    let pool = await sql.connect(config)
    let res = await pool
      .request()
      .query(`update outbox set wa_mode = 0 where id=${seq} and wa_no=${wa_no}`)
    return res.recordset
  } catch (err) {
    console.log(err)
    return false
  }
}

// update status of failed message
async function updateStatusInvalidNumber(seq, wa_no) {
  try {
    let pool = await sql.connect(config)
    let res = await pool
      .request()
      .query(`update outbox set wa_mode = 2 where id=${seq} and wa_no=${wa_no}`)
    return res.recordset
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = {
  getOutboxData: getOutboxData,
  updateStatusSuccess: updateStatusSuccess,
  updateStatusFailed: updateStatusFailed,
  updateStatusInvalidNumber: updateStatusInvalidNumber,
}
