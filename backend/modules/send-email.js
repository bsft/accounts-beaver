const sgMail = require("@sendgrid/mail");

function getEmailHandler(api_key) {
  sgMail.setApiKey(api_key);
  return async function sendEmail(
    recipients,
    subject,
    text,
    html,
    attachments
  ) {
    try {
      await sgMail.send({
        from: "Accounts Beaver Team <coucoulr@oregonstate.edu>", // sender address
        to: recipients, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html bodys
        attachments, // array of attachment objects
      });
      console.log(`Message sent to ${recipients}.`);
    } catch (e) {
      console.error(e);
      if (e.response) {
        console.error(e.response.body);
      }
    }
  };
}

module.exports = { getEmailHandler };
