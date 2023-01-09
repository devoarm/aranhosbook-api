const saltRounds = 10;
var jwt = require("jsonwebtoken");
const db_office = require("../config/db");
const dbQuery = require("../config/dbQuery");
require("dotenv").config();
var async = require("async");

const secret = process.env.SECRET_KEY;

const SearchFullnamePerson = async (req, res) => {
  const { fullname, authId, book_id } = req.query;

  try {
    if (fullname === "") {
      const findName = await db_office
        .queryBuilder()
        .fromRaw(
          `(SELECT hp.ID as hr_id, hp.HR_FNAME, hp.HR_LNAME,CONCAT(hp.HR_FNAME," ",hp.HR_LNAME) as fullname FROM hr_person as hp WHERE hp.ID != ${authId}) as ss`
        )

        .whereIn("ss.hr_id", [6, 3088,3322])
        .select(
          "ss.*",
          db_office.raw(
            `CASE WHEN (select count(*) as count from book_send_person bp2 where bp2.SEND_BY_ID=${authId} and bp2.HR_PERSON_ID=ss.hr_id and bp2.BOOK_ID = ${book_id}) > 0 THEN 'send' ELSE 'unsend' END as status_send`
          )
        )
        .limit(5);
      return res.json({ status: 200, results: findName });
    } else {
      const findName = await db_office
        .queryBuilder()
        .fromRaw(
          `(SELECT hp.ID as hr_id, hp.HR_FNAME, hp.HR_LNAME,CONCAT(hp.HR_FNAME," ",hp.HR_LNAME) as fullname FROM hr_person as hp WHERE hp.ID != ${authId}) as ss`
        )
        .whereILike("ss.fullname", `%${fullname}%`)
        .select(
          "ss.*",          
          db_office.raw(
            `CASE WHEN (select count(*) as count from book_send_person bp2 where bp2.SEND_BY_ID=${authId} and bp2.HR_PERSON_ID=ss.hr_id and bp2.BOOK_ID = ${book_id}) > 0 THEN 'send' ELSE 'unsend' END as status_send`
          )
        )
        .limit(5);

      return res.json({ status: 200, results: findName });
    }
  } catch (error) {
    return res.json({ status: 500, err: error.message });
  }
};

module.exports = { SearchFullnamePerson };
