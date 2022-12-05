const nodeMailer = require("nodemailer");

const HTML_LOGIN = (name, location) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Login</title>
    <style>
      div {
        padding-bottom: 10px;
      }
      .con {
        overflow-x: none;
        border: 1px solid black;
        padding: 20px;
        border-radius: 20px;
      }
      .con h3 {
        margin-top: 0%;
        width: 100%;
        text-align: center;
      }
      .reset-link {
        margin-bottom: 10px;
        text-align: center;
      }
      button {
        color: white;
        background-color: #5cb85c;
        border-color: #5cb85c;
        font-size: 14px;
        padding: 6px 12px;
        margin-bottom: 0;
        display: inline-block;
        text-decoration: none;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 6px;
      }
      button:focus {
        color: #333;
        background-color: #e6e6e6;
        border-color: #8c8c8c;
      }
      button:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }
    </style>
  </head>
  <body>
    <h1>Hi ${name}</h1>
    <div class="con">
      <h3>HighLook New Login</h3>
      <div>
        We detected Your account was logged in from ${location} at ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}.
      </div>
      <div>
        If It is not You, Please reset your password and contact your admin to
        secure your account.
      </div>
      <div class="reset-link">
        <a href="https://highlook.onrender.com/signin">
          <button>Click here for login</button>
        </a>
      </div>
      <div style="padding: 0; padding-top: 10px">Thanks,</div>
      <div style="padding: 0">Administration Teams,</div>
      <div>HighLook</div>
    </div>
  </body>
</html>`;
};

const HTML_RESET = (link) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: "Inter";
        font-style: normal;
      }
      div {
        padding-bottom: 10px;
      }
      .con {
        overflow-x: none;
        border: 1px solid black;
        padding: 20px;
        border-radius: 20px;
      }
      .con h3 {
        margin-top: 0%;
        width: 100%;
        text-align: center;
      }
      .reset-link {
        margin-bottom: 10px;
        text-align: center;
      }
      button {
        color: white;
        background-color: #5cb85c;
        border-color: #5cb85c;
        font-size: 14px;
        padding: 6px 12px;
        margin-bottom: 0;
        display: inline-block;
        text-decoration: none;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 6px;
      }
      button:focus {
        color: #333;
        background-color: #e6e6e6;
        border-color: #8c8c8c;
      }
      button:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }
    </style>
  </head>
  <body>
    <h1>Reset Your Password</h1>
    <div class="con">
      <h3>HighLook password reset</h3>
      <div>
        We heard that you lost your HighLook password. Sorry about that!
      </div>
      <div>
        But Don't worry! You can use the following button to reset your
        password:
      </div>
      <div class="reset-link">
        <a href=${link}
          ><button class="btn btn-success">Reset your password</button></a
        >
      </div>
      <div>
        If you don't use this link within 10 minutes, it will expire. To get a
        new link, visit
        <a href="https://highlook.onrender.com/signin">
          https://highlook.onrender.com/signin
        </a>
      </div>

      <div style="padding: 0; padding-top: 10px">Thanks,</div>
      <div style="padding: 0">Administration Teams,</div>
      <div>HighLook</div>
    </div>
  </body>
</html>`;
};

const HTML_NEW_USER = (name, email, role) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to HighLook</title>
    <style>
      div {
        padding-bottom: 10px;
      }
      .con {
        overflow-x: none;
        border: 1px solid black;
        padding: 20px;
        border-radius: 20px;
      }
      .con h3 {
        margin-top: 0%;
        width: 100%;
        text-align: center;
      }
      .reset-link {
        margin-bottom: 10px;
        text-align: center;
      }
      button {
        color: white;
        background-color: #5cb85c;
        border-color: #5cb85c;
        font-size: 14px;
        padding: 6px 12px;
        margin-bottom: 0;
        display: inline-block;
        text-decoration: none;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 6px;
      }
      button:focus {
        color: #333;
        background-color: #e6e6e6;
        border-color: #8c8c8c;
      }
      button:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }
    </style>
  </head>
  <body>
    <h1>Hi ${name}</h1>
    <div class="con">
      <h3>Welcome to HighLook</h3>
      <div>
        A warm welcome to high look, Your account was created successfully with
        the following details:
      </div>
      <div>
        <p>Name : ${name}</p>
        <p>User Id : ${email}</p>
        <p>Role : ${role}</p>
      </div>
      <div>
        Please contact the administrator to know your login credentials. Stay
        Safe and wish very happy journey with HighLook.
      </div>
      <div class="reset-link">
        <a href="https://highlook.onrender.com/signin">
          <button>Click here for login</button>
        </a>
      </div>
      <div style="padding: 0; padding-top: 10px">Thanks,</div>
      <div style="padding: 0">Administration Teams,</div>
      <div>HighLook</div>
    </div>
  </body>
</html>`;
};

const HTML_PASSWORD_RESET_SUCCESS = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      div {
        padding-bottom: 10px;
      }
      .con {
        overflow-x: none;
        border: 1px solid black;
        padding: 20px;
        border-radius: 20px;
      }
      .con h3 {
        margin-top: 0%;
        width: 100%;
        text-align: center;
      }
      .reset-link {
        margin-bottom: 10px;
        text-align: center;
      }
      button {
        color: white;
        background-color: #5cb85c;
        border-color: #5cb85c;
        font-size: 14px;
        padding: 6px 12px;
        margin-bottom: 0;
        display: inline-block;
        text-decoration: none;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 6px;
      }
      button:focus {
        color: #333;
        background-color: #e6e6e6;
        border-color: #8c8c8c;
      }
      button:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }
    </style>
  </head>
  <body>
    <h1>Hi ${name}</h1>
    <div class="con">
      <h3>HighLook New Password</h3>
      <div>Your Account Password has been reset successfully.</div>
      <div class="reset-link">
        <a href="https://highlook.onrender.com/signin">
          <button>Click here for login</button>
        </a>
      </div>
      <div>Please login with a new password to access your resources.</div>
      <div style="padding: 0; padding-top: 10px">Thanks,</div>
      <div style="padding: 0">Administration Teams,</div>
      <div>HighLook</div>
    </div>
  </body>
</html>`;
};

exports.sendLoginMail = (email, name, location) => {
  const mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  emailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "New Login was detected",
    html: HTML_LOGIN(name, location),
  };

  mailTransporter.sendMail(emailOptions, function (err, info) {
    if (err) console.log(err.message);
    else console.log(info);
  });
};

exports.sendPasswordResetMail = (link, email) => {
  const mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  emailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Password Reset Mail",
    html: HTML_RESET(link),
  };

  mailTransporter.sendMail(emailOptions, function (err, info) {
    if (err) console.log(err.message);
    else console.log(info);
  });
};

exports.sendNewUserMail = (name, email, role) => {
  const mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  emailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Welcome to HighLook",
    html: HTML_NEW_USER(name, email, role),
  };

  mailTransporter.sendMail(emailOptions, function (err, info) {
    if (err) console.log(err.message);
    else console.log(info);
  });
};

exports.sendPasswordResetSuccessMail = (name, email) => {
  const mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  emailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Password Reset success",
    html: HTML_PASSWORD_RESET_SUCCESS(name),
  };

  mailTransporter.sendMail(emailOptions, function (err, info) {
    if (err) console.log(err.message);
    else console.log(info);
  });
};
