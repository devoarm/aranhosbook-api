var jwt = require("jsonwebtoken");
require("dotenv").config();
const db_office = require("../config/db");
const secret = process.env.SECRET_KEY;
const multer = require("multer");

const BookSendPerson = async (req, res) => {
  const data = req.body;
  try {
    const query = await db_office("book_send_person").insert({
      BOOK_ID: data.BOOK_ID,
      HR_PERSON_ID: data.HR_PERSON_ID,
      READ_STATUS: "False",
      SEND_BY_ID: data.SEND_BY_ID,
      SEND_BY_NAME: data.SEND_BY_NAME,
      SEND_DATE_TIME: data.SEND_DATE_TIME,
    });
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookOnRead = async (req, res) => {
  const data = req.body;
  try {
    const query = await db_office("book_send_person")
      .where("BOOK_ID", data.book_id)
      .andWhere("HR_PERSON_ID", data.auth_id)
      .update({
        READ_STATUS: "True",
      });
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};

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
    const query = await db_office("book_index_send_leader as bl")
      .leftJoin("book_index as b", "bl.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .whereIn("bl.SEND_STATUS", ["SEND", "CHECK", ""])
      .andWhere("bl.SEND_LD_HR_ID", id)
      .orderBy("bl.SEND_LD_DATE_TIME", "desc")
      .count("b.ID as count")
      .first();
    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookIndexSendLeader = async (req, res) => {
  const { id } = req.params;
  // return console.log(req.params);
  try {
    const query = await db_office("book_index_send_leader as bl")
      .innerJoin(
        "book_index_send_leader_secretary as bsl",
        "bl.BOOK_ID",
        "bsl.BOOK_ID"
      )
      .leftJoin("book_index as b", "bl.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .where("bl.SEND_STATUS", "CHECK")
      .andWhere("bl.SEND_LD_HR_ID", id)
      .orderBy([
        { column: "bl.TOP_LEADER_AC_DATE_TIME", order: "desc" },
        { column: "bl.SEND_LD_DATE_TIME", order: "desc" },
      ])
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
      .where("ID", id)
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
      .andWhere("bp.READ_STATUS", "False")
      .orderBy("bp.SEND_DATE_TIME", "desc")
      .select(
        "bp.*",
        "b.BOOK_NAME",
        "b.BOOK_NUMBER",
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
const BookIndexLeaderDecide = async (req, res) => {
  const { bookId } = req.params;
  try {
    const query = await db_office("book_index_send_leader as bl")
      .where("bl.ID", bookId)
      .select("*");
    return res.json({ status: 200, results: query[0] });
  } catch (error) {
    return res.json({ status: 500, results: error.message });
  }
};
const BookHistoryPerson = async (req, res) => {
  const { authId, dateStart, dateEnd } = req.query;

  try {
    const query = await db_office("book_send_person as bp")
      .leftJoin("book_index as b", "bp.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .where("bp.HR_PERSON_ID", authId)
      .where((e) => {
        e.orWhereIn("bp.SEND_DATE_TIME", [dateStart, dateEnd]);
        e.orWhereBetween("bp.SEND_DATE_TIME", [dateStart, dateEnd]);
      })
      .andWhere("bp.READ_STATUS", "True")
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
const BookHistoryLeader = async (req, res) => {
  const { authId, dateStart, dateEnd } = req.query;

  try {
    const query = await db_office("book_index_send_leader as bl")
      .leftJoin("book_index as b", "bl.BOOK_ID", "b.ID")
      .leftJoin("book_index_img as bi", "bi.BOOK_ID", "b.ID")
      .leftJoin("book_urgent as bu", "b.BOOK_URGENT_ID", "bu.URGENT_ID")
      .where((e) => {
        e.orWhereIn("bl.TOP_LEADER_AC_DATE", [dateStart, dateEnd]);
        e.orWhereBetween("bl.TOP_LEADER_AC_DATE", [dateStart, dateEnd]);
      })
      .andWhere("bl.SEND_LD_HR_ID", authId)
      .whereIn("bl.SEND_STATUS", ["YES", "NO"])
      .orderBy([
        { column: "bl.TOP_LEADER_AC_DATE_TIME", order: "desc" },
        // { column: "bl.SEND_LD_DATE_TIME", order: "desc" },
      ])
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
const BookSendToSecretary = async (req, res) => {
  const data = req.body;
  try {
    const checkSended = await db_office("book_index_send_leader").where({
      BOOK_ID: data.BOOK_ID,
      SEND_LD_HR_ID: data.SEND_LD_HR_ID,
      SEND_LD_BY_HR_ID: data.SEND_LD_BY_HR_ID,
    });
    if (checkSended.length > 0) {
      return res.json({ status: 301, results: checkSended });
    } else {
      const query = await db_office("book_index_send_leader").insert({
        BOOK_ID: data.BOOK_ID,
        SEND_LD_HR_ID: data.SEND_LD_HR_ID,
        SEND_LD_HR_NAME: data.SEND_LD_HR_NAME,
        SEND_LD_BY_HR_ID: data.SEND_LD_BY_HR_ID,
        SEND_LD_BY_HR_NAME: data.SEND_LD_BY_HR_NAME,
        SEND_LD_DETAIL: data.SEND_LD_DETAIL,
        SEND_LD_DATE: data.SEND_LD_DATE,
        SEND_LD_DATE_TIME: data.SEND_LD_DATE_TIME,
        SEND_STATUS: data.SEND_STATUS,
      });
      return res.json({ status: 200, results: query });
    }
  } catch (error) {
    return res.json({ status: 500, results: error });
  }
};

module.exports = {
  BookDirector,
  BookIndexSendLeader,
  BookUpdatePdf,
  BookIndexLeaderSign,
  BookLeaderCount,
  BookIndexPerson,
  BookSendPerson,
  BookOnRead,
  BookSendToSecretary,
  BookHistoryPerson,
  BookHistoryLeader,
  BookIndexLeaderDecide,
};
