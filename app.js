const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const userRouter = require("./router/userRouter");
const errorController = require("./controller/errorController");
const orderRouter = require("./router/orderRouter");

const app = express();

// environment variable
dotenv.config({ path: ".env" });

//morgan to log request in console
app.use(morgan("common"));

// cookie parser
app.use(cookieParser());

// to convert request json file
app.use(express.json());

//cors
let corsOriginAllowedUrl = ["http://localhost:3000", "http://127.0.0.1:3000"];

if (process.env.CLIENT_URL) {
  corsOriginAllowedUrl.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    methods: ["POST", "GET", "PATCH"],
    credentials: true,
    origin: corsOriginAllowedUrl,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static(path.join(__dirname, "build")));

app.use("/api", userRouter);
app.use("/api/orders", orderRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//global error controller
app.use(errorController);
module.exports = app;
