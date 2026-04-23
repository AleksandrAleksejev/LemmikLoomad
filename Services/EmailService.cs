using MailKit.Net.Smtp;
using MimeKit;
using Lemmikloomad.Models;

namespace Lemmikloomad.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        // ===== BOOKING CONFIRMATION =====
        public async Task SendBookingConfirmationAsync(User user, Broneering b)
        {
            var subject = "Broneeringu kinnitus – VetClinic 🐾";
            var headerColor = "linear-gradient(135deg,#0d7c5f 0%,#1aab80 100%)";
            var headerIcon = "🐾";
            var headerTitle = "Broneering registreeritud!";

            var statusBox = """
                <div style="background:#fef3c7;border-radius:10px;padding:16px;margin-bottom:24px;">
                  <p style="margin:0;color:#92400e;font-size:14px;">
                    ⏳ <strong>Staatus: Ootel kinnitust</strong><br>
                    Kliinik võtab teiega ühendust broneeringu kinnitamiseks.
                  </p>
                </div>
            """;

            var html = BuildEmailHtml(user, b, subject, headerColor, headerIcon, headerTitle, statusBox);
            await SendAsync(user.Email, user.Name, subject, html);
        }

        // ===== CANCELLATION =====
        public async Task SendCancellationEmailAsync(User user, Broneering b)
        {
            var subject = "Teie broneering on tühistatud – VetClinic";
            var headerColor = "linear-gradient(135deg,#ef4444 0%,#dc2626 100%)";
            var headerIcon = "❌";
            var headerTitle = "Broneering tühistatud";

            var statusBox = $"""
                <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:20px;margin-bottom:24px;">
                  <p style="margin:0 0 8px;color:#991b1b;font-size:15px;font-weight:700;">❌ Teie broneering on tühistatud</p>
                  <p style="margin:0;color:#b91c1c;font-size:14px;">
                    Kahjuks on kliinik teie broneeringu tühistanud.<br>
                    Palun tehke uus broneering sobivale ajale või helistage kliinikusse: <strong>{b.Kliinik?.Telefon}</strong>
                  </p>
                </div>
            """;

            var html = BuildEmailHtml(user, b, subject, headerColor, headerIcon, headerTitle, statusBox);
            await SendAsync(user.Email, user.Name, subject, html);
        }

        // ===== CONFIRMATION BY ADMIN =====
        public async Task SendApprovalEmailAsync(User user, Broneering b)
        {
            var subject = "Teie broneering on kinnitatud – VetClinic ✅";
            var headerColor = "linear-gradient(135deg,#0d7c5f 0%,#1aab80 100%)";
            var headerIcon = "✅";
            var headerTitle = "Broneering kinnitatud!";

            var statusBox = $"""
                <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:20px;margin-bottom:24px;">
                  <p style="margin:0 0 8px;color:#065f46;font-size:15px;font-weight:700;">✅ Teie broneering on kinnitatud!</p>
                  <p style="margin:0;color:#047857;font-size:14px;">
                    Ootame teid {b.KuupAev:dd.MM.yyyy} kell <strong>{b.KuupAev:HH:mm}</strong>.<br>
                    Küsimuste korral helistage: <strong>{b.Kliinik?.Telefon}</strong>
                  </p>
                </div>
            """;

            var html = BuildEmailHtml(user, b, subject, headerColor, headerIcon, headerTitle, statusBox);
            await SendAsync(user.Email, user.Name, subject, html);
        }

        // ===== 1-HOUR REMINDER =====
        public async Task SendReminderEmailAsync(User user, Broneering b)
        {
            var subject = $"⏰ Meeldetuletus: protseduur {b.KuupAev:dd.MM} kell {b.KuupAev:HH:mm} – VetClinic";
            var headerColor = "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)";
            var headerIcon = "⏰";
            var headerTitle = "Meeldetuletus – 1 tund jäänud!";

            var statusBox = $"""
                <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:20px;margin-bottom:24px;">
                  <p style="margin:0 0 8px;color:#92400e;font-size:16px;font-weight:700;">⏰ Teie protseduur algab 1 tunni pärast!</p>
                  <p style="margin:0;color:#b45309;font-size:14px;">
                    Palun olge õigel ajal kohal. Kui te ei saa tulla, helistage kliinikusse: <strong>{b.Kliinik?.Telefon}</strong>
                  </p>
                </div>
            """;

            var html = BuildEmailHtml(user, b, subject, headerColor, headerIcon, headerTitle, statusBox);
            await SendAsync(user.Email, user.Name, subject, html);
        }

        // ===== SHARED HTML BUILDER =====
        private static string BuildEmailHtml(User user, Broneering b,
            string subject, string headerColor, string headerIcon, string headerTitle, string statusBox)
        {
            var notesHtml = string.IsNullOrEmpty(b.Markused) ? "" : $"""
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-weight:600;width:160px;">📝 Märkused:</td>
                  <td style="padding:8px 0;color:#111827;">{b.Markused}</td>
                </tr>
            """;

            return $"""
                <!DOCTYPE html>
                <html lang="et">
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td align="center" style="padding:40px 20px;">
                      <table width="600" cellpadding="0" cellspacing="0"
                        style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
                        <tr>
                          <td style="background:{headerColor};padding:36px;text-align:center;">
                            <div style="font-size:48px;margin-bottom:10px;">{headerIcon}</div>
                            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">{headerTitle}</h1>
                            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">VetClinic – Professionaalne veterinaariateenistus</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:36px;">
                            <p style="font-size:18px;color:#111827;margin:0 0 20px;">Tere, <strong>{user.Name}</strong>!</p>
                            {statusBox}
                            <div style="background:#f8fafc;border-left:4px solid #0d7c5f;border-radius:10px;padding:24px;margin-bottom:20px;">
                              <p style="margin:0 0 14px;font-weight:700;color:#111827;font-size:15px;">📋 Broneeringu andmed:</p>
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;width:160px;">🐾 Lemmikloom:</td>
                                  <td style="padding:7px 0;color:#111827;font-weight:500;">{b.Lemmikloom?.Nimi} ({b.Lemmikloom?.Liik})</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">💉 Protseduur:</td>
                                  <td style="padding:7px 0;color:#111827;font-weight:500;">{b.Protseduur?.Nimi}</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">🏥 Kliinik:</td>
                                  <td style="padding:7px 0;color:#111827;">{b.Kliinik?.Nimi}</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">📍 Aadress:</td>
                                  <td style="padding:7px 0;color:#111827;">{b.Kliinik?.Aadress}</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">📅 Kuupäev:</td>
                                  <td style="padding:7px 0;color:#111827;font-weight:700;font-size:15px;">{b.KuupAev:dd.MM.yyyy} kell {b.KuupAev:HH:mm}</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">⏱ Kestus:</td>
                                  <td style="padding:7px 0;color:#111827;">{b.Protseduur?.Kestus} minutit</td>
                                </tr>
                                <tr>
                                  <td style="padding:7px 0;color:#6b7280;font-weight:600;">💶 Hind:</td>
                                  <td style="padding:7px 0;color:#0d7c5f;font-weight:700;font-size:16px;">{b.Protseduur?.Hind:F2} €</td>
                                </tr>
                                {notesHtml}
                              </table>
                            </div>
                            <p style="color:#6b7280;font-size:13px;margin:0;">
                              Täname, et valisite VetClinic! Teie lemmiku tervis on meie prioriteet. 🐾
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="background:#1f2937;padding:20px;text-align:center;">
                            <p style="color:#9ca3af;font-size:13px;margin:0 0 4px;">VetClinic — Teie lemmiku tervis on meie prioriteet</p>
                            <p style="color:#6b7280;font-size:12px;margin:0;">© {DateTime.Now.Year} VetClinic. Kõik õigused kaitstud.</p>
                          </td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
        }

        // ===== PASSWORD RESET =====
        public async Task SendPasswordResetEmailAsync(string toEmail, string toName, string resetLink)
        {
            var subject = "Parooli lähtestamine – VetClinic 🔐";
            var html = $"""
                <!DOCTYPE html>
                <html lang="et">
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td align="center" style="padding:40px 20px;">
                      <table width="600" cellpadding="0" cellspacing="0"
                        style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
                        <tr>
                          <td style="background:linear-gradient(135deg,#0d7c5f 0%,#1aab80 100%);padding:36px;text-align:center;">
                            <div style="font-size:48px;margin-bottom:10px;">🔐</div>
                            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">Parooli lähtestamine</h1>
                            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">VetClinic – Professionaalne veterinaariateenistus</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:36px;">
                            <p style="font-size:18px;color:#111827;margin:0 0 20px;">Tere, <strong>{toName}</strong>!</p>
                            <p style="color:#374151;font-size:15px;margin:0 0 24px;">
                              Saime teie konto jaoks parooli lähtestamise taotluse. Klõpsake alloleval nupul uue parooli määramiseks.
                            </p>
                            <div style="text-align:center;margin:0 0 24px;">
                              <a href="{resetLink}" style="display:inline-block;background:linear-gradient(135deg,#0d7c5f,#1aab80);color:#fff;padding:16px 40px;border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;">
                                🔑 Lähtesta parool
                              </a>
                            </div>
                            <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px;margin-bottom:24px;">
                              <p style="margin:0;color:#92400e;font-size:13px;">
                                ⚠️ See link kehtib <strong>1 tund</strong>. Kui te ei taotlenud parooli lähtestamist, ignoreerige seda kirja.
                              </p>
                            </div>
                            <p style="color:#6b7280;font-size:13px;margin:0;">Täname, et kasutate VetClinic'i! 🐾</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="background:#1f2937;padding:20px;text-align:center;">
                            <p style="color:#9ca3af;font-size:13px;margin:0;">© {DateTime.Now.Year} VetClinic. Kõik õigused kaitstud.</p>
                          </td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
            await SendAsync(toEmail, toName, subject, html);
        }

        // ===== SMTP SEND =====
        private async Task SendAsync(string toEmail, string toName, string subject, string html)
        {
            var smtpHost = _config["Email:SmtpHost"];
            var smtpUser = _config["Email:Username"];
            var smtpPass = _config["Email:Password"];

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser) ||
                smtpUser == "your-email@gmail.com" || string.IsNullOrEmpty(smtpPass))
                throw new InvalidOperationException("Email credentials not configured in appsettings.json.");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_config["Email:SenderName"], _config["Email:SenderEmail"]));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = html }.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost,
                int.Parse(_config["Email:SmtpPort"] ?? "587"),
                MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(smtpUser, smtpPass);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Email sent to {Email}: {Subject}", toEmail, subject);
        }
    }
}
