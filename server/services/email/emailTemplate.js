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

  const forgotPasswordEmail = ({ otp, resetToken }) => {
    return {
      subject: "Password Reset Request - TaskPro Manager",
      html: `
        ${emailHeader}
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following OTP to proceed with resetting your password:</p>
          <p><strong>OTP: ${otp}</strong></p>
          <p>If you prefer, you can also use the reset token:</p>
          <p><strong>Reset Token: ${resetToken}</strong></p>
          <p>This OTP and token will expire in 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        ${emailFooter}
      `,
    };
  };
  

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
  };
  

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
  

module.exports = {
  forgotPasswordEmail,
  congratulationEmail,
  otpEmail,
};
