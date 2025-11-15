import { transporter } from '../utils/mailer.js';

export const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    // eslint-disable-next-line no-undef
    from: `"Project Team" <${process.env.GOOGLE_MAIL}>`,
    to: email,
    subject: 'Email Verification Code',
    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
        text-align: center;
      ">
        <div style="
          background-color: #ffffff;
          max-width: 450px;
          margin: 0 auto;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        ">
          <h2 style="color: #2e86de;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">
            Assalomu alaykum! Sizning tasdiqlash kodingiz:
          </p>
          <div style="
            background-color: #2e86de;
            color: white;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            display: inline-block;
          ">
            ${code}
          </div>
          <p style="color: #777;">
            Kod <b>5 daqiqa</b> davomida amal qiladi.<br>
            Agar siz bu so'rovni yubormagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 13px; color: #999;">
            &copy; ${new Date().getFullYear()} Project Team. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
