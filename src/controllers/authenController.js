const saltRounds = 10;
var jwt = require("jsonwebtoken");
require("dotenv").config();
const db_office = require("../config/db");
var md5 = require("md5");

const secret = process.env.SECRET_KEY;
const leaderId = process.env.LEADER_ID;

const login = async (req, res) => {
  let body = req.body;
  try {
    const checkLogin = await db_office("hr_person")
      .where("HR_USERNAME", body.username)
      .andWhere("HR_PASSWORD", md5(body.password))
      .limit(1);
    if (checkLogin.length > 0) {      
      let role = checkLogin[0].ID == leaderId ? "leader" : "user";
      var token = jwt.sign(
        {
          username: checkLogin[0].HR_USERNAME,
          userId: checkLogin[0].ID,
          role: role,
          f_name: checkLogin[0].HR_FNAME,
          l_name: checkLogin[0].HR_LNAME,
        },
        secret
      );
      return res.json({
        status: 200,
        msg: "success",
        token: token,
        results: checkLogin
      });
    } else {
      return res.json({
        status: 401,
        msg: "noUser",
      });
    }
  } catch (error) {
    return res.json({ status: 500, err: error.message });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  var token = jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ status: 200, msg: "You have been Logged Out", token });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

const CheckToken = async (req, res) => {
  return res.json({ status: 200, msg: "IsLogedin", headers: req.headers });
};
module.exports = { login, CheckToken };
