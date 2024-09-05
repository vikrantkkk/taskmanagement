const nodemailer = require("nodemailer");

module.exports.sendEmail = async (mailOptions) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
    }
    });
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent", info.messageId);
    return true;
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};



/**
 * create -> Your account has been created successfully
 * email, password.
 * 
 * 
 * update -> Your account has been Updated successfully
 * your prev mail -> userName, latest userName-> email.
 * password. -> pass
 * 
 */
