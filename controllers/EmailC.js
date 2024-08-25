import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_MAIL,
  SMTP_PASSWORD,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_PASSWORD,
  },
});

class EmailC {
  static async sendEmail(req, res, next) {
    try {
      const { email, message } = req.body;
      console.log(req.body);
      const info = await transporter.sendMail({
        from: SMTP_MAIL,
        to: SMTP_MAIL,
        subject: `Message from the site from user ${email}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background: #1c2827; border-radius: 10px; padding: 5px 10px;">
          <h2 style="color: #E8920B;">New Message from ${email}</h2>
          <p style="font-size: 16px; color: #E8920B;">${message}</p>
          <hr style="border: 1px solid #E8920B;" />
          <footer style="font-size: 14px; color: #fff;">
            <p>This message was sent from your website.</p>
          </footer>
        </div>
      `,
      });

      res.json({
        status: 'success',
        info,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async emailVerification(email, verificationCode) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_MAIL,
        to: email,
        subject: 'Email Verification',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 2px solid #E8920B; border-radius: 10px; background-color: #1c2827;">
          <h2 style="color: #E8920B; text-align: center;">Email Verification</h2>
          <p style="font-size: 16px; color: #E8920B;">To confirm your email, please enter the following verification code:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; color: #E8920B; font-weight: bold;">${verificationCode}</span>
          </div>
          <p style="font-size: 14px; color: #fff; text-align: center;">If you did not request this verification, please ignore this email.</p>
        </div>
      `,
      });

      return {
        status: 'success',
        info,
      };
    } catch (e) {
      console.error('Error sending verification email:', e);
      throw e;
    }
  }

  static async resetPassword(email, verificationCode) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_MAIL,
        to: email,
        subject: 'Reset Password',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 2px solid #E8920B; border-radius: 10px; background-color: #1c2827;">
          <h2 style="color: #E8920B; text-align: center;">Reset Password</h2>
          <p style="font-size: 16px; color: #E8920B;">To change your password, follow this link and follow the further instructions.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a  href="http://localhost:3000/reset/password/${verificationCode}" style="font-size: 24px; color: #E8920B; font-weight: bold;">http://localhost:3000/reset/password/${verificationCode}</a>
          </div>
          <p style="font-size: 14px; color: #fff; text-align: center;">If you did not request this verification, please ignore this email.</p>
        </div>
      `,
      });

      return {
        status: 'success',
        info,
      };
    } catch (e) {
      console.error('Error sending reset password:', e);
      throw e;
    }
  }

  // eslint-disable-next-line consistent-return
  static async sendPdfTicket(email, file) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_MAIL,
        to: email,
        subject: 'Your Ticket',
        text: 'This ticket is required to watch the film.',
        attachments: [
          {
            filename: file.originalname,
            path: file.path,
          },
        ],
      });
      return {
        status: 'success',
        info,
      };
    } catch (e) {
      console.error('Error sending pdf ticket:', e);
    }
  }
}

export default EmailC;
