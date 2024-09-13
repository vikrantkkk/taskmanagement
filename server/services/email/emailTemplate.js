const emailHeader = `
  <div style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0;">TaskPro Manager</h1>
    <p style="margin: 10px 0 0 0;">Your ultimate task management solution</p>
  </div>`;

const emailFooter = `
  <div style="background-color: #ecf0f1; padding: 20px; text-align: center;">
    <p style="margin: 0;">&copy; 2024 TaskPro Manager. All rights reserved.</p>
    <p style="margin: 5px 0 0 0;">For any assistance, contact us at support@taskpromanager.com</p>
    <p style="margin: 5px 0 0 0;">123 Task Street, Productivity City, TaskLand</p>
  </div>`;

const congratulationEmail = ({ email }) => {
  return {
    subject: "Welcome to TaskPro Manager!",
    html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello, ${email}!</p>
          <p>Welcome to TaskPro Manager! We’re excited to have you on board.</p>
          <p>Start organizing your tasks, managing your projects, and collaborating with your team.</p>
          <p>If you have any questions, feel free to reach out to our support team at any time.</p>
          <p>Happy managing!</p>
        </div>
        ${emailFooter}
      `,
  };
}

const otpEmail = ({ email, otp }) => {
  return {
    subject: "Your OTP for TaskPro Manager",
    html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello, ${email}!</p>
          <p>Thank you for signing up with TaskPro Manager. Please use the following OTP to verify your account:</p>
          <p><strong>OTP: ${otp}</strong></p>
          <p>The OTP will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        ${emailFooter}
      `,
  };
};

const profileUpdateEmail = ({ email, name }) => {
  return {
    subject: "Profile Updated Successfully - TaskPro Manager",
    html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello, ${name}!</p>
          <p>Your profile has been updated successfully on TaskPro Manager. Below are your updated details:</p>
          <ul>
            <li><strong>First Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>If you did not initiate this update, please contact our support team immediately.</p>
        </div>
        ${emailFooter}
      `,
  };
};

const changePasswordEmail = ({ email }) => {
  return {
    subject: "Your Password Has Been Changed - TaskPro Manager",
    html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>We want to inform you that the password for your TaskPro Manager account associated with the email <strong>${email}</strong> has been changed successfully.</p>
          <p>If you did not initiate this change, please contact our support team immediately to secure your account.</p>
          <p>If you requested this password change, no further action is needed.</p>
          <p>For security purposes, we recommend using a strong password and enabling two-factor authentication (if available).</p>
        </div>
        ${emailFooter}
      `,
  };
};


const forgotPasswordEmail = ({ email, otp }) => {
  return {
    subject: "Your Password Reset OTP for TaskPro Manager",
    html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello, ${email}!</p>
          <p>You requested to reset your password. Please use the following OTP to reset your password:</p>
          <p><strong>OTP: ${otp}</strong></p>
          <p>The OTP will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        ${emailFooter}
      `,
  };
};


const passwordResetConfirmationEmail = ({ email }) => {
  return {
    subject: "Password Reset Confirmation - TaskPro Manager",
    html: `
      ${emailHeader}
      <div style="padding: 20px;">
        <p>Hello, ${email}!</p>
        <p>Your password has been successfully reset. You can now log in with your new password.</p>
        <p>If you did not initiate this request, please contact our support team immediately.</p>
      </div>
      ${emailFooter}
    `,
  };
};

const accountDeletionEmail = ({ email }) => {
  return {
    subject: "Account Deletion Confirmation - TaskPro Manager",
    html: `
      ${emailHeader}
      <div style="padding: 20px;">
        <p>Hello, ${email}!</p>
        <p>We want to let you know that your account has been successfully deleted from TaskPro Manager.</p>
        <p>If you believe this action was taken in error or if you have any questions, please reach out to our support team at support@taskpromanager.com.</p>
        <p>Thank you for using TaskPro Manager.</p>
      </div>
      ${emailFooter}
    `,
  };
};

const taskDueReminderEmail = ({ email, name, taskName, dueDate }) => {
  return {
    subject: `Reminder: Task "${taskName}" is due soon!`,
    html: `
      ${emailHeader}
      <p>Hello, ${name} (${email})!</p>
      <p>This is a reminder that your task <strong>"${taskName}"</strong> is due on <strong>${dueDate}</strong>.</p>
      <p>Please ensure the task is completed on time.</p>
      ${emailFooter}
    `,
  };
};

module.exports = {
  congratulationEmail,
  otpEmail,
  profileUpdateEmail,
  changePasswordEmail,
  forgotPasswordEmail,
  passwordResetConfirmationEmail,
  accountDeletionEmail,
  taskDueReminderEmail,
};
