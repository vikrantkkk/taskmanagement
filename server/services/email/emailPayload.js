const { sendEmail } = require("./email");
const EmailTemplate = require("./emailTemplate");

module.exports.mailPayload = (template_id, payload) => {
  let template;
  switch (template_id) {
    case "forgot_password":
      template = EmailTemplate.forgotPasswordEmail(payload);
      break;
    case "create_account":
      template = EmailTemplate.congratulationEmail(payload);
      break;
    case "otp_verification":
      template = EmailTemplate.otpEmail(payload);
      break;
    case "profile_update":
      template = EmailTemplate.profileUpdateEmail(payload);
      break;
    case "change_password":
      template = EmailTemplate.changePasswordEmail(payload);
      break;
    case "password_reset_confirmation":
      template = EmailTemplate.passwordResetConfirmationEmail(payload);
      break;
    case "account_delete":
      template = EmailTemplate.accountDeletionEmail(payload);
      break;
    default:
      console.log("default Case");
      break;
  }

  let mailPayload = {
    from: process.env.EMAIL_USERNAME,
    to: payload.email,
    cc: payload?.cc || [],
    subject: template.subject,
    html: template.html,
  };

  sendEmail(mailPayload);
};
