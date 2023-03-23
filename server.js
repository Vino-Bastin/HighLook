const mongoose = require("mongoose");

const app = require("./app");

// error Handling
const errHandler = function (err) {
  console.log(`🔥 ${err.name} ${err.message}`);
  process.exit(1);
};
process.on("uncaughtException", errHandler);
process.on("unhandledRejection", errHandler);

//mongoDB connection
const DB_CONNECTION_URL = process.env.DB_SERVER_URL.replace(
  "<password>",
  process.env.DB_SERVER_PASSWORD
);
mongoose
  .connect(DB_CONNECTION_URL)
  .then(console.log("DB connection was established"))
  .catch((err) => {
    console.log(err.message);
  });

// running server on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
