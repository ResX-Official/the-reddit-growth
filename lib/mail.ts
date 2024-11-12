import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const createEmailTemplate = (
  title: string,
  message: string,
  buttonText: string,
  buttonLink: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: block;
            margin: 0 auto 30px;
            max-width: 200px;
        }
        h1 {
            color: #000000;
            text-align: center;
            margin-bottom: 20px;
            font-size: 28px;
            font-weight: bold;
        }
        h1 span {
            color: #800000;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #800000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            transition: background-color 0.3s ease;
            font-size: 14px;
        }
        .button:hover {
            background-color: #800000;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
 <h1 className="text-4xl font-bold">
      <span className="text-red-500">Reddit</span>
      <span className="text-black">Growth</span>
    </h1>        <h1><span>Reddit</span>Growth</h1>
        <p>${message}</p>
        <p style="text-align: center;">
            <a href="${buttonLink}" class="button">${buttonText}</a>
        </p>
        <p style="font-style: italic; color: #888;">If you didn't request this, please ignore this email.</p>
        <div class="footer">
            <p>Thanks,<br><strong>RedditGrowth Team</strong></p>
            <p>Contact us: <a href="mailto:support@redditgrowth.com">support@redditgrowth.com</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `https://app.redditgrowth.com/auth/new-password?token=${token}`;
  const emailHtml = createEmailTemplate(
    "Reset Your Password",
    "You've requested to reset your password. Click the button below to set a new password:",
    "RESET PASSWORD",
    resetLink
  );

  await resend.emails.send({
    from: "support@redditgrowth.com",
    to: email,
    subject: "Reset Your Password",
    html: emailHtml,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `https://app.redditgrowth.com/auth/new-verification?token=${token}`;
  const emailHtml = createEmailTemplate(
    "Verify Your Email",
    "Thank you for signing up with RedditGrowth! Please click the button below to verify your email address:",
    "VERIFY EMAIL",
    confirmLink
  );

  await resend.emails.send({
    from: "support@redditgrowth.com",
    to: email,
    subject: "Verify Your Email",
    html: emailHtml,
  });
};
