namespace HMS.Infrastructure.Templates;

public static class EmailTemplates
{
    private const string BaseStyle = @"
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background: #1a1a2e; padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .body { padding: 40px 30px; }
          .body p { color: #333; line-height: 1.6; }
          .code-box { display: inline-block; margin: 24px 0; padding: 16px 40px; background: #1a1a2e; color: #e94560; font-size: 36px; font-weight: bold; letter-spacing: 10px; border-radius: 8px; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>";

    public static string PasswordResetCode(string userName, string code)
    {
        var year = DateTime.UtcNow.Year;
        return $@"<!DOCTYPE html>
<html lang=""en"">
<head><meta charset=""UTF-8""/><meta name=""viewport"" content=""width=device-width, initial-scale=1.0""/>
<title>Password Reset</title>{BaseStyle}</head>
<body>
  <div class=""container"">
    <div class=""header""><h1>CareFlow</h1></div>
    <div class=""body"">
      <p>Hello <strong>{userName}</strong>,</p>
      <p>We received a request to reset your password. Use the code below to set a new password:</p>
      <div style=""text-align:center;""><span class=""code-box"">{code}</span></div>
      <p>This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
    </div>
  </div>
</body></html>";
    }

    public static string Welcome(string userName)
    {
        var year = DateTime.UtcNow.Year;
        return $@"<!DOCTYPE html>
<html lang=""en"">
<head><meta charset=""UTF-8""/><meta name=""viewport"" content=""width=device-width, initial-scale=1.0""/>
<title>Welcome to CareFlow</title>{BaseStyle}</head>
<body>
  <div class=""container"">
    <div class=""header""><h1>Welcome to CareFLow</h1></div>
    <div class=""body"">
      <p>Hello <strong>{userName}</strong>,</p>
      <p>Your account has been successfully created!</p>
      <p>You can now log in.</p>
    </div>
  </div>
</body></html>";
    }
}

