const saltRounds = 10;
var jwt = require("jsonwebtoken");
const moment = require("moment");
const dbDrug = require("../config/dbDrug");
const db_office = require("../config/dbHosOff");
const dbQuery = require("../config/dbQueryHosoffice");
const dbHosXp = require("../config/dbQueryHosXp");
require("dotenv").config();

const secret = process.env.SECRET_KEY;

const getServiceDrug = async (req, res) => {
  try {
    const data = req.body;
    const checkNameSend = await dbDrug("person as p").where(
      "p.person_fullname",
      data.senderName
    );
    if (checkNameSend.length < 1) {
      let query = await dbDrug("person").insert({
        person_fullname: data.senderName,
      });
    }
    const checkNameReceive = await dbDrug("person as p").where(
      "p.person_fullname",
      data.recipientName
    );
    if (checkNameReceive.length < 1) {
      let query = await dbDrug("person").insert({
        person_fullname: data.recipientName,
      });
    }

    const currentDrug = await dbDrug("drug_box")
      .where("drug_box_id", data.boxNumber)
      .update({
        drug_box_status: data.serviceType,
        current_send_person: data.senderName,
        current_receive_person: data.recipientName,
        date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

    const query = await dbDrug("service_box").insert({
      drug_box_id: data.boxNumber,
      sender_name: data.senderName,
      recipient_name: data.recipientName,
      service_type: data.serviceType,
      service_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res.status(200).json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, err: error.message });
  }
};
const getDrugBox = async (req, res) => {
  try {
    const query = await dbDrug("drug_box").select("*");
    query.date_time = moment(query.date_time).format("DD-MM-YYYY HH:MM:SS");
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, err: error.message });
  }
};
const getPerson = async (req, res) => {
  try {
    const query = await dbDrug("person").select("*").orderBy("person_fullname");
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, err: error.message });
  }
};
const addServiceBox = async (req, res) => {
  const data = req.body;

  try {
    const checkNameSend = await dbDrug("person as p").where(
      "p.person_fullname",
      data.boxOut.person_fullname
    );
    if (checkNameSend.length < 1) {
      let query = await dbDrug("person").insert({
        person_fullname: data.boxOut.person_fullname,
      });
    }
    const checkNameReceive = await dbDrug("person as p").where(
      "p.person_fullname",
      data.boxIn.person_fullname
    );
    if (checkNameReceive.length < 1) {
      let query = await dbDrug("person").insert({
        person_fullname: data.boxIn.person_fullname,
      });
    }

    const currentDrug = await dbDrug("drug_box")
      .where("drug_box_id", data.box.drug_box_id)
      .update({
        drug_box_status: data.serviceType,
        current_send_person: data.boxOut.person_fullname,
        current_receive_person: data.boxIn.person_fullname,
        current_ward: data.ward.department,
        date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

    const query = await dbDrug("service_box").insert({
      drug_box_id: data.box.drug_box_id,
      sender_name: data.boxOut.person_fullname,
      recipient_name: data.boxIn.person_fullname,
      ward_name: data.ward.department,
      service_type: data.serviceType,
      service_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    return res.json({ status: 200, results: req.body });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const getWard = async (req, res) => {
  var sql = `SELECT k.depcode,k.department FROM kskdepartment k`;
  dbHosXp.query(sql, (err, result) => {
    if (err) return res.json({ status: 500, message: err });
    else return res.json({ status: 200, results: result });
  });
};
const addBox = async (req, res) => {
  try {
    const checkText = await dbDrug("drug_box").where(
      "drug_box_name",
      req.body.drug_box_name
    );
    if (checkText.length > 0) {
      return res.json({ status: 301, results: "same name" });
    }
    const query = await dbDrug("drug_box").insert({
      drug_box_name: req.body.drug_box_name,
    });
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const addDrug = async (req, res) => {
  try {
    const checkText = await dbDrug("drug").where(
      "drug_name",
      req.body.drug_name
    );
    if (checkText.length > 0) {
      return res.json({ status: 301, results: "same name" });
    }
    const query = await dbDrug("drug").insert({
      drug_name: req.body.drug_name,
    });
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const getDrug = async (req, res) => {
  try {
    const query = await dbDrug("drug").select('*')
  
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
module.exports = {
  getServiceDrug,
  getDrugBox,
  getPerson,
  addServiceBox,
  getWard,
  addBox,
  addDrug,
  getDrug
};
