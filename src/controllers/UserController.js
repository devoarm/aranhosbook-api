const saltRounds = 10;
var jwt = require("jsonwebtoken");
const db_office = require("../config/db");
require("dotenv").config();

const secret = process.env.SECRET_KEY;

const SearchHr = async (req, res) => {  
  const { slug } = req.query;
  console.log(slug)
  try {
    const query = await db_office("hr_person as hp")
      .select("hp.*")
      .whereILike("hp.HR_FNAME", `%${slug}%`)
      .orWhereILike("hp.HR_LNAME", `%${slug}%`);

    return res.json({ status: 200, results: query });
  } catch (error) {
    return res.json({ status: 500, err: error });
  }
};

module.exports = { SearchHr };
