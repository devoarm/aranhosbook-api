var jwt = require("jsonwebtoken");
require("dotenv").config();
const db_office = require("../config/db");
const secret = process.env.SECRET_KEY;
const multer = require("multer");

const BookUpdatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, `${process.env.DOCUMENT_PATH}`);
      },
      filename: function (req, file, callback) {
        const ext = file.mimetype.split("/").filter(Boolean).slice(1).join("/");
        callback(null, `${id}.${ext}`);
      },
    });
    var upload = multer({ storage: storage }).array("pdf", 100);
    upload(req, res, function (err) {
      if (err) {
        console.log("error");
        console.log(err);
        return res.end("Error uploading file.");
      } else {
        return res.status(200).json({ msg: "ok" });
      }
    });
  } catch (error) {
    console.log("error");
    console.log(error.message);
  }
};

const BookDirector = async (req, res) => {
  try {
    const query = await db_office("book_send_person as bs")
      .leftJoin("book_index as bi", "bs.BOOK_ID", "bi.ID")
      .where("bs.HR_PERSON_ID", process.env.LEADER_ID)
      .select(
        "bs.ID as book_send_person_id",
        "bs.BOOK_ID",
        "bs.HR_PERSON_ID",
        "bs.SEND_BY_NAME",
        "bi.BOOK_NAME",
        "bi.BOOK_DETAIL",
        "bi.BOOK_DATE",
        "bi.DATE_TIME_SAVE",
        "bi.BOOK_SECRET_ID"
      )
      .orderBy("BOOK_DATE", "desc");

    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error });
  }
};
const BookLeaderCount = async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db_office("book_index_send_leader")
      .whereIn("SEND_STATUS", ["SEND", "CHECK"])
      .andWhere("SEND_LD_HR_ID", id)
      .count("id as count")
      .first();

    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookIndexPersonCount = async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db_office("book_send_person")
      .where("HR_PERSON_ID", id)
      // .andWhere("READ_STATUS", false)
      .count("id as count")
      .first();

    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookIndexSendLeader = async (req, res) => {
  const { id, slug } = req.params;
  const statusBook = slug == 1 ? ["SEND", "CHECK"] : ["YES", "NO"];
  try {
    const query = await db_office("book_index_send_leader as bl")
      .leftJoin("book_index as b", "bl.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .whereIn("bl.SEND_STATUS", statusBook)
      .andWhere("bl.SEND_LD_HR_ID", id)
      .orderBy("bl.SEND_LD_DATE_TIME", "desc")
      .select(
        "b.BOOK_NAME",
        "b.BOOK_NUMBER",
        "b.BOOK_DETAIL",
        "b.BOOK_URGENT_ID",
        "bu.URGENT_NAME",
        "bl.*",
        "bi.ID as BOOK_IMAGE_ID",
        "bi.FILE_TYPE"
      );
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookIndexLeaderSign = async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db_office("book_index_send_leader")
      .where("BOOK_ID", id)
      .update({
        SEND_STATUS: req.body.SEND_STATUS,
        TOP_LEADER_AC_NAME: req.body.TOP_LEADER_AC_NAME,
        TOP_LEADER_AC_ID: req.body.TOP_LEADER_AC_ID,
        TOP_LEADER_AC_DATE: req.body.TOP_LEADER_AC_DATE,
        TOP_LEADER_AC_DATE_TIME: req.body.TOP_LEADER_AC_DATE_TIME,
        TOP_LEADER_AC_CMD: req.body.TOP_LEADER_AC_CMD,
      });
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookIndexPerson = async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db_office("book_send_person as bp")
      .leftJoin("book_index as b", "bp.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .where("bp.HR_PERSON_ID", id)
      .orderBy("bp.SEND_DATE_TIME", "desc")
      .select(
        "bp.*",
        "b.BOOK_NAME",
        "b.BOOK_DETAIL",
        "b.BOOK_URGENT_ID",
        "bu.URGENT_NAME",
        "bi.ID as BOOK_IMAGE_ID",
        "bi.FILE_TYPE"
      );
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};

module.exports = {
  BookDirector,
  BookIndexSendLeader,
  BookUpdatePdf,
  BookIndexLeaderSign,
  BookLeaderCount,
  BookIndexPerson,
  BookIndexPersonCount,
};
