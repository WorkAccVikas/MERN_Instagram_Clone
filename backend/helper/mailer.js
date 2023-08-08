const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../config/config");

// https://ethereal.email/create
/** send mail from real gmail account */

/** POST: http://localhost:5000/sendMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123@gmail.com",
  "text" : "",
  "subject" : "",
}
*/
const sendMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // let config = {
  //   service: "gmail",
  //   auth: {
  //     user: EMAIL,
  //     pass: PASSWORD,
  //   },
  // };

  // let transporter = nodemailer.createTransport(config);

  // let MailGenerator = new Mailgen({
  //   theme: "default",
  //   product: {
  //     name: "Mailgen",
  //     link: "https://mailgen.js/",
  //   },
  // });

  // // Todo : body of the email
  // var email = {
  //   body: {
  //     name: username,
  //     intro: text || "Welcome to Instagram",
  //     outro:
  //       "Need help, or have questions? Just reply to this email, we'd love to help.",
  //   },
  // };

  // var emailBody = MailGenerator.generate(email);

  // let message = {
  //   from: EMAIL,
  //   to: userEmail,
  //   subject: subject || "Signup Successful",
  //   html: emailBody,
  // };

  // Todo : send mail

  const [transporter, message] = nodeMailerDetails(
    username,
    userEmail,
    text,
    subject
  );

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us." });
    })
    .catch((error) => res.status(500).send({ error }));
};

function nodeMailerDetails(
  username = "",
  userEmail = "",
  text = "",
  subject = ""
) {
  // console.log("nodeMailerDetails");
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  // Todo : body of the email
  var email = {
    body: {
      name: username,
      intro: text || "Welcome to Instagram",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  const array = [transporter, message];

  return array;
}

module.exports = { sendMail, nodeMailerDetails };
