const saltRounds = 10;
var jwt = require("jsonwebtoken");
const moment = require('moment')
const dbDrug = require("../config/dbDrug");
const db_office = require("../config/dbHosOff");
const dbQuery = require("../config/dbQueryHosoffice");
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
    query.date_time = moment(query.date_time).format('DD-MM-YYYY HH:MM:SS') 
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
module.exports = { getServiceDrug, getDrugBox, getPerson };
