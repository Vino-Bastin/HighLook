module.exports = function (error, req, res, next) {
  let message = error.message;
  if (error.message === "jwt expired") {
    message = "Your session got expired please login again";
    res.clearCookie("token");
  }

  if (error.code === 11000) {
    message = `${Object.entries(error.keyValue)[0][0].toUpperCase()} : ${
      Object.entries(error.keyValue)[0][1]
    } is Already Used. Please provide a New Value.`;
  }

  if (error.errors) {
    message = "";
    Object.entries(error.errors).map((err) => {
      message += `${err[0].toUpperCase()} : ${err[1].message}. `;
    });
  }

  res.status(400).json({
    status: "failed",
    message,
  });
};
