const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.Resend_API_KEY);

const logoHeader = `
<tr>
  <td align="center" style="padding:0 0 16px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <img
            src="https://img.icons8.com/doodle/48/film-reel--v1.png"
            alt="Kineq logo"
            width="40"
            height="40"
            style="display:block;border-radius:50%;background:#ffffff;border:1px solid #e0e0e0;"
          />
        </td>
        <td style="vertical-align:middle;">
          <span style="font-size:28px;font-weight:900;color:#111111;letter-spacing:-1px;font-family:Arial,Helvetica,sans-serif;">
            Kineq
          </span>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const sendOnboardingMail = async (userEmail, FirstName, subject) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Kineq <onboarding@kin-eq.snowpie.me>",
      to: [userEmail],
      subject: subject,
      html: `<!DOCTYPE html>
                <html>
                  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111111;">
                    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                      Welcome to Kineq, ${FirstName}! Track your dramas, anime & shows — all in one place, free forever.
                    </div>
                
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;">
                      <tr>
                        <td align="center" style="padding:20px 10px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
                
                            ${logoHeader}
                
                            <tr>
                              <td style="background:#ffffff;border:1px solid #000000;border-radius:10px;padding:28px 20px;">
                
                                <!-- Badge -->
                                <div style="display:inline-block;background:#111111;color:#ffffff;border-radius:999px;padding:6px 10px;font-size:10px;letter-spacing:1px;text-transform:uppercase;">
                                  Welcome Aboard
                                </div>
                
                                <!-- Greeting -->
                                <h1 style="margin:14px 0 6px 0;font-size:24px;line-height:1.3;color:#111111;">
                                  Hi ${FirstName}, you're in! 🎉
                                </h1>
                                <p style="margin:0 0 18px 0;font-size:14px;line-height:1.6;color:#444444;">
                                  Your account is all set for <strong>${userEmail}</strong>. Kineq is your personal space to organise, track, and never lose track of anything you watch — from K-dramas and anime to Hollywood shows and beyond.
                                </p>
                
                                <!-- Divider -->
                                <div style="border-top:1px solid #e0e0e0;margin:0 0 18px 0;"></div>
                
                                <!-- What you can do heading -->
                                <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#111111;">
                                  Here's what you can do with Kineq
                                </p>
                
                                <!-- Feature 1 -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right:12px;">
                                      <div style="width:32px;height:32px;background:#111111;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">
                                        📋
                                      </div>
                                    </td>
                                    <td valign="top">
                                      <p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#111111;">Watchlist</p>
                                      <p style="margin:0;font-size:13px;line-height:1.5;color:#555555;">Save anything you want to watch next. Never forget a title again.</p>
                                    </td>
                                  </tr>
                                </table>
                
                                <!-- Feature 2 -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right:12px;">
                                      <div style="width:32px;height:32px;background:#111111;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">
                                        ▶️
                                      </div>
                                    </td>
                                    <td valign="top">
                                      <p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#111111;">Ongoing</p>
                                      <p style="margin:0;font-size:13px;line-height:1.5;color:#555555;">Track shows you're currently watching so you always know where you left off.</p>
                                    </td>
                                  </tr>
                                </table>
                
                                <!-- Feature 3 -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right:12px;">
                                      <div style="width:32px;height:32px;background:#111111;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">
                                        ✅
                                      </div>
                                    </td>
                                    <td valign="top">
                                      <p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#111111;">Completed</p>
                                      <p style="margin:0;font-size:13px;line-height:1.5;color:#555555;">Log everything you've finished and organise them into custom folders your way.</p>
                                    </td>
                                  </tr>
                                </table>
                
                                <!-- Feature 4 -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
                                  <tr>
                                    <td width="36" valign="top" style="padding-right:12px;">
                                      <div style="width:32px;height:32px;background:#111111;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">
                                        🤖
                                      </div>
                                    </td>
                                    <td valign="top">
                                      <p style="margin:0 0 2px 0;font-size:14px;font-weight:700;color:#111111;">AI Chatbot</p>
                                      <p style="margin:0;font-size:13px;line-height:1.5;color:#555555;">Ask anything — get info on movies, series, anime, or personalised recommendations instantly.</p>
                                    </td>
                                  </tr>
                                </table>
                
                                <!-- CTA Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
                                  <tr>
                                    <td align="center">
                                      <a href="https://kin-eq.snowpie.me/watchlist" style="display:inline-block;background:#111111;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;letter-spacing:0.5px;">
                                        Go to my Watchlist →
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                
                                <!-- Divider -->
                                <div style="border-top:1px solid #000000;margin:0 0 14px 0;"></div>
                
                                <p style="margin:0;font-size:14px;line-height:1.6;color:#222222;">
                                  Best regards,<br>
                                  <strong>Kineq</strong>
                                </p>
                              </td>
                            </tr>
                
                            <tr>
                              <td align="center" style="padding:12px 6px 0 6px;font-size:11px;line-height:1.5;color:#777777;">
                                Kineq &nbsp;·&nbsp; kin-eq.snowpie.me &nbsp;·&nbsp; Free Forever
                              </td>
                            </tr>
                
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>`,
    });
    if (error) console.log("Error sending onboarding email:", error);
    console.log("Email sent successfully:", data.id);
  } catch (error) {
    console.error("Error sending onboarding email:", error);
  }
};

const sendEmailVerificationMail = async (userEmail, verificationOtp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Kineq <verification@kin-eq.snowpie.me>",
      to: [userEmail],
      subject: "Verify your email",
      html: `<!DOCTYPE html>
                <html>
                  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111111;">
                    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                      Your Kineq OTP is ${verificationOtp}. Valid for 2 minutes.
                    </div>
                
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;">
                      <tr>
                        <td align="center" style="padding:20px 10px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
                
                            ${logoHeader}
                
                            <tr>
                              <td style="background:#ffffff;border:1px solid #000000;border-radius:10px;padding:22px 16px;">
                                <div style="display:inline-block;background:#111111;color:#ffffff;border-radius:999px;padding:6px 10px;font-size:10px;letter-spacing:1px;text-transform:uppercase;">
                                  Email Verification
                                </div>
                
                                <h1 style="margin:12px 0 8px 0;font-size:22px;line-height:1.3;color:#111111;">
                                  Verify your email
                                </h1>
                
                                <p style="margin:0 0 10px 0;font-size:14px;line-height:1.6;color:#222222;">
                                  We received a verification request for <strong>${userEmail}</strong>.
                                </p>
                
                                <p style="margin:0 0 10px 0;font-size:14px;line-height:1.6;color:#222222;">
                                  Enter this OTP in the app:
                                </p>
                
                                <div style="margin:0 0 12px 0;border:1px solid #000000;border-radius:8px;background:#fafafa;padding:12px 8px;text-align:center;font-family:Courier New,monospace;font-size:24px;font-weight:700;letter-spacing:4px;color:#111111;">
                                  ${verificationOtp}
                                </div>
                
                                <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#222222;">
                                  This OTP is valid for 2 minutes.
                                </p>
                
                                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#222222;">
                                  This was an auto generated email, please do not reply.
                                  <!-- <a href="mailto:support@kin-eq.snowpie.me" style="color:#111111;font-weight:700;text-decoration:none;">
                                    support@kin-eq.snowpie.me
                                  </a>. -->
                                </p>
                
                                <div style="border-top:1px solid #000000;margin:0 0 12px 0;"></div>
                
                                <p style="margin:0;font-size:14px;line-height:1.6;color:#222222;">
                                  Best regards,<br>
                                  <strong>Kineq</strong>
                                </p>
                              </td>
                            </tr>
                
                            <tr>
                              <td align="center" style="padding:12px 6px 0 6px;font-size:11px;line-height:1.5;color:#777777;">
                                Kineq &nbsp;·&nbsp; kin-eq.snowpie.me
                              </td>
                            </tr>
                
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>`,
    });
    if (error) console.log("Error sending verification email:", error);
    console.log("Email sent successfully:", data.id);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = {
  sendOnboardingMail,
  sendEmailVerificationMail,
};
