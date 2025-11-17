import { transporter } from '../utils/mailer.js';

export const sendLoginCredentials = async (email, password) => {
  const mailOptions = {
    // eslint-disable-next-line no-undef
    from: `"Project Team" <${process.env.GOOGLE_MAIL}>`,
    to: email,
    subject: 'Your Account Credentials',
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
          <h2 style="color: #2e86de;">Welcome to the System</h2>
          <p style="font-size: 16px; color: #555;">
            Sizning tizimga kirish ma'lumotlaringiz tayyor:
          </p>
          <p style="font-size: 18px; color: #333;">
            <b>Email:</b> ${email}<br>
            <b>Password:</b> ${password}
          </p>
          <p style="color: #777;">
            Iltimos, tizimga kirgandan so'ng o'zingizga qulay yangi parol o'rnatishingizni tavsiya qilamiz.
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
