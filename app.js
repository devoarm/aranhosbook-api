var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./src/routes/index");
var cors = require('cors')

var app = express();

app.use(cookieParser());
app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(anotherPath));
app.use(express.static(path.join(__dirname, "public")));

// console.log(path.join(__dirname, "public"));
app.use("/", indexRouter);
app.use("/user", require("./src/routes/userRoutes"));
app.use("/file", require("./src/routes/fileRoutes"));
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/book", require("./src/routes/bookRoutes"));
app.use("/person", require("./src/routes/personRoutes"));
app.use("/drug", require("./src/routes/drugRoutes"));
app.use("/dbudget", require("./src/routes/dbudgetRoutes"));

module.exports = app;
