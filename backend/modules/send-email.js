// send-email module
// Wraps SendGrid API and exposes email handler function to send email.
// Example usage:
//   const email = require("send-email");
//   const emailHandler = email.getEmailHandler(API_KEY);
//   emailhandler.send(
//     ["Recipient Name <recipient@email.address>", ...],
//     "Subject Line Text",
//     "Body Plaintext", // plaintext version of body
//     "<p>Body Plaintext</p>", // html version of body
//     [{
//       content: 'base64string', // base64 encoded attachment content
//       filename: 'fname.pdf',
//       type: 'application/pdf',
//       disposition: 'attachment',
//       content_id: 'mycontent'
//     }]
//   )

const sgMail = require("@sendgrid/mail");

// Takes SendGrid API key
// Returns an object with send method which takes email parameters and sends email.
function getEmailHandler(api_key) {
  sgMail.setApiKey(api_key);
  return {
    send: async function sendEmail({
      recipients,
      subject,
      text,
      html,
      attachments,
    }) {
      try {
        await sgMail.send({
          from: "Accounts Beaver Team <coucoulr@oregonstate.edu>", // sender address
          to: recipients, // list of receivers
          subject, // Subject line
          text, // plain text body
          html, // html body
          attachments, // list of attachment objects
        });
        console.log(`Message sent to ${recipients}.`);
      } catch (e) {
        console.error(e);
        if (e.response) {
          console.error(e.response.body);
        }
      }
    },
  };
}

module.exports = { getEmailHandler };
