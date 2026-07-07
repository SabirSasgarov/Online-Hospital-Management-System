

namespace HMS.Infrastructure.Services
{
	public class EmailService(IOptions<SmtpSettings> smtpOptions) : IEmailService
	{
		private readonly SmtpSettings _settings = smtpOptions.Value;

		public async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, CancellationToken cancellationToken = default)
		{
			var message = new MimeMessage();
			message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
			message.To.Add(new MailboxAddress(toName, toEmail));
			message.Subject = subject;	
			message.Body = new TextPart("html") { Text = htmlBody };

			using var client = new SmtpClient();
			await client.ConnectAsync(_settings.Host, _settings.Port,
				_settings.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None, cancellationToken);
			await client.AuthenticateAsync(_settings.UserName, _settings.Password, cancellationToken);
			await client.SendAsync(message, cancellationToken);
			await client.DisconnectAsync(true, cancellationToken);
		}

		public async Task SendPasswordResetCodeEmailAsync(string toEmail, string toName, string code, CancellationToken cancellationToken = default)
			=> await SendEmailAsync(toEmail, toName, "Your Phantoms Password Reset Code",
				EmailTemplates.PasswordResetCode(toName, code), cancellationToken);

		public async Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default)
			=> await SendEmailAsync(toEmail, toName, "Welcome to Phantoms!",
				EmailTemplates.Welcome(toName), cancellationToken);
	}
}
